import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { baseURL, commonHeaders, handleError } from "./constants";
import {
  APIResponse,
  imageSearchEngines,
  messages,
  Models,
  reverseImageSearchEngines,
  upscaleResponse,
  mediaPlatforms,
  languageCodes,
  newsCategories,
} from "./types";
import * as fs from "fs";

/**
 * @class LexicaAPI
 * @description A class to interact with [Lexica API](https://lexica.qewertyy.dev).
 * @see https://lexica.qewertyy.dev/docs
**/

class LexicaAPI {
    private session: AxiosInstance;
    /**
     * @property models
     * @description all available models.
     * @type {Models|undefined}
    **/
    models: Models | undefined;
    constructor() {
        this.session = axios.create({
            baseURL: baseURL,
            headers: commonHeaders,
        });
    };

    /**
     * @method getModels
     * @description all available models
     * @returns {Promise<APIResponse['data']['models']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/LLMs/get_models
    **/
    async getModels(): Promise<typeof this.models | APIResponse["data"]> {
        if (!this.models) {
            const response: APIResponse | AxiosError = await this.session.get("/models").catch((error) => error);
            if (response instanceof AxiosError) return handleError(response);
            this.models = response.data.models;
        };
        return this.models;
    };

    /**
     * @method chatCompletion
     * @description interact with Large Language Models.
     * @param {number|string} modelId model id.
     * @param {messages} messages messages.
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/LLMs
    **/

