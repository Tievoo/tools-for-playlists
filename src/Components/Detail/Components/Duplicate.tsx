import Modal from "react-modal";
import PlaylistCard from "../../UI/PlaylistCard";
import { usePlaylistStore } from "../../../store";
import CheckTrackList from "../../UI/CheckTrackList";
import { useMemo, useState } from "react";

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
        width: "40%",
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

function Duplicate({ isOpen, onRequestClose }: Props) {
    const { playlist } = usePlaylistStore();
    const [details, setDetails] = useState({
        name: playlist?.name || "",
        description: playlist?.description || "",
        isPublic: playlist?.public || false,
        image: playlist?.images.at(0)?.url || "",
    });

    const tracks = useMemo(
        () => playlist?.tracks.items.map((t) => t.track) || [],
        [playlist]
    );
    const [checks, setChecks] = useState<Map<string, boolean>>(
        () => new Map(tracks.map((t) => [t.id, true]))
    );
    const allChecked = useMemo(
        () => [...checks.values()].every((c) => c),
        [checks]
    );

    const changeAll = () => {
        setChecks(new Map([...checks].map(([k]) => [k, !allChecked])));
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <div
                className="flex flex-col bg-gray-main p-4 items-stretch gap-3 h-full"
                style={{ minHeight: "100%", backfaceVisibility: "hidden" }}
            >
                <PlaylistCard details={details} setDetails={setDetails} />
                <CheckTrackList
                    checks={checks}
                    onChange={(id) => {
                        setChecks(new Map(checks.set(id, !checks.get(id))));
                    }}
                    changeAll={changeAll}
                    allChecked={allChecked}
                    save={() => {}}
                    tracks={tracks || []}
                    modified={true}
                />
            </div>
        </Modal>
    );
}

export default Duplicate;
