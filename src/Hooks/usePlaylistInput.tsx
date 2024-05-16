import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function usePlaylistInput() :[string | null, (value: string | null) => void] {
    const [search, setSearch] = useState<string | null>("")
    const navigate = useNavigate()

    useEffect(() => {
        if (search) {
            if (/^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}$/.test(search)) {
                console.log("Retriggering?")
                navigate("/"+search.split('/')[4])
            }
        } else {
            navigate("/")
            setSearch("")
        }
    }, [search])

    return [search, setSearch]
}