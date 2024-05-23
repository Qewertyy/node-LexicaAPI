import { AxiosError } from "axios";
import { version } from "../package.json";
import { APIResponse } from "./types";

export const baseURL = "https://lexica.qewertyy.dev";

export const commonHeaders = {
    "Content-Type": "application/json",
    "User-Agent": `Lexica/${version}`,
};

export const handleError = (error: AxiosError) : APIResponse['data'] => {
    return (
        error.response?.data || {
        message: error.message,
        code: error.code,
        }
    ) as APIResponse['data'];
};
