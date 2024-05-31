import { create } from "zustand";
import { Playlist } from "./Types/spotify.types";

interface MainState {
    playlists: Playlist[];
    setPlaylists: (playlists: Playlist[]) => void;
}

export interface AuthState {
    token: string;
    validUntil: number;
    isUser: boolean;
    setToken: ({token, validUntil, isUser} : Partial<AuthState>) => void;
}

export interface TopState {
    artists: {
        long: Map<string, number>
        medium: Map<string, number>
        short: Map<string, number>
    }
    tracks: {
        long: Map<string, number>
        medium: Map<string, number>
        short: Map<string, number>
    }
    canSearch: boolean;
    setCanSearch: (canSearch: boolean) => void;
    setArtists: (artists: TopState["artists"]) => void;
    setTracks: (tracks: TopState["tracks"]) => void;
}

const useStore = create<MainState>((set) => ({
    playlists: [],
    setPlaylists: (playlists) => set({ playlists }),
}));

export const useAuthStore = create<AuthState>((set) => ({
    token: "",
    validUntil: 0,
    isUser: false,
    setToken: ({token, validUntil, isUser} : Partial<AuthState>) => set({ token, validUntil, isUser }),
}));

export const useTopStore = create<TopState>((set) => ({
    artists: {
        long: new Map<string, number>(),
        medium: new Map<string, number>(),
        short: new Map<string, number>(),
    },
    tracks: {
        long: new Map<string, number>(),
        medium: new Map<string, number>(),
        short: new Map<string, number>(),
    },
    canSearch: true,
    setCanSearch: (canSearch) => set({ canSearch }),
    setArtists: (artists) => set({ artists }),
    setTracks: (tracks) => set({ tracks }),
}));

export default useStore;