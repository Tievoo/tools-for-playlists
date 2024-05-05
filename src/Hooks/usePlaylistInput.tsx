import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function usePlaylistInput(query?: string) :[string, (value: string) => void] {
    const [search, setSearch] = useState<string>(query || "")
    const navigate = useNavigate()

    useEffect(() => {
        if (/^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}$/.test(search)) {
            navigate("/"+search.split('/')[4])
        }
    }, [search])

    return [search, setSearch]
}