interface Details {
    name: string;
    description: string;
    isPublic: boolean;

}

interface Props {
    details: Details
    setDetails : (details: Details) => void;
    image : string;
}

function PlaylistCard({
    details,
    setDetails,
    image
}: Props) {
    return (
        <div className="flex flex-row gap-3">
            <img src={image} alt="" className="w-36 h-36" />
            <div className="flex flex-col gap-1 justify-center">
                <span className="font-bold text-lg">{details.name}</span>
                <span className="text-gray-400">{details.description}</span>
            </div>
        </div>
    );
};

export default PlaylistCard;