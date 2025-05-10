import TableRow from "./TableRow";
import { useUrlContext } from "../context/urlContext";

export const ListView = () => {

    const { urlList } = useUrlContext()

    return (
        <div className="flex flex-col gap-2 w-full max-w-[800px]">
            <h2 className="text-2xl font-black">List of URLs</h2>
            <table className="w-full border-2 border-neutral-800">
                <thead className="bg-neutral-900 hover:bg-neutral-800">
                    <tr>
                        <th className="border-r-2 border-neutral-800">SNo.</th>
                        <th className="border-r-2 border-neutral-800 py-1">Short URL</th>
                        <th>Original URL</th>
                    </tr>
                </thead>
                <tbody>
                    {urlList.length > 0 ? urlList.map((url, i) => <TableRow url={url} i={i}/>): (
                        <tr>
                            <td colSpan={3} className="text-center py-2 text-neutral-500">No URLs found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}