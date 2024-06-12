import { useRef, useState } from "react";
import { usePlaylistStore } from "../../../store";
import Modal from "react-modal";
import useSearch from "../../../Hooks/useSearch";
import { Album } from "../../../Types/spotify.types";
import useClickOutside from "../../../Hooks/useClickOutside";
import useAlbum from "../../../Hooks/useAlbum";
import { FaXmark } from "react-icons/fa6";
import { msFormat } from "../../../Functions/msFormat";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

function AlbumSearch({ isOpen, onRequestClose }: Props) {
    const { setPlaylist } = usePlaylistStore();
    const [search, setSearch] = useState<string>("");
    const { results, loading } = useSearch<Album>(search, "album");
    const mainRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { album } = useAlbum(selectedId);

    useClickOutside(mainRef, mainRef, () => setFocus(false));

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            width: "40%",
            height: album ? "70%" : "30%",
            maxHeight: "80%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            border: "none",
            background: "none",
            // minHeight: "30rem"
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
    };

    return (
        <Modal
            style={customStyles}
            isOpen={isOpen}
            onRequestClose={onRequestClose}
        >
            <div
                className="flex flex-col bg-gray-main p-4 items-stretch gap-3 h-full"
                style={{ minHeight: "100%", backfaceVisibility: "hidden" }}
            >
                <span className="font-bold text-xl font-spoti">
                    Search for Album
                </span>
                <div className="flex flex-col relative" ref={mainRef}>
                    <div className=" flex relative w-full">
                        <input
                            type="text"
                            value={album?.name || search}
                            disabled={!!album}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-1 rounded disabled:bg-gray-dark relative w-full"
                            onFocus={() => setFocus(true)}
                        />
                        {album && (
                            <button onClick={() => setSelectedId(null)}>
                                <FaXmark className="absolute right-1 top-1" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col overflow-y-auto h-36 absolute top-5 w-full mt-2 rounded">
                        {focus &&
                            results
                                .filter((a) => a.album_type === "album")
                                .map((album) => (
                                    <button
                                        key={album.id}
                                        className="flex flex-row items-center w-full gap-3 bg-gray-dark p-2 border-b-2 font-spoti border-zinc-900 hover:bg-gray-light transition-colors"
                                        onClick={() => {
                                            setSelectedId(album.id);
                                            setFocus(false);
                                        }}
                                    >
                                        {/* <img src={album.images[0].url} alt={album.name} /> */}
                                        <img
                                            src={album.images?.at(0)?.url}
                                            className="w-12 h-12"
                                            alt=""
                                        />
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="">
                                                {album.name}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                {album.artists
                                                    .map((a) => a.name)
                                                    .join(", ")}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                    </div>
                </div>

                {album && (
                    <div className="flex flex-col gap-3 h-5/6">
                        <div className="flex flex-row gap-3">
                            <img
                                src={album.images?.at(0)?.url}
                                alt=""
                                className="w-36 h-36"
                            />
                            <div className="flex flex-col gap-1 justify-center">
                                <span className="font-bold text-lg">
                                    {album.name}
                                </span>
                                <span className="text-gray-400">
                                    {album.artists
                                        .map((a) => a.name)
                                        .join(", ")}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col overflow-y-scroll h-3/4">
                            {album.tracks.items.map((track, i) => (
                                <button
                                    key={track.id}
                                    className="flex flex-row items-center justify-between w-full gap-3 bg-gray-dark p-2 font-spoti hover:bg-gray-light transition-colors"
                                >   
                                <label className="custom-checkbox">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                </label>
                                    <div className="flex flex-row gap-2">
                                        <span>{track.name}</span>
                                    </div>
                                    <span>{msFormat(track.duration_ms)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default AlbumSearch;
