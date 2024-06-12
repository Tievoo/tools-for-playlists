import { useMemo, useState } from "react";
import useIsMobile from "../../../Hooks/useIsMobile";
import useTopN from "../../../Hooks/useTopN";
import TopPill from "./TopPill";
import { usePlaylistStore } from "../../../store";

function TopTen() {
    const isMobile = useIsMobile();
    const [selected, setSelected] = useState<string>("artists" as "artists" | "albums");
    const { playlist } = usePlaylistStore();
    const { topArtists, topAlbums } = useTopN(10, playlist);
    const top = selected === "artists" ? topArtists : topAlbums;

    const getPercentageWidth = (percentage: number) => {
        return percentage/(Math.min(top?.[0].percentage + 20,  100)) *(isMobile ? 4 :5) + "rem"
    }

    const textWidth = useMemo(() => {
        if (!top?.[0]) return "0rem"
        const digits = Math.max((top?.[0].percentage || 0).toFixed(0).length, 2)
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
                <div className="flex flex-row justify-between mb-2">
                    <span className="text-2xl font-bold">Top {10} { selected === "artists" ? "Artists" : "Albums" }</span>
                    <div className="flex flex-row gap-2 rounded-full bg-gray-light">
                        <button
                            onClick={() => setSelected("artists")}
                            className={`rounded-full px-2 font-spoti ${
                                selected === "artists" ? "bg-spoti text-black font-semibold" : ""
                            }`}
                        >
                            Artists
                        </button>
                        <button
                            onClick={() => setSelected("albums")}
                            className={`rounded-full px-2 font-spoti ${
                                selected === "albums" ? "bg-spoti text-black font-semibold" : ""
                            }`}
                        >
                            Albums
                        </button>
                    </div>
                </div>
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
                            <TopPill id={artist.id} type="artists" />
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

export default TopTen;
