import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store";
import { get } from "../Managers/spotify.manager";
import { useParams } from "react-router-dom";
import { Playlist } from "../Types/spotify.types";

function Detail() {
    const auth = useAuthStore();
    const { id } = useParams();

    const { data : playlist, fetchStatus, status } = useQuery<Playlist>({
        queryKey: ["playlist"],
        queryFn: async () => get("playlists/" + id, auth.token || JSON.parse(localStorage.getItem("auth") || "{}").token),
    });

    if (fetchStatus === "fetching") {
        return <div>Loading...</div>;
    }

    if (status === "error") {
        return <div>Error</div>;
    }

    

    if (playlist !== undefined) {
        return (
            <div className='flex flex-col w-full items-center mt-16'>
                <span>{playlist.name}</span>
                <span>{playlist.description}</span>
                <span>{playlist.owner.display_name}</span>
                <img src={playlist.images[0].url} alt="playlist" />
            </div>
        )
    }

    return <div>Playlist not found</div>
}

export default Detail;
