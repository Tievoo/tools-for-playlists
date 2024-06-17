import { useEffect, useState } from "react";
import { Track } from "../Types/spotify.types";
import { usePlaylistStore } from "../store";
import { addTracks, getRecommendations } from "../Managers/spotify.manager";
import { useAlertStore } from "../Components/Alert/Alert";

function useRecommendations() {
    const [queue, setQueue] = useState<Track[]>([]);
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const { playlist, addToPlaylist } = usePlaylistStore();
    const { setAlert } = useAlertStore();
    const [idSeen, setIdSeen] = useState<string | null>(null)

    const remove = async (id: string) => {

        const recommendationsCopy = Object.assign([], recommendations) as Track[];
        const t = recommendationsCopy.findIndex((r) => r.id === id);
        if (t > -1) {
            const track = recommendationsCopy[t];
            await addTracks([id]);
            if (playlist) {
                addToPlaylist([track])
                setAlert({
                    message: `Added ${track.name} to ${playlist.name}`,
                    type: "success",
                })
            }

            const queueCopy = Object.assign([], queue) as Track[];
            const r = queueCopy.shift();
            recommendationsCopy[t] = r as Track;
            if (r) {
                setRecommendations(recommendationsCopy);
                setQueue(queueCopy);
                if (queueCopy.length === 0) {
                    updateRec(true);
                }
            }
        }
    };

    const updateRec = async (emptyQ = false) => {
        if (playlist) {
            const playlistIds = playlist.tracks.items.map((t) => t.track.id);

            const seed_tracks = [];

            for (
                let i = playlist.tracks.items.length - 5;
                i < playlist.tracks.items.length;
                i++
            ) {
                seed_tracks.push(playlist.tracks.items[i].track.id);
            }

            const tracks = seed_tracks.join(",");

            getRecommendations(tracks).then((r) => {
                const nondupe = r.filter((t) => !playlistIds.includes(t.id));
                if (emptyQ) {
                    setQueue(nondupe);
                }
                else {
                    setRecommendations(nondupe.slice(0, 5));
                    setQueue(nondupe.slice(5));
                }
            });
        }
    }

    useEffect(() => {
        if (playlist && playlist.id !== idSeen) {
            setIdSeen(playlist.id);
            updateRec();
        }
    }, [playlist]);

    return { recommendations, queue, remove };
}

export default useRecommendations;
