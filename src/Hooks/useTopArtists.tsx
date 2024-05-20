import { useEffect, useState } from "react";
import { Playlist } from "../Types/spotify.types";

export default function useTopArtists(n: number, playlist?: Playlist) {
    const [top, setTop] = useState<[string, number, number][]>([]);

    function getTop() {
        const artists: Record<string, number> = {};
        for (const track of playlist!.tracks.items) {
            if (track?.track?.artists) {
                for (const artist of track.track.artists) {
                    artists[artist.name] = (artists[artist.name] || 0) + 1;
                }
            }
        }
        const sortedArtists = Object.entries(artists).sort(
            (a, b) =>  b[1] - a[1]
        );
        setTop(sortedArtists.slice(0, n).map(([name, count]) => [name, count, count/playlist!.tracks.items.length * 100]));
    }

    useEffect(() => {
        if (playlist && playlist.tracks) {
            getTop();
        }
    }, [playlist]);

    return top;
}
