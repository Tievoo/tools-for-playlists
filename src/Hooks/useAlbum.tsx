import { useEffect, useMemo, useState } from "react";
import { Album } from "../Types/spotify.types";
import { useAuthStore, usePlaylistStore } from "../store";
import { addTracks, refreshAuth, removeTracks } from "../Managers/spotify.manager";
import { useAlertStore } from "../Components/Alert/Alert";

function useAlbum(albumId: string | null, close: () => void){
    const [album, setAlbum] = useState<Album | null>(null);
    const [checks, setChecks] = useState<Map<string, boolean>>(
        new Map<string, boolean>()
    );
    const [checksP, setChecksP] = useState<Map<string, boolean>>(
        new Map<string, boolean>()
    );

    const [loading, setLoading] = useState<boolean>(false);

    const { setAlert } = useAlertStore();

    const { token, validUntil } = useAuthStore();
    const { playlist, setPlaylist } = usePlaylistStore();

    const undoChanges = () => {
        setChecks(checksP);
    };

    const modified = useMemo(() => {
        for (const [key, value] of checks.entries()) {
            if (checksP.get(key) !== value) {
                return true;
            }
        }
        return false;
    }, [checks, checksP]);

    const allChecked = useMemo(() => {
        for (const value of checks.values()) {
            if (!value) {
                return false;
            }
        }
        return true;
    }, [checks]);

    const changeAll = () => {
        const checksCopy = new Map(checks);
        for (const key of checksCopy.keys()) {
            checksCopy.set(key, !allChecked);
        }
        setChecks(checksCopy);
    };

    const change = (id: string) => {
        const checksCopy = new Map(checks);
        checksCopy.set(id, !checks.get(id));
        setChecks(checksCopy);
    };

    const save = async () => {
        const added: string[] = [];
        const removed: string[] = [];
        if (!playlist) return;
        if (!album) return;

        setLoading(true);

        try {
            for (const [key, value] of checks.entries()) {
                if (checksP.get(key) !== value) {
                    (value ? added : removed).push(key);
                }
            }
            let snapshot_id = playlist.snapshot_id;
            if (added.length > 0) {
                const data = await addTracks(added);
                snapshot_id = data.snapshot_id;
            }

            if (removed.length > 0) {
                const data = await removeTracks(removed, snapshot_id);
                snapshot_id = data.snapshot_id;
            }

            let playlistTracks = structuredClone(playlist.tracks.items);

            const addedTracks = album.tracks.items.filter((track) => added.includes(track.id)).map((track) => ({ 
                added_at: new Date().toISOString(),
                added_by: {
                    external_urls: { spotify: "" },
                    href: "",
                    id: "",
                    type: "user",
                    uri: ""
                },
                is_local: false,
                primary_color: "",
                track: {
                    ...track,
                    album
                }
             }));
            playlistTracks = playlistTracks.filter((track) => !removed.includes(track.track.id));
            playlistTracks = playlistTracks.concat(addedTracks);

            setPlaylist({ ...playlist, snapshot_id, tracks: { ...playlist.tracks, items: playlistTracks } });
            setLoading(false);
            close();
        } catch (error) {
            setLoading(false);
            setAlert({ message: "Error saving changes", type: "error" });
        }
    };

    useEffect(() => {
        if (!albumId) {
            setAlbum(null);
            return;
        }

        if (validUntil < Date.now()) {
            refreshAuth();
        }
        setLoading(true);
        fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data: Album) => {
                const checksCopy = new Map<string, boolean>();

                for (const song of data.tracks.items) {
                    checksCopy.set(song.id, false);
                }

                for (const song of playlist?.tracks.items || []) {
                    if (checksCopy.has(song.track.id)) {
                        checksCopy.set(song.track.id, true);
                    }
                }
                setLoading(false);
                setChecks(checksCopy);
                setChecksP(checksCopy);
                setAlbum(data);
            });
    }, [albumId]);

    return {
        album,
        checks,
        change,
        modified,
        changeAll,
        allChecked,
        undoChanges,
        loading,
        save
    };
}

export default useAlbum;
