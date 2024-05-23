import axios, { AxiosError, AxiosInstance } from "axios";
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
} from "./types";
import * as fs from "fs";

/**
 * @class LexicaAPI
 * @description A class to interact with `Lexica API` @link https://lexica.qewertyy.dev/docs.
**/

class LexicaAPI {
    session: AxiosInstance;
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
     * @param {string} format format of the image (defaults to base64) if image url is provided then format is url.
     * @param {number|string} modelId model id (defaults to 38).
     * @returns {Promise<upscaleResponse>} The response from the API.
    **/

    async upscale(
        image: ArrayBuffer | string,
        format: string = "base64",
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
                payload["format"] = format;
            } else {
                throw new Error(
                    "Invalid string input. It is neither a valid URL nor a valid file path."
                );
            }
        } else if (image instanceof ArrayBuffer) {
            payload["image_data"] = Buffer.from(image).toString("base64");
            payload["format"] = format;
        } else {
            throw new Error(
                "Invalid input type. Input must be a string or an ArrayBuffer."
            );
        }
        const response: APIResponse | AxiosError = await this.session.post(
            `/upscale`, payload, {
                responseType: format === "url" ? "json" : "arraybuffer",
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
}

export { LexicaAPI };
