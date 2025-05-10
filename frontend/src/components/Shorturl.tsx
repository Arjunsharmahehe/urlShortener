import { Copy } from "lucide-react"
import { useUrlContext } from "../context/urlContext"
import { useAlertContext } from "../context/alertContext"

export default function Shorturl() {

    const { shortUrl, baseUrl } = useUrlContext()
    const { handleShowError, handleShowSuccess } = useAlertContext()

    const handleCopy = () => {
        navigator.clipboard.writeText(baseUrl + shortUrl)
            .then(() => {
                handleShowSuccess("Copied successfully! " + baseUrl + shortUrl)
            })
            .catch((error) => {
                console.error("Error copying URL to clipboard:", error);
                handleShowError("Error copying URL to clipboard")
            });
    }

    if (shortUrl === "") {
        return <p className="text-neutral-600 text-lg">Short URL will appear here</p>
    }

    return (
        <div className="flex w-full max-w-[400px] rounded-md">
            <p className="w-full bg-neutral-900 px-4 py-2 rounded-l-md">{shortUrl}</p>
            <button onClick={handleCopy} title="copy"
                    className="flex items-center gap-1 rounded-r-md px-3 py-2 bg-purple-950 hover:bg-purple-900 transition-colors duration-150">
                <Copy className="size-4"/>
            </button>
        </div>
    )
}