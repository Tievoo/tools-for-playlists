import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import { get } from "../../Managers/spotify.manager";
import { useParams } from "react-router-dom";
import { Playlist } from "../../Types/spotify.types";
import PlaylistComponent from "./Components/Playlist";
import useTopArtists from "../../Hooks/useTopArtists";
import useIsMobile from "../../Hooks/useIsMobile";

function Detail() {
    const auth = useAuthStore();
    const { id } = useParams();
    const isMobile = useIsMobile();

    const {
        data: playlist,
        fetchStatus,
        status,
    } = useQuery<Playlist>({
        queryKey: ["playlist"],
        queryFn: async () =>
            get(
                "playlists/" + id,
                auth || JSON.parse(localStorage.getItem("auth") || "{}")
            ),
        
    });

    const top = useTopArtists(10, playlist);

    const getPercentageWidth = (percentage: number) => {
        return percentage/(Math.min(top[0][2] + 20,  100)) *(isMobile ? 4 :5) + "rem"
    }

    const getPTextWidth = () => {
        const digits = top[0][2].toFixed(0).length
        return digits * 0.9 + "rem"
    }

    const getPercentageColor = (percentage: number) => {
        if (percentage > 40) {
            return "bg-green-500"
        } else if (percentage > 10) {
            return "bg-yellow-500"
        } else {
            return "bg-red-500"
        }
    }

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
                className="flex flex-col md:flex-row w-full mt-16 px-3 md:px-10 font-spoti gap-5"
                style={{ height: "75vh" }}
            >
                <PlaylistComponent playlist={playlist} />
                <div className="flex flex-col w-full md:w-1/2 gap-3">
                    <div className="flex flex-col rounded-md bg-gray-main p-4 w-full">
                        <span className="text-2xl font-bold">Top {10} Artistas</span>
                        {
                            top.map((artist, i) => (
                                <div
                                    key={artist[0]}
                                    className="flex flex-row justify-between items-center rounded hover:bg-gray-500 px-2 py-1"
                                >
                                    <div className="flex flex-row gap-3 items-center">
                                        <span className="font-medium w-5 text-left md:text-right">
                                            {i + 1}.
                                        </span>
                                        <span>{artist[0]}</span>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <span className="text-right w-28">{artist[1]} tracks</span>
                                        <div className="w-16 md:w-20 h-2" >
                                            <div className={getPercentageColor(artist[2]) + " h-2 rounded"} style={{ width: getPercentageWidth(artist[2])}}/>
                                        </div>
                                        <span className="text-right" style={{width:getPTextWidth()}}>
                                            {artist[2].toFixed(0)}%
                                        </span>
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