    async chatCompletion(
        modelId: number | string,
        messages: messages[]
    ): Promise<APIResponse["data"]> {
        const payload = {
            model_id: modelId,
            messages: messages,
        };
        const response: APIResponse | AxiosError = await this.session.post(`/models`, payload).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method upscale
     * @description upscale images.
     * @param {ArrayBuffer|string} image path of the image or ArrayBuffer of the image or else HTTP URL of the image.
     * @param {number|string} modelId model id (defaults to 38).
     * @returns {Promise<upscaleResponse>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Upscale
    **/

    async upscale(
        image: ArrayBuffer | string,
        modelId: number | string = 38
    ): Promise<upscaleResponse> {
        const payload: { [key: string]: any } = {
            model_id: modelId,
        };
        if (typeof image === "string") {
            if (image.startsWith("http://") || image.startsWith("https://")) {
                payload["image_url"] = image;
                payload["format"] = "url";
            } else if (fs.existsSync(image) && fs.lstatSync(image).isFile()) {
                payload["image_data"] = Buffer.from(fs.readFileSync(image)).toString(
                    "base64"
                );
                payload["format"] = "base64";
            } else {
                throw new Error(
                    "Invalid string input. It is neither a valid URL nor a valid file path."
                );
            };
        } else if (image instanceof ArrayBuffer) {
            payload["image_data"] = Buffer.from(image).toString("base64");
            payload["format"] = "base64";
        } else {
            throw new Error(
                "Invalid input type. Input must be a string or an ArrayBuffer."
            );
        };
        const response: APIResponse | AxiosError = await this.session.post(
            `/upscale`, payload, {
                responseType:"arraybuffer",
            }).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method searchImages
     * @description search images.
     * @param {string} query search term.
     * @param {string|number} page page number (defaults to 0).
     * @param {string} engine search engine (defaults to google).
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Image%20Search
    **/

    async searchImages(
        query: string,
        page: string | number = 0,
        engine: imageSearchEngines = "google"
    ): Promise<APIResponse["data"]> {
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("page", page.toString());
        const response: APIResponse | AxiosError = await this.session.post(
            `/image-search/${engine}?${params.toString()}`
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method reverseImageSearch
     * @description search images.
     * @param {string} image image URL.
     * @param {reverseImageSearchEngines} engine reverse image search engine (defaults to yandex).
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Reverse%20Image%20Search
    **/

    async reverseImageSearch(
        image: string,
        engine: reverseImageSearchEngines = "yandex"
    ): Promise<APIResponse["data"]> {
        const imageURL = new URL(image);
        const params = new URLSearchParams();
        params.append("image_url", imageURL.href);
        const response: APIResponse | AxiosError = await this.session.post(
            `/reverse-image-search/${engine}?${params.toString()}`
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method downloadMedia
     * @description download social media videos/images.
     * @param {mediaPlatforms} platform social media platform.
     * @param {string} postUrl post URL.
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Social%20Media%20Downloader
    **/

    async downloadMedia(
        platform: mediaPlatforms,
        postUrl: string
    ): Promise<APIResponse["data"]> {
        const url = new URL(postUrl);
        const params = new URLSearchParams();
        params.append("url", url.href);
        const response: APIResponse | AxiosError = await this.session.post(
            `/downloaders/${platform}?${params.toString()}`
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method translate
     * @description translate text.
     * @param {string} text text to translate.
     * @param {languageCodes} lang language code (defaults to en).
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Translation
    **/

    async translate(
        text: string,
        lang: languageCodes = "en"
    ): Promise<APIResponse["data"]> {
        const params = new URLSearchParams();
        params.append("text", text);
        params.append("target", lang);
        const response: APIResponse | AxiosError = await this.session.get(
            `/translate?${params.toString()}`, 
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method getFreegames
     * @description retuns with a list free games on Epic Games, Steam and other platforms.
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Free%20Games
    **/

    async getFreegames(): Promise<APIResponse["data"]> {
        const response: APIResponse | AxiosError = await this.session.get(
            `/freegames`
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method webss
     * @description take a screenshot of a website.
     * @param {string} url url of the website.
     * @returns {Promise<ArrayBuffer>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Take%20Screenshot
    **/

    async webss(url:string) : Promise<ArrayBuffer|APIResponse['data']> {
        const sanitizedURL = new URL(url);
        const response : AxiosResponse | AxiosError = await this.session.get(
            `/webss?url=${sanitizedURL.href}`,
            { responseType:"arraybuffer" }
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method createInferenceTask
     * @description create images using stable/latent diffusion models
     * @param {number|string} modelId model id (defaults to 10).
     * @param {string} prompt prompt for the image.
     * @param {string} negativePrompt negative prompt for the image (things to avoid).
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Image%20Generations
    **/

    async createInferenceTask(
        modelId:number|string=10,
        prompt:string,negativePrompt:string
    ) : Promise<APIResponse['data']> {
        const payload = {
            model_id:modelId,
            prompt:prompt,
            negative_prompt:negativePrompt
        };
        const response : APIResponse | AxiosError = await this.session.post(
            `/models/inference`,payload
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method getInferenceTask
     * @description get task status and results.
     * @param {string|number} taskId task id of the inference.
     * @param {string|number} requestId request id of the inference.
     * @returns {Promise<APIResponse['data']>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Image%20Generations
    **/

    async getInferenceTask(
        taskId:string|number,
        requestId:string|number
    ) : Promise<APIResponse['data']> {
        const payload = {
            task_id:taskId,
            request_id:requestId
        };
        const response : APIResponse | AxiosError = await this.session.post(
            `/models/inference/task`,
            payload
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };
    
    /**
     * @method antinsfw
     * @description check if an image is NSFW.
     * @param {ArrayBuffer|string} image path of the image or ArrayBuffer of the image or else HTTP URL of the image.
     * @param {number|string} modelId model id (defaults to 29).
     * @returns {Promise<upscaleResponse>} The response from the API.
     * @see https://lexica.qewertyy.dev/docs/#/Anti-NSFW
    **/

    async antinsfw(
        image: ArrayBuffer | string,
        modelId: number | string = 29
    ): Promise<upscaleResponse> {
        const payload: { [key: string]: any } = {
            model_id: modelId,
        };
        if (typeof image === "string") {
            if (image.startsWith("http://") || image.startsWith("https://")) {
                payload["image_url"] = image;
                payload["format"] = "url";
            } else if (fs.existsSync(image) && fs.lstatSync(image).isFile()) {
                payload["image"] = Buffer.from(fs.readFileSync(image)).toString(
                    "base64"
                );
                payload["format"] = "base64";
            } else {
                throw new Error(
                    "Invalid string input. It is neither a valid URL nor a valid file path."
                );
            };
        } else if (image instanceof ArrayBuffer) {
            payload["image"] = Buffer.from(image).toString("base64");
            payload["format"] = "base64";
        } else {
            throw new Error(
                "Invalid input type. Input must be a string or an ArrayBuffer."
            );
        };
        const response: APIResponse | AxiosError = await this.session.post(
            `/anti-nsfw`, payload).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method news
     * @description get news for various categories.
     * @param {newsCategories} category news category.
     * @param {number|string} page page number (defaults to 1).
     * @returns {Promise<upscaleResponse>} The response from the API.
    **/

    async news(
        category:newsCategories,
        page : number = 1
    ) : Promise<APIResponse['data']> {
        const params = new URLSearchParams();
        params.append("category",category);
        params.append("page",page.toString());
        const response : APIResponse | AxiosError = await this.session.get(
            `/news?${params.toString()}`
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

    /**
     * @method trendingNews
     * @description get trending news.
     * @param {number} limit number of news to return (defaults to 5).
     * @param {number|string} newsOffset news offset.
     * @returns {Promise<upscaleResponse>} The response from the API.
    **/

    async trendingNews(
        limit:number = 5,
        newsOffset: number|string
    ) : Promise<APIResponse['data']>{
        const params = new URLSearchParams();
        params.append("limit",limit.toString());
        if (newsOffset) params.append("newsOffset",newsOffset.toString());
        const response : APIResponse | AxiosError = await this.session.get(
            `/trending-news?${params.toString()}`
        ).catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };

}

export { LexicaAPI };
