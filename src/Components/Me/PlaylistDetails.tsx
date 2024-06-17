import { useEffect, useState } from "react";
import Modal from "react-modal";
import Checkbox from "../Checkbox";
import { createPlaylist, updatePlaylist } from "../../Managers/spotify.manager";
import { useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../../store";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    prev?: {
        id: string;
        name?: string;
        description?: string;
        isPublic?: boolean;
    };
    duplicate?: boolean;
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

function PlaylistDetails({ isOpen, onRequestClose, prev, duplicate = false }: Props) {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>(
        ""
    );
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { playlist, setPlaylist } = usePlaylistStore();

    const close = () => {
        if (loading) return;
        setName("");
        setDescription("");
        setIsPublic(true);
        onRequestClose();
    };

    const save = async () => {
        if (loading) return;
        setLoading(true);
        if (prev && prev.id && !duplicate){
            await updatePlaylist(name, description, isPublic, prev.id).then(() =>{
                if (playlist) setPlaylist({ ...playlist, name, description, public: isPublic });
                close();
            });
        } else if (duplicate) {
            // duplicate playlist
        } else {
            await createPlaylist(name, description, isPublic).then((id) =>
                navigate(`/${id}`)
            );
        }
        setLoading(false);
    }

    useEffect(() => {
        if (prev && prev.id) {
            if (prev.name) setName(prev.name);
            if (prev.description) setDescription(prev.description);
            if (prev.isPublic) setIsPublic(prev.isPublic);
        }
    }, [isOpen, prev]);

    return (
        <Modal isOpen={isOpen} onRequestClose={close} style={customStyles}>
            <div className="p-4 bg-gray-dark flex flex-col font-spoti gap-4">
                <h1 className="text-2xl font-bold">{
                    prev && prev.id ? "Edit Playlist" : "Create Playlist"
                    }</h1>
                <input
                    type="text"
                    placeholder="Playlist name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <div className="flex items-center">
                    <Checkbox
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                    <span className="mt-2">Public?</span>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-spoti-black text-white p-2 rounded-md"
                        onClick={close}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-spoti-dark text-spoti-black font-semibold p-2 rounded-md"
                        onClick={save}
                    >
                        {prev && prev.id ? "Save" : "Create"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default PlaylistDetails;
