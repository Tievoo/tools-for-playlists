import { useEffect, useState } from "react";
import { Album } from "../Types/spotify.types";
import { useAuthStore } from "../store";

function useAlbum(albumId: string | null) {
    const [album, setAlbum] = useState<Album | null>(null);
    const { token } = useAuthStore();

    const resetAlbum = () => setAlbum(null);

    useEffect(() => {
        if (!albumId) {
            setAlbum(null);
            return;
        }
        fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data: Album) => {
                setAlbum(data);
            });
    }, [albumId]);

    return { album, resetAlbum };
}

export default useAlbum;
