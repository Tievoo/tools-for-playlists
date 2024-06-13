import { Playlist, SimplifiedPlaylist } from "../Types/spotify.types"
import { AuthState, useAuthStore, usePlaylistStore, useTopStore, useUserStore } from "../store"
import { generateLoginUrl } from "../Functions/generateLoginUrl";

export async function get(id: string, setLoadingName: (n: string) => void): Promise<Playlist> {
    const headers = await getHeaders("getPlaylist")

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

    return playlist
}

export async function me(): Promise<SimplifiedPlaylist[]> {
    const headers = await getHeaders()

    //TODO handle mas de una pág
    const r = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers
    })
    const playlists: { items: SimplifiedPlaylist[] } = await r.json()
    return playlists.items
}

export async function getAllTops() {
    const { isUser } = useAuthStore.getState()
    const tops = useTopStore.getState()

    tops.setCanSearch(false)
    if (!isUser) return


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
    alert("token_no_user")
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
        alert("refreshed from handleStartAuth")
        await refreshAuth()
    }
}

export async function refreshAuth() {
    let auth = useAuthStore.getState()

    if (auth.token.length === 0) {
        auth = JSON.parse(localStorage.getItem("auth") || "{}")
    }

    if (auth.isUser) {
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

const getHeaders = async (prov?: string) => {
    const { token, validUntil } = useAuthStore.getState()

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
        alert(`refreshed from getHeaders ${prov}`)
        aToken = await refreshAuth();
    }

    return {
        Authorization: 'Bearer ' + aToken
    }
}