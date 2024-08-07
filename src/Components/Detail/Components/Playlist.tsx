import { useMemo, useState } from "react";
import { msFormat } from "../../../Functions/msFormat";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import TopPill from "./TopPill";
import { removeFeat } from "../../../Functions/removeFeat";
import { usePlaylistStore, useUserStore } from "../../../store";
import AlbumSearch from "./AlbumSearch";
import { FaEdit } from "react-icons/fa";
import PlaylistDetails from "../../Me/PlaylistDetails";
import Duplicate from "./Duplicate";

export default function PlaylistComponent() {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const [duplicateOpen, setDuplicateOpen] = useState<boolean>(false);
    const { playlist } = usePlaylistStore();
    const { user } = useUserStore();

    const ownsPlaylist = useMemo(
        () =>
            user?.id === playlist?.owner?.id ||
            "ede51cd5724f404eb00fb7f2c50427fd" == playlist?.owner?.id,
        [user, playlist]
    );

    const details = useMemo(
        () => ({
            id: playlist?.id || "",
            name: playlist?.name,
            description: playlist?.description,
            isPublic: playlist?.public,
        }),
        [playlist]
    );

    return (
        playlist && (
            <div
                className="flex flex-col rounded-md bg-gray-main p-2 py-4 md:p-4 w-full md:w-1/2"
                style={{ height: collapsed ? "fit-content" : "auto" }}
            >
                <AlbumSearch
                    isOpen={open}
                    onRequestClose={() => setOpen(false)}
                />
                <PlaylistDetails
                    isOpen={detailsOpen}
                    onRequestClose={() => setDetailsOpen(false)}
                    prev={details}
                />
                <Duplicate
                    isOpen={duplicateOpen}
                    onRequestClose={() => setDuplicateOpen(false)}
                />
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between gap-3 items-center">
                        <div className="flex flex-row gap-3 items-center">
                            <a
                                className=" font-bold text-2xl hover:text-gray-400 transition-colors"
                                href={playlist.external_urls.spotify}
                                target="_blank"
                            >
                                {playlist.name}
                            </a>
                            <button
                                className="rounded-full p-1 h-fit bg-spoti-dark hover:bg-spoti-light"
                                onClick={() => setDetailsOpen(true)}
                            >
                                <FaEdit className="text-black ml-[2px]" />
                            </button>
                        </div>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="flex flex-row items-center gap-1"
                        >
                            {collapsed ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>

                    {!collapsed && (
                        <div className="flex flex-row gap-3 text-sm bg-gray-dark rounded-md p-2">
                            {!!user && (
                                <button
                                    className="bg-spoti-dark hover:bg-spoti-light text-black p-1 px-2 rounded-full font-medium"
                                    onClick={() => setDuplicateOpen(true)}
                                >
                                    <span className="mt-1">Duplicate</span>
                                </button>
                            )}
                            {ownsPlaylist && (
                                <button
                                    className="bg-spoti-dark hover:bg-spoti-light text-black p-1 px-2 rounded-full font-medium"
                                    onClick={() => setOpen(true)}
                                >
                                    <span className="mt-1">Add from album</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <span className="text-sm md:text-base text-gray-400">
                    {playlist.description}
                </span>
                {playlist.tracks.items.length > 0 ? (
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
                                                <TopPill
                                                    id={track.id}
                                                    type="tracks"
                                                />
                                            </div>
                                            <span className=" text-left text-sm text-gray-400">
                                                {track?.artists &&
                                                    track.artists
                                                        .map(
                                                            (artist) =>
                                                                artist.name
                                                        )
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
                ) : (
                    <div className="h-full self-center flex flex-col items-center justify-center text-center w-2/3">
                        <span className="font-spoti font-bold text-2xl text-white">
                            There are no tracks in this playlist.
                        </span>
                        {user && ownsPlaylist && (
                            <span className="text-gray-400 text-center">
                                Search for songs on your favourite albums with
                                the "Add from album" button to give your
                                playlist some life!
                            </span>
                        )}
                    </div>
                )}
            </div>
        )
    );
}
