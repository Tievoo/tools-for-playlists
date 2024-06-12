import { useEffect, useState } from "react";
import { Album, Playlist, Track } from "../Types/spotify.types";
import { useAuthStore } from "../store";

// type Data = Track | Playlist | Album;

function useSearch<K extends  Album | Playlist | Track>(search: string, type: "album" | "playlist" | "song") {
    const [results, setResults] = useState<K[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { token } = useAuthStore();

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (search) {
            timeout = setTimeout(() => {
                setLoading(true);
                fetch(`https://api.spotify.com/v1/search?q=${search}&type=${type}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((data: any) => {
                        setResults(data[type + "s"].items)
                        console.log(data.tracks.items);
                        setLoading(false);
                    });
            }, 1000);
        }
        return () => clearTimeout(timeout);
    }, [search]);

    return { results, loading };
}

export default useSearch;