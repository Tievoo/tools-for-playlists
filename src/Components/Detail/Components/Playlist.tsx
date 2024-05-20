import { msFormat } from "../../../Functions/msFormat";
import { Playlist } from "../../../Types/spotify.types";

interface Props {
    playlist: Playlist;
}

export default function PlaylistComponent({ playlist }: Props) {
    return (
        <div className="flex flex-col rounded-md bg-gray-main p-4 w-1/2">
            <span className=" font-bold text-2xl">{playlist.name}</span>
            <span>{playlist.description}</span>
            <div className="flex flex-col overflow-y-auto pr-2 gap-1 mt-3">
                {playlist.tracks.items.map(({ track }, i) => {
                    if (!track) return null;
                    return (
                        <button
                            key={track.id}
                            className="flex flex-row justify-between items-center rounded hover:bg-gray-500 px-2 py-1"
                            onClick={() =>
                                window.open(
                                    track.external_urls.spotify,
                                    "_blank"
                                )
                            }
                        >
                            <div className="flex flex-row gap-3 items-center">
                                <span className="font-medium w-5 text-right">
                                    {i + 1}.
                                </span>
                                <img
                                    className="w-10 h-10"
                                    src={track?.album?.images?.[0]?.url}
                                    alt=""
                                />
                                <div className="flex flex-col items-start">
                                    <span>{track.name}</span>
                                    <span className="text-sm text-gray-400">
                                        {track?.artists &&
                                            track.artists
                                                .map((artist) => artist.name)
                                                .join(", ")}
                                    </span>
                                </div>
                            </div>
                            <span>{msFormat(track.duration_ms)}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
