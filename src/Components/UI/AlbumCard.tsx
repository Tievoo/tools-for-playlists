import { Album } from "../../Types/spotify.types";

interface Props {
    album: Album;
}

function AlbumCard({
    album,
}: Props) {
    return (
        <div className="flex flex-row gap-3">
            <img src={album.images?.at(0)?.url} alt="" className="w-36 h-36" />
            <div className="flex flex-col gap-1 justify-center">
                <span className="font-bold text-lg">{album.name}</span>
                <span className="text-gray-400">
                    {album.artists.map((a) => a.name).join(", ")}
                </span>
            </div>
        </div>
    );
};

export default AlbumCard;
