export const urlList = [
    {
        original_url: "https://www.google.com",
        short_url: "1qn3VM",
        id: 1
    },
    {
        original_url: "https://www.youtube.com",
        short_url: "wmTc1p",
        id: 2
    },
    {
        original_url: "https://arjunsharmahehe.netlify.app",
        short_url: "X8Ar2O",
        id: 3
    }
]

export const urlCreated = {
    original_url: "https://arjunsharmahehe.netlify.app",
    short_url: "X8Ar2O",
    id: 3
}

export const urlSearched = {
    original_url: "https://www.google.com",
    short_url: "1qn3VM",
    id: 1
}

export type UrlResponse = {
    original_url: string;
    short_url: string;
    id: number;
}

export const BASE_URL: string = "http://127.0.0.1:8000/"