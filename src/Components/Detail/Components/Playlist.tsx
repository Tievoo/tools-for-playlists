import { useMemo, useState } from "react";
import { msFormat } from "../../../Functions/msFormat";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import TopPill from "./TopPill";
import { removeFeat } from "../../../Functions/removeFeat";
import { usePlaylistStore, useUserStore } from "../../../store";
import AlbumSearch from "./AlbumSearch";

export default function PlaylistComponent() {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const { playlist } = usePlaylistStore();
    const { user } = useUserStore();

    const ownsPlaylist = useMemo(() => user?.id === playlist?.owner?.id, [user, playlist])

    return playlist && (
        <div
            className="flex flex-col rounded-md bg-gray-main p-2 py-4 md:p-4 w-full md:w-1/2"
            style={{ height: collapsed ? "fit-content" : "auto" }}
        >
            <AlbumSearch isOpen={open} onRequestClose={() => setOpen(false)} />
            <div className="flex flex-row justify-between">
                <span className=" font-bold text-2xl">{playlist.name}</span>
                <div className="flex flex-row gap-3">
                    {!collapsed && ownsPlaylist && (
                        <button className="bg-spoti text-black p-2 rounded-full font-medium" onClick={() => setOpen(true)}>
                            <span className="mt-1">Add from album</span>
                        </button>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex flex-row items-center gap-1"
                    >
                        {collapsed ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>
            <span className="text-sm md:text-base text-gray-400">
                {playlist.description}
            </span>
            <div
                className={`flex flex-col overflow-y-auto md:pr-2 gap-1 mt-3 ${
                    collapsed ? "hidden" : ""
                }`}
            >
                {playlist.tracks.items.map(({ track }, i) => {
                    if (!track) return null;
                    return (
                        <button
                            key={track.id + i}
                            className="flex flex-row justify-between w-full items-center rounded hover:bg-gray-500 px-2 py-1"
                            onClick={() =>
                                window.open(
                                    track.external_urls.spotify,
                                    "_blank"
                                )
                            }
                        >
                            <div className="flex flex-row gap-3 items-center justify-start w-full overflow-hidden">
                                <span className="text-sm md:text-basefont-medium text-left md:text-right w-6 md:w-8">
                                    {i + 1}.
                                </span>
                                <img
                                    className="w-10 h-10"
                                    src={track?.album?.images?.[0]?.url}
                                    alt=""
                                />
                                <div className="flex flex-col items-start w-3/4 overflow-hidden">
                                    <div className="flex flex-row gap-3 items-center">
                                        <span className="font-medium truncate">
                                            {removeFeat(track.name)}
                                        </span>
                                        <TopPill id={track.id} type="tracks" />
                                    </div>
                                    <span className=" text-left text-sm text-gray-400">
                                        {track?.artists &&
                                            track.artists
                                                .map((artist) => artist.name)
                                                .join(", ")}
                                    </span>
                                </div>
                            </div>
                            <span className="w-10 hidden md:flex">
                                {msFormat(track.duration_ms)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
