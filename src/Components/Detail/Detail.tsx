import { useQuery } from "@tanstack/react-query";
import { useAuthStore, usePlaylistStore } from "../../store";
import { get } from "../../Managers/spotify.manager";
import { useParams } from "react-router-dom";
import { Playlist } from "../../Types/spotify.types";
import PlaylistComponent from "./Components/Playlist";
import { useEffect, useState } from "react";
import TopTen from "./Components/TopTen";

function Detail() {
    const auth = useAuthStore();
    const { setPlaylist } = usePlaylistStore();
    const { id } = useParams();
    const [loadingName, setLoadingName] = useState<string | null>(null);

    const {
        data: playlist,
        fetchStatus,
        status,
    } = useQuery<Playlist>({
        queryKey: ["playlist"],
        queryFn: async () =>
            get(
                id || "",
                auth || JSON.parse(localStorage.getItem("auth") || "{}"),
                setLoadingName
            ),
    });

    useEffect(() => {
        if (playlist) {
            setPlaylist(playlist);
        } else {
            setPlaylist(null);
        }
    }, [playlist]);

    if (
        fetchStatus === "fetching" &&
        (playlist === undefined || playlist.id !== id)
    ) {
        // return <div>{
        //     loadingName ? `Found playlist: ${loadingName}. Getting tracks...` : "Loading playlist..."
        // }</div>;
        return (
            <div
                className="flex flex-col md:flex-row w-full mt-16 px-3 md:px-10 font-spoti gap-5 relative"
                style={{ height: "80vh" }}
            >
                <div className="flex flex-col rounded-md bg-gray-main p-2 py-4 md:p-4 w-full md:w-1/2"></div>
                <div
                    className="flex flex-col w-full bg-gray-main md:w-1/2 gap-3"
                    style={{ height: "384px" }}
                ></div>

                <div
                    className="absolute md:w-72 text-center bg-gray-main-light p-3 rounded"
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {loadingName
                        ? `Found playlist: ${loadingName}. Getting tracks...`
                        : "Loading playlist..."}
                </div>
            </div>
        );
    }

    if (status === "error") {
        return <div>Error</div>;
    }

    if (playlist !== undefined && playlist.id === id) {
        return (
            <div
                className="flex flex-col md:flex-row w-full mt-16 px-3 md:px-10 font-spoti gap-5"
                style={{ height: "80vh" }}
            >
                
                <PlaylistComponent />
                <div className="md:w-1/2 flex flex-col">
                    <TopTen />
                </div>
            </div>
        );
    }

    return <div>Playlist not found</div>;
}

export default Detail;
