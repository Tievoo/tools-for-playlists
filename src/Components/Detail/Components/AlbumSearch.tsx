import { useRef, useState } from "react";
import Modal from "react-modal";
import useSearch from "../../../Hooks/useSearch";
import { Album } from "../../../Types/spotify.types";
import useClickOutside from "../../../Hooks/useClickOutside";
import useAlbum from "../../../Hooks/useAlbum";
import { FaXmark } from "react-icons/fa6";
import AlbumCard from "../../UI/AlbumCard";
import CheckTrackList from "../../UI/CheckTrackList";
import useIsMobile from "../../../Hooks/useIsMobile";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        // width: "40%",
        maxHeight: "85%",
        transform: "translate(-50%, -50%)",
        padding: "0",
        border: "none",
        background: "none",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
};

function AlbumSearch({ isOpen, onRequestClose }: Props) {
    const [search, setSearch] = useState<string>("");
    const { results, loading: searchLoading } = useSearch<Album>(search, "album");
    const mainRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const isMobile = useIsMobile();
    

    useClickOutside(mainRef, mainRef, () => setFocus(false));

    const close = () => {
        setSearch("");
        setSelectedId(null);
        onRequestClose();
    }

    const { album, checks, change, modified, changeAll, allChecked, undoChanges, save } =
        useAlbum(selectedId, close);



    return (
        <Modal
            style={{
                content: {
                    ...customStyles.content,
                    width: isMobile ? "90%" : "40%",
                },
                overlay: customStyles.overlay,
            }}
            isOpen={isOpen}
            onRequestClose={close}
        >
            <div
                className="flex flex-col bg-gray-main p-4 items-stretch gap-3 h-full"
                style={{ minHeight: "100%", backfaceVisibility: "hidden" }}
            >
                <span className="font-bold text-xl font-spoti">
                    Search for Album
                </span>
                <div className="flex flex-col" ref={mainRef}>
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
                            <button
                                onClick={() => {
                                    setSelectedId(null);
                                    setSearch("");
                                }}
                            >
                                <FaXmark className="absolute right-1 top-1" />
                            </button>
                        )}
                    </div>

                    {focus && (
                        <div className="flex flex-col overflow-y-auto max-h-48 top-5 w-full mt-2 rounded">
                            {
                                searchLoading && results.length === 0 && <span className="text-center py-5 bg-gray-dark">Loading...</span>
                            }
                            {results
                                .filter((a) => a.total_tracks > 1)
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
                                            <span className="text-left">
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
                    )}
                </div>

                {album && (
                    <div className="flex flex-col gap-3">
                        <AlbumCard album={album} />
                        <CheckTrackList
                            changeAll={changeAll}
                            allChecked={allChecked}
                            undoChanges={undoChanges}
                            save={save}
                            onChange={change}
                            tracks={album.tracks.items}
                            checks={checks}
                            modified={modified}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default AlbumSearch;
