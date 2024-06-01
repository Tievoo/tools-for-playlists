import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

export default function usePlaylistInput() :[string | null, (value: string | null) => void] {
    const [search, setSearch] = useState<string | null>("")
    const navigate = useNavigate()
    const location = useLocation()
    const { isUser } = useAuthStore();

    useEffect(() => {
        if (search || search === "") {
            if (search.split('/')[4] && search.split('/')[4] === window.location.pathname.split('/')[1]) {
                return
            }

            if (/^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}$/.test(search)) {
                console.log("Retriggering?")
                navigate("/"+search.split('/')[4])
            }
        } else {
            setSearch("")
            navigate(isUser ? "/me" : "/")
        }
    }, [search])

    useEffect(() => {
        const path = location.pathname
        if (path.length > 1 && path.split('/')[1] !== "me") {
            setSearch("https://open.spotify.com/playlist/"+window.location.pathname.split('/')[1])
        }
    }, [location])

    return [search, setSearch]
}