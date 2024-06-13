import { useState } from "react"
import Modal from "react-modal"
import Checkbox from "../Checkbox";
import { createPlaylist } from "../../Managers/spotify.manager";
import { useNavigate } from "react-router-dom";

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

function NewPlaylist({
    isOpen,
    onRequestClose
} : Props) {
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [isPublic, setIsPublic] = useState<boolean>(true)
    const navigate = useNavigate()

    const close = () => {
        setName('')
        setDescription('')
        setIsPublic(true)
        onRequestClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={close}
            style={customStyles}
        >
            <div className="p-4 bg-gray-dark flex flex-col font-spoti gap-4">
                <h1 className="text-2xl font-bold">Create new playlist</h1>
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
                    <Checkbox checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                    <span className="mt-2">Public?</span>
                </div>
                <div className="flex justify-end gap-2">
                    <button className="bg-spoti-black text-white p-2 rounded-md" onClick={close}>Cancel</button>
                    <button className="bg-spoti-dark text-spoti-black font-semibold p-2 rounded-md" onClick={() => {
                        createPlaylist(name, description, isPublic).then((id) => navigate(`/${id}`))
                    }}>Create</button>
                </div>
            </div>
        </Modal>
    )
}

export default NewPlaylist;