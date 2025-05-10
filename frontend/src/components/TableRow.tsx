import { Copy, Link, Trash } from "lucide-react";
import { useUrlContext } from "../context/urlContext";
import type { UrlResponse } from "../dummyData";
import { useAlertContext } from "../context/alertContext";

export default function TableRow({ url, i }: { url: UrlResponse, i: number }) {

    const { baseUrl, setShortUrl } = useUrlContext()
    const { handleShowError, handleShowSuccess } = useAlertContext()

    const handleCopy = (url: string) => {
        const full_url = baseUrl + url
        navigator.clipboard.writeText(full_url)
            .then(() => {
                handleShowSuccess("Copied successfully! " + full_url)
            }
            )
            .catch((error) => {
                console.error("Error copying URL to clipboard:", error);
                handleShowError("Error copying URL to clipboard")
            }
            );
    }

    const handleDelete = (id: Number) => {
        const full_url = baseUrl + "urls/delete"
        const body = { "id": id }
        fetch(full_url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                if (response.ok) {
                    handleShowSuccess("Deleted successfully!")
                    setShortUrl("Deleted " + id)
                } else {
                    handleShowError("Internal server error")
                }
            }
            )
            .catch((error) => {
                console.error("Error deleting URL:", error);
                handleShowError("Error deleting URL")
            }
            );
    }

    return (
        <tr key={url.id} className="hover:bg-neutral-950">
            <td className="border-r-2 border-neutral-800">{i+1}</td>
            <td className="border-r-2 border-neutral-800">
                <div className="flex items-center justify-between">
                    <p className="text-nowrap py-1">{'/' + url.short_url}</p>
                    <div className="flex items-center justify-end w-full opacity-0 hover:opacity-100 transition-opacity duration-150">
                        <button onClick={() => handleCopy(url.short_url)} 
                                className="bg-neutral-900 p-1 rounded-sm border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-colors duration-150">
                            <Copy className="size-4"/>
                        </button>
                    </div>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-between">
                    <a href={url.original_url}
                    className="flex gap-2 hover:underline ">
                        <Link className="size-4"/>
                        {url.original_url.slice(0, 30) + (url.original_url.length > 30 ? "..." : "")}
                    </a>
                    <div className="flex items-center justify-end w-2/5 opacity-0 hover:opacity-100 transition-opacity duration-150">
                        <button onClick={() => handleDelete(url.id)} 
                                className="bg-red-950 p-1 rounded-sm border text-red-400 border-red-800 hover:bg-red-900/40 hover:border-red-700 transition-colors duration-150">
                            <Trash className="size-4"/>
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    )
}