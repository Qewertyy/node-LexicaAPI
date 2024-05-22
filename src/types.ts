export interface APIResponse {
    message:string;
    code:number;
    content?:{
        [key:string|number]:string
    } | string;
}

export interface messages {
    role:"user"|"assistant"|"system";
    content:string;
}

export type upscaleResponse = {
    url?:string;
} & APIResponse | ArrayBuffer;