import { useEffect, useState } from "react";
import { Album, Playlist, Track } from "../Types/spotify.types";
import { useAuthStore } from "../store";
import { refreshAuth } from "../Managers/spotify.manager";

// type Data = Track | Playlist | Album;

function useSearch<K extends  Album | Playlist | Track>(search: string, type: "album" | "playlist" | "song") {
    const [results, setResults] = useState<K[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { token, validUntil } = useAuthStore();

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (search) {
            timeout = setTimeout(() => {

                if (validUntil < Date.now()) {
                    refreshAuth();
                }

                setLoading(true);
                fetch(`https://api.spotify.com/v1/search?q=${search}&type=${type}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((data: any) => {
                        setLoading(false);
                        setResults(data[type + "s"].items)
                        console.log(data.tracks.items);
                        alert("loading should be false")

                        
                    });
            }, 1000);
        } else {
            setResults([]);
        }
        return () => clearTimeout(timeout);
    }, [search]);

    return { results, loading };
}

export default useSearch;