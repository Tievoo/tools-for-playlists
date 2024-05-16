import { useEffect, useState } from "react";
import { Playlist } from "../Types/spotify.types";

export default function useTop5Artists(playlist?: Playlist) {
    const [top5, setTop5] = useState<string[]>([]);

    function getTop5() {
        const artists: Record<string, number> = {};
        for (const track of playlist!.tracks.items) {
            for (const artist of track.track.artists) {
                if (artists[artist.name]) {
                    artists[artist.name] += 1;
                } else {
                    artists[artist.name] = 1;
                }
            }
        }
        const sortedArtists = Object.keys(artists).sort(
            (a, b) => artists[b] - artists[a]
        );
        setTop5(sortedArtists.slice(0, 5));
    }

    useEffect(() => {
        if (playlist && playlist.tracks) {
            getTop5();
        }
    }, [playlist]);

    return top5;
}
