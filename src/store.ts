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

export default useStore;