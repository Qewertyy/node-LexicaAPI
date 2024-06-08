import { AxiosResponse } from "axios";

export interface APIResponse extends AxiosResponse {
    data: {
        message: string;
        code: number;
        content?: [
            {
                [key: string]: string
            }
        ] | {
            [key: string | number]: string
        } | string | FreeGames | inferenceResponse;
        models?: Models;
    }
};

export type Models = {
    [key: string]: Array<{
        id: number;
        name: string;
        source?: string;
        baseModel?: string;
        version?: string;
        type?: string;
    }>
};

export interface messages {
    role: "user" | "assistant" | "system";
    content: string;
};

export type inferenceResponse = {
    taskId: string | number;
    requestId: string | number;
}

export type imageSearchEngines = "google" | "bing";
export type reverseImageSearchEngines = "yandex" | imageSearchEngines;

export type upscaleResponse = {
    url?: string;
} & APIResponse['data'] | ArrayBuffer;

export type mediaPlatforms = "instagram" | "twitter" | "pinterest" | "reddit";

export interface Game {
    name: string,
    url: string,
    description?: string,
    genres?: string[],
    image?: string
};

export interface FreeGames {
    epicGames: Game[],
    steam: Game[],
    standalone: Game[]
};

export type languageCodes =
    | 'am' // Amharic
    | 'ar' // Arabic
    | 'eu' // Basque
    | 'bn' // Bengali
    | 'en-GB' // English (UK)
    | 'pt-BR' // Portuguese (Brazil)
    | 'bg' // Bulgarian
    | 'ca' // Catalan
    | 'chr' // Cherokee
    | 'hr' // Croatian
    | 'cs' // Czech
    | 'da' // Danish
    | 'nl' // Dutch
    | 'en' // English (US)
    | 'et' // Estonian
    | 'fil' // Filipino
    | 'fi' // Finnish
    | 'fr' // French
    | 'de' // German
    | 'el' // Greek
    | 'gu' // Gujarati
    | 'iw' // Hebrew
    | 'hi' // Hindi
    | 'hu' // Hungarian
    | 'is' // Icelandic
    | 'id' // Indonesian
    | 'it' // Italian
    | 'ja' // Japanese
    | 'kn' // Kannada
    | 'ko' // Korean
    | 'lv' // Latvian
    | 'lt' // Lithuanian
    | 'ms' // Malay
    | 'ml' // Malayalam
    | 'mr' // Marathi
    | 'no' // Norwegian
    | 'pl' // Polish
    | 'pt-PT' // Portuguese (Portugal)
    | 'ro' // Romanian
    | 'ru' // Russian
    | 'sr' // Serbian
    | 'zh-CN' // Chinese (PRC)
    | 'sk' // Slovak
    | 'sl' // Slovenian
    | 'es' // Spanish
    | 'sw' // Swahili
    | 'sv' // Swedish
    | 'ta' // Tamil
    | 'te' // Telugu
    | 'th' // Thai
    | 'zh-TW' // Chinese (Taiwan)
    | 'tr' // Turkish
    | 'ur' // Urdu
    | 'uk' // Ukrainian
    | 'vi' // Vietnamese
    | 'cy'; // Welsh

export type newsCategories =
    | "India"
    | "Business"
    | "Politics"
    | "Sports"
    | "Technology"
    | "Startups"
    | "Entertainment"
    | "International"
    | "Automobile"
    | "Science"
    | "Travel"
    | "Miscellaneous"
    | "Fashion"
    | "Education"
    | "Health & Fitness"
    | "Anime";