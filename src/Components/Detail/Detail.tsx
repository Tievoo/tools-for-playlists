import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import { get } from "../../Managers/spotify.manager";
import { useParams } from "react-router-dom";
import { Playlist } from "../../Types/spotify.types";
import PlaylistComponent from "./Components/Playlist";
import useTop5Artists from "../../Hooks/useTop5Artists";

function Detail() {
    const auth = useAuthStore();
    const { id } = useParams();

    const {
        data: playlist,
        fetchStatus,
        status,
    } = useQuery<Playlist>({
        queryKey: ["playlist"],
        queryFn: async () =>
            get(
                "playlists/" + id,
                auth.token ||
                    JSON.parse(localStorage.getItem("auth") || "{}").token
            ),
    });

    const top5 = useTop5Artists(playlist);

    if (
        fetchStatus === "fetching" &&
        (playlist === undefined || playlist.id !== id)
    ) {
        return <div>Loading...</div>;
    }

    if (status === "error") {
        return <div>Error</div>;
    }

    if (playlist !== undefined && playlist.id === id) {
        return (
            <div
                className="flex flex-row w-full mt-16 px-10 font-spoti gap-5"
                style={{ height: "75vh" }}
            >
                <PlaylistComponent playlist={playlist} />
                <div className="flex flex-col w-1/2 gap-3">
                    <div className="flex flex-col rounded-md bg-gray-main p-4 w-full">
                        <span className="text-2xl font-bold">Top 5 Artistas</span>
                        {
                            top5.map((artist, i) => (
                                <div
                                    key={artist}
                                    className="flex flex-row justify-between items-center rounded hover:bg-gray-500 px-2 py-1"
                                >
                                    <div className="flex flex-row gap-3 items-center">
                                        <span className="font-medium w-2 text-right">
                                            {i + 1}.
                                        </span>
                                        <span>{artist}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }

    return <div>Playlist not found</div>;
}

export default Detail;
