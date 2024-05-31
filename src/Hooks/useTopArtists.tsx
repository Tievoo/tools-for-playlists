import { useEffect, useState } from "react";
import { Playlist } from "../Types/spotify.types";

export interface TopArtist {
    name: string;
    count: number;
    percentage: number;
    id: string;
}

export default function useTopArtists(n: number, playlist?: Playlist) {
    const [top, setTop] = useState<TopArtist[]>([]);

    function getTop() {
        const artists: Record<string, TopArtist> = {};
        for (const track of playlist!.tracks.items) {
            if (track?.track?.artists) {
                for (const artist of track.track.artists) {
                    if (artists[artist.id]) {
                        artists[artist.id].count++;
                    } else {
                        artists[artist.id] = { name: artist.name, count: 1, percentage: 0, id: artist.id };
                    }
                }
            }
        }
        const sortedArtists = Object.values(artists).sort(
            (a, b) =>  b.count - a.count
        );
        setTop(sortedArtists.slice(0, n).map(
            (art) => ({
                ...art,
                percentage: (art.count / playlist!.tracks.items.length) * 100
            })
        ));
    }

    useEffect(() => {
        if (playlist && playlist.tracks) {
            getTop();
        }
    }, [playlist]);

    return top;
}
