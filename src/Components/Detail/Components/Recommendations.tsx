import { FaPlus } from "react-icons/fa6";
import useRecommendations from "../../../Hooks/useRecommendations";
import { useMemo, useState } from "react";
import { usePlaylistStore, useUserStore } from "../../../store";

function Recommendations() {
    const { recommendations, remove } = useRecommendations();
    const [adding, setAdding] = useState<string | null>(null);
    const user = useUserStore(s => s.user);
    const playlist = usePlaylistStore(p => p.playlist);

    const addSong = (id: string) => {
        setAdding(id);
        remove(id).then(() => setAdding(null));
    };

    const ownsPlaylist = useMemo(
        () =>
            user?.id === playlist?.owner?.id ||
            "ede51cd5724f404eb00fb7f2c50427fd" == playlist?.owner?.id,
        [user, playlist]
    );

    if (!ownsPlaylist) {
        return null;
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col rounded-md bg-gray-main p-4 w-full">
                <div className="flex flex-row items-end gap-1">
                    <span className="text-2xl font-bold">Recommendations</span>
                    <span className="text-xs mb-1">
                        (based on the last 5 songs)
                    </span>
                </div>
                {recommendations.map((track) => (
                    <div className="flex flex-row gap-3 items-center rounded hover:bg-gray-dark px-1 py-1">
                        {adding === track.id ? (
                            <div className="w-full items-center flex justify-center">
                                Loading...
                            </div>
                        ) : (
                            <>
                                <button className="p-1 border-2 text-white border-white rounded-full h-fit" onClick={() => addSong(track.id)}>
                                    <FaPlus size={12}></FaPlus>
                                </button>
                                <div
                                    key={track.id}
                                    className="flex flex-col gap-px "
                                >
                                    <span>{track.name}</span>
                                    <span className="text-gray-500 text-xs">
                                        {track.artists
                                            .map((v) => v.name)
                                            .join(", ")}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recommendations;
