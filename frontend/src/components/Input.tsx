import React from "react";
import { useUrlContext } from "../context/urlContext";

export default function Input() {
    
    const { originalUrl, setOriginalUrl, baseUrl , setShortUrl} = useUrlContext()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = { "original_url": originalUrl }
        try{
            const response = await fetch(baseUrl + "urls/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json()
            setShortUrl(data.short_url)
            console.log(data)

            if (!response.ok){
                window.alert("Error: " + data.detail)
            }

        } catch (error) {
            window.alert("Error: " + error)
        }
    }
        

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="flex w-full max-w-[400px] rounded-md">
            <input name="originalUrl" type="text" placeholder="https://example.com/longlongurlohmygod"
                   value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)}
                   className="w-full bg-neutral-900 border-2 border-neutral-900 px-4 py-2 rounded-l-md focus:outline-none focus:border-neutral-800 focus:border-2"/>
            <button type="submit"
                    className="flex items-center gap-1 rounded-r-md px-3 py-2 bg-purple-950 hover:bg-purple-900 transition-colors duration-150">
                Convert
            </button>
        </form>
    )
}