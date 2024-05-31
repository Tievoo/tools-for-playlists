import { useMemo } from "react";
import useIsMobile from "../../../Hooks/useIsMobile";
import useTopArtists from "../../../Hooks/useTopArtists";
import { Playlist } from "../../../Types/spotify.types";
import { useTopStore } from "../../../store";

interface Props {
    playlist: Playlist;
}

function TopArtists({ playlist }: Props) {
    const isMobile = useIsMobile();
    const top = useTopArtists(10, playlist);
    const topState = useTopStore((state) => state.artists)

    const getPercentageWidth = (percentage: number) => {
        return percentage/(Math.min(top[0].percentage + 20,  100)) *(isMobile ? 4 :5) + "rem"
    }

    const textWidth = useMemo(() => {
        if (!top[0]) return "0rem"
        const digits = (top[0].percentage || 0).toFixed(0).length
        return digits * 0.9 + "rem"
    }, [top[0]])

    const getPercentageColor = (percentage: number) => {
        if (percentage > 40) {
            return "bg-green-500"
        } else if (percentage > 10) {
            return "bg-yellow-500"
        } else {
            return "bg-red-500"
        }
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col rounded-md bg-gray-main p-4 w-full">
                <span className="text-2xl font-bold">Top {10} Artistas</span>
                {top.map((artist, i) => (
                    <div
                        key={artist.id}
                        className="flex flex-row justify-between items-center rounded hover:bg-gray-500 px-2 py-1"
                    >
                        <div className="flex flex-row gap-3 items-center">
                            <span className="font-medium w-5 text-left md:text-right">
                                {i + 1}.
                            </span>
                            <span>{artist.name}</span>
                            {
                                topState.long.has(artist.id) && (
                                    <span className="text-xs md:text-sm text-gray-400">
                                        {topState.long.get(artist.id)}
                                    </span>
                                )
                            }
                            {
                                topState.short.has(artist.id) && (
                                    <span className="text-xs md:text-sm text-gray-400">
                                        {topState.short.get(artist.id)}
                                    </span>
                                )
                            }
                            {
                                topState.medium.has(artist.id) && (
                                    <span className="text-xs md:text-sm text-gray-400">
                                        {topState.medium.get(artist.id)}
                                    </span>
                                )
                            }
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-right w-28">
                                {artist.count} tracks
                            </span>
                            <div className="w-16 md:w-20 h-2">
                                <div
                                    className={
                                        getPercentageColor(artist.percentage) +
                                        " h-2 rounded"
                                    }
                                    style={{
                                        width: getPercentageWidth(artist.percentage),
                                    }}
                                />
                            </div>
                            <span
                                className="text-right"
                                style={{ width: textWidth }}
                            >
                                {(artist.percentage || 0).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopArtists;
