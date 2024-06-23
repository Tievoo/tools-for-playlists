import Checkbox from "../Checkbox";

interface Details {
    name: string;
    description: string;
    isPublic: boolean;
    image: string;
}

interface Props {
    details: Details;
    setDetails: (details: Details) => void;
}

function PlaylistCard({ details, setDetails }: Props) {
    const { name, description, isPublic, image } = details;
    const set = (key: string, value: string | boolean) => {
        setDetails({ ...details, [key]: value });
    }


    return (
        <div className="flex flex-row gap-3">
            <img src={image} alt="" className="w-36 h-36" />
            <div className="flex flex-col gap-2 justify-center w-1/2">
                <input
                    type="text"
                    placeholder="Playlist name"
                    value={name}
                    onChange={(e) => set("name", e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => set("description", e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={isPublic}
                        onChange={() => set("isPublic", !isPublic)}
                    />
                    <span className="">Public?</span>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCard;
