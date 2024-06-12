import { useEffect, useState } from "react";
import { Playlist } from "../Types/spotify.types";

export interface TopObject {
    name: string;
    count: number;
    percentage: number;
    id: string;
}

export default function useTopN(n: number, playlist?: Playlist | null) {
    const [topArtists, setTopArtists] = useState<TopObject[]>([]);
    const [topAlbums, setTopAlbums] = useState<TopObject[]>([]);

    function getTop() {
        const artists: Record<string, TopObject> = {};
        const albums: Record<string, TopObject> = {};
        for (const item of playlist!.tracks.items) {
            if (item?.track?.artists) {
                for (const artist of item.track.artists) {
                    if (artists[artist.id]) {
                        artists[artist.id].count++;
                    } else {
                        artists[artist.id] = { name: artist.name, count: 1, percentage: 0, id: artist.id };
                    }
                }
            }

            if (item?.track?.album) {
                const album = item.track.album;
                if (album.album_type === "single") continue;
                if (albums[album.id]) {
                    albums[album.id].count++;
                } else {
                    albums[album.id] = { name: album.name , count: 1, percentage: 0, id: album.id };
                }
            }

            // if (track?.track?.) {
            //     for (const genre of track.track.artists[0].genres) {
            //         if (genres[genre]) {
            //             genres[genre]++;
            //         } else {
            //             genres[genre] = 1;
            //         }
            //     }
            // }
        }
        const sortedArtists = Object.values(artists).sort(
            (a, b) =>  b.count - a.count
        );
        setTopArtists(sortedArtists.slice(0, n).map(
            (art) => ({
                ...art,
                percentage: (art.count / playlist!.tracks.items.length) * 100
            })
        ));

        const sortedAlbums = Object.values(albums).sort(
            (a, b) =>  b.count - a.count
        );

        setTopAlbums(sortedAlbums.slice(0, n).map(
            (alb) => ({
                ...alb,
                percentage: (alb.count / playlist!.tracks.items.length) * 100
            })
        ));
    }

    useEffect(() => {
        if (playlist && playlist.tracks) {
            getTop();
        }
    }, [playlist]);

    return { topArtists, topAlbums };
}
