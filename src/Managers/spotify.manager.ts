import { Playlist, SimplifiedPlaylist, Track } from "../Types/spotify.types"
import { AuthState, useAuthStore, useMeStore, usePlaylistStore, useTopStore, useUserStore } from "../store"
import { generateLoginUrl } from "../Functions/generateLoginUrl";

export async function get(id: string, setLoadingName: (n: string) => void): Promise<Playlist> {
    const playlistStore = usePlaylistStore.getState()
    if (playlistStore.playlist && playlistStore.playlist.id === id) {
        return playlistStore.playlist
    }

    const headers = await getHeaders()

    const r = await fetch('https://api.spotify.com/v1/playlists/' + id + "", {
        headers
    })

    const playlist: Playlist = await r.json()
    setLoadingName(playlist.name)
    let initialItems = playlist.tracks.items.length
    let limit = 100
    const promises = []
    let next = playlist.tracks.next
    while (initialItems < playlist.tracks.total && next) {
        promises.push(fetch(next, { headers }).then(r => r.json()).then((d) => d.items))
        initialItems += limit
        next = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=${initialItems}&limit=${limit}`
    }

    const responses = await Promise.all(promises)
    const items = responses.flat()
    playlist.tracks.items = playlist.tracks.items.concat(items)
    // playlistStore.setPlaylist(playlist)

    return playlist
}

export async function me(): Promise<SimplifiedPlaylist[]> {
    const headers = await getHeaders()
    const { setPlaylists } = useMeStore.getState()

    //TODO handle mas de una pág
    const r = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers
    }).then(r => r.json())
    // const playlists: { items: SimplifiedPlaylist[] } = await r.json()
    setPlaylists(r.items)
    return r.items
}

export async function getAllTops() {
    const { isUser } = useAuthStore.getState()
    const tops = useTopStore.getState()

    if (!isUser) return
    tops.setCanSearch(false)


    const headers = await getHeaders()

    const fetchV = (type: string, time: string) => fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time}&limit=50`, { headers })

    const fetches = [
        fetchV("artists", "long_term").then(r => r.json()),
        fetchV("artists", "medium_term").then(r => r.json()),
        fetchV("artists", "short_term").then(r => r.json()),
        fetchV("tracks", "long_term").then(r => r.json()),
        fetchV("tracks", "medium_term").then(r => r.json()),
        fetchV("tracks", "short_term").then(r => r.json()),
    ]

    const data = await Promise.all(fetches)

    const artists = {
        long: new Map<string, number>(),
        medium: new Map<string, number>(),
        short: new Map<string, number>(),
    }

    const tracks = {
        long: new Map<string, number>(),
        medium: new Map<string, number>(),
        short: new Map<string, number>(),
    }

    data.forEach((d, i) => {
        const type = i < 3 ? "artists" : "tracks"
        const time = i % 3 === 0 ? "long" : i % 3 === 1 ? "medium" : "short"
        d.items.forEach((item: any, i: number) => {
            const id = item.id
            if (type === "artists") {
                artists[time].set(id, i + 1)
            } else {
                tracks[time].set(id, i + 1)
            }
        })
    })

    tops.setArtists(artists)
    tops.setTracks(tracks)
}

export async function token_no_user(): Promise<string> {
    const t = await fetch("https://tfp-no-user-auth.tievolib8216.workers.dev/")
    return t.text()
}

export function token_with_user(): void {
    const url = generateLoginUrl()
    window.location.href = url
}

export async function getUser(): Promise<void> {
    const state = useUserStore.getState()

    const headers = await getHeaders()

    const r = await fetch('https://api.spotify.com/v1/me', {
        headers
    })

    const user = await r.json()

    state.setUser(user)
}

export async function handleStartAuth(): Promise<void> {
    const auth = useAuthStore.getState()

    const authInfo: Partial<AuthState> = JSON.parse(
        localStorage.getItem("auth") || "{}"
    );
    if (
        authInfo.validUntil &&
        authInfo.validUntil > Date.now() &&
        authInfo.token
    ) {
        auth.setToken(authInfo);
        return
    } else {
        // if (authInfo.isUser) {
        //     token_with_user()
        //     return 
        // }
        await refreshAuth()
    }
}

export async function refreshAuth(): Promise<string> {
    const auth = useAuthStore.getState()
    let { isUser } = auth
    
    if (auth.token.length === 0) {
        const ls_auth = JSON.parse(localStorage.getItem("auth") || "{}")
        isUser = ls_auth.isUser
    }

    if (isUser) {
        token_with_user()
        return ""
    }
    const token = await token_no_user();
    const newAuth: Partial<AuthState> = {
        token,
        validUntil: Date.now() + 3600000,
        isUser: false,
    };

    auth.setToken(newAuth);
    localStorage.setItem(
        "auth",
        JSON.stringify(newAuth)
    );
    return token;
}

export async function addTracks(ids: string[]): Promise<{ snapshot_id: string }> {
    const headers = await getHeaders()
    const { playlist } = usePlaylistStore.getState()

    const uris = ids.map(id => `spotify:track:${id}`).join(',')

    const r = await fetch(`https://api.spotify.com/v1/playlists/${playlist?.id}/tracks?uris=${encodeURIComponent(uris)}`, {
        method: 'POST',
        headers,
    })

    return r.json()
}

export async function removeTracks(ids: string[], snapshot_id: string): Promise<{ snapshot_id: string }> {
    const headers = await getHeaders()
    const { playlist } = usePlaylistStore.getState()

    const r = await fetch(`https://api.spotify.com/v1/playlists/${playlist?.id}/tracks`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ 
            tracks: ids.map(id => ({ uri: `spotify:track:${id}`, snapshot_id })) 
        })
    })

    return r.json()

}

export async function createPlaylist(name: string, description: string, isPublic: boolean): Promise<string> {
    const headers = await getHeaders()
    const { user } = useUserStore.getState()
    const { setPlaylist } = usePlaylistStore.getState()
    
    const r = await fetch(`https://api.spotify.com/v1/users/${user?.id}/playlists`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, description, public: isPublic })
    }).then(r => r.json())

    setPlaylist(r)

    return r.id
}

export async function updatePlaylist(name: string, description: string, isPublic: boolean, id: string): Promise<void> {
    const headers = await getHeaders()

    await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name, description, public: isPublic })
    })

    return
}

export async function getRecommendations(tracks: string) : Promise<Track[]> {
    const headers = await getHeaders()

    const r = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_tracks=${tracks}`, {
        headers
    }).then(r => r.json())

    return r.tracks
}

const getHeaders = async () => {
    const auth = useAuthStore.getState()
    const { token, validUntil } = auth

    let aToken = token;
    let aValidUntil = validUntil;

    if (!token.length) {
        const auth = localStorage.getItem("auth")
        if (auth) {
            const { token, validUntil } = JSON.parse(auth)
            aToken = token
            aValidUntil = validUntil
        }
    }

    if (aValidUntil < Date.now()) {
        aToken = await refreshAuth();
    }

    return {
        Authorization: 'Bearer ' + aToken
    }
}