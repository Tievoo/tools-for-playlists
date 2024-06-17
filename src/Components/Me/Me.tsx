import { useQuery } from "@tanstack/react-query";
import { SimplifiedPlaylist } from "../../Types/spotify.types";
import { useMeStore, useUserStore } from "../../store";
import { me } from "../../Managers/spotify.manager";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import PlaylistDetails from "./PlaylistDetails";
import { IoMdMusicalNotes } from "react-icons/io";

function Me() {
    const user = useUserStore();
    const { playlists } = useMeStore();
    const { fetchStatus } = useQuery<SimplifiedPlaylist[]>({
        queryKey: ["me"],
        queryFn: me,
    });
    const [newOpen, setNewOpen] = useState(false);

    const owned = useMemo(
        () =>
            playlists?.filter(
                (playlist) => playlist.owner.id === user.user?.id
            ) || [],
        [playlists, user.user]
    );
    const notOwned = useMemo(
        () =>
            playlists?.filter(
                (playlist) => playlist.owner.id !== user.user?.id
            ) || [],
        [playlists, user.user]
    );

    if (fetchStatus === "fetching" && !playlists) {
        return <>Loading...</>;
    }

    if (playlists && playlists.length && user.user) {
        return (
            <div className="flex flex-col gap-8 px-5 md:px-20 w-full my-12 md:my-20">
                <PlaylistDetails
                    isOpen={newOpen}
                    onRequestClose={() => setNewOpen(false)}
                />
                <div className="flex flex-col">
                    <span className="font-spoti text-xl font-semibold">
                        Owned Playlists
                    </span>
                    <span className="w-full h-[2px] bg-gray-300"></span>
                    <div className="flex flex-row w-full overflow-x-auto scroll-container gap-8 md:gap-12 mt-5 pb-3">
                        {owned.map((playlist) => (
                            <PlaylistComponent playlist={playlist} />
                        ))}
                        <button
                            className="flex flex-col w-24 md:w-40 gap-1"
                            onClick={() => setNewOpen(true)}
                        >
                            <FaPlus className="w-24 h-24 md:w-40 md:h-40 bg-gray-light text-gray-dark rounded-md" />
                            <span className="font-spoti font-semibold text-center w-full">
                                Create a playlist
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <span className="font-spoti text-xl font-semibold">
                        Not Owned Playlists
                    </span>
                    <span className="w-full h-[2px] bg-gray-300"></span>
                    <div className="flex flex-row w-full overflow-x-auto scroll-container gap-8 md:gap-12 mt-5 pb-3">
                        {notOwned.map((playlist) => (
                            <PlaylistComponent playlist={playlist} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

function PlaylistComponent({ playlist }: { playlist: SimplifiedPlaylist }) {
    const navigate = useNavigate();

    return (
        <button
            key={playlist.id}
            className="flex flex-col w-24 md:w-40 gap-1"
            onClick={() => navigate(`/${playlist.id}`)}
        >
            {playlist.images?.length ? (
                <img
                    src={playlist.images?.[0].url}
                    alt={playlist.name}
                    className="w-full h-24 md:h-40 object-cover"
                />
            ) : (
                <div className="w-full h-24 md:h-40 bg-gray-light flex items-center justify-center">
                    <IoMdMusicalNotes className="w-8 h-8 md:w-16 md:h-16 text-gray-dark" />
                </div>
            )}
            <div className="flex flex-col w-24 md:w-40">
                <span className="font-spoti font-semibold text-center w-full truncate">
                    {playlist.name}
                </span>
                <span className="text-center text-xs text-gray-400">
                    {playlist.owner.display_name}
                </span>
            </div>
        </button>
    );
}

export default Me;
