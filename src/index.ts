import axios, { AxiosError, AxiosInstance } from "axios";
import { baseURL, commonHeaders, handleError } from "./constants";
import { APIResponse, messages, upscaleResponse } from "./types";
import * as fs from "fs";

/**
 * @class LexicaAPI
 * @description A class to interact with `Lexica API` @link https://lexica.qewertyy.dev/docs.
 **/

class LexicaAPI {
    session: AxiosInstance;
    constructor() {
        this.session = axios.create({
            baseURL: baseURL,
            headers: commonHeaders,
        });
    }

    /**
     * @method getModels
     * @description all available models
     * @returns {Promise<APIResponse>} The response from the API.
     **/
    async getModels(): Promise<APIResponse> {
        const response = await this.session.get("/models").catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    }

    /**
     * @method chatCompletion
     * @description interact with Large Language Models.
     * @param {number|string} modelId model id.
     * @param {messages} messages messages.
     * @returns {Promise<APIResponse>} The response from the API.
     **/
    async chatCompletion(
        modelId: number | string,
        messages: messages[]
    ): Promise<APIResponse> {
        const payload = {
            model_id: modelId,
            messages: messages,
        };
        const response = await this.session
        .post(`/models`, payload)
        .catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    }

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
            };
        } else if (image instanceof ArrayBuffer) {
            payload["image_data"] = Buffer.from(image).toString("base64");
            payload["format"] = format;
        } else {
            throw new Error(
                "Invalid input type. Input must be a string or an ArrayBuffer."
            );
        }
        const response = await this.session
        .post(`/upscale`, payload, {
            responseType: format === "url" ? "json" : "arraybuffer",
        })
        .catch((error) => error);
        if (response instanceof AxiosError) return handleError(response);
        return response.data;
    };
};

export { LexicaAPI };