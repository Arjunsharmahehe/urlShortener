import React, { createContext, useEffect, useContext, useState } from "react";
import type { UrlResponse } from "../dummyData";

type ShortURL = string;

interface UrlContextType {
    baseUrl: string;
    originalUrl: string;
    shortUrl: ShortURL;
    urlList: UrlResponse[];
    setOriginalUrl: (url: string) => void;
    setShortUrl: (url: string) => void;
}

const UrlContext = createContext<UrlContextType>({
    baseUrl: "",
    originalUrl: "",
    shortUrl: "",
    urlList: [],
    setOriginalUrl: () => {},
    setShortUrl: () => {}
})

export const UrlProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [urlList, setUrlList] = useState<UrlResponse[]>([]);

    
    const baseUrl = "http://127.0.0.1:8000/"
    const [originalUrl, setOriginalUrl] = useState<string>("");
    const [shortUrl, setShortUrl] = useState<ShortURL>("Create short url");
    
    useEffect(() => {
        async function fetchList(){
          const response = await fetch(baseUrl + "urls/")
          const data = await response.json()
          setUrlList(data)
    
        }
        fetchList()
      }, [shortUrl])

    return (
        <UrlContext.Provider value={{ baseUrl, originalUrl, shortUrl, urlList, setOriginalUrl, setShortUrl }}>
            {children}
        </UrlContext.Provider>
    );
}

export const useUrlContext = () => useContext(UrlContext);