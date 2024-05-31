import { Playlist, SimplifiedPlaylist } from "../Types/spotify.types"
import { AuthState, TopState } from "../store"
import { generateLoginUrl } from "../Functions/generateLoginUrl";

export async function get(id: string, state: AuthState, setLoadingName : (n: string) => void): Promise<Playlist> {
    let aToken = state.token;
    if (!state.token || state.validUntil < Date.now()) {
        aToken = await refreshAuth(state);
    }

    const headers = {
        Authorization: 'Bearer ' + aToken
    }

    const r = await fetch('https://api.spotify.com/v1/playlists/' + id, {
        headers
    })

    const playlist: Playlist = await r.json()
    setLoadingName(playlist.name)
    let initialItems = playlist.tracks.items.length
    let limit = 100
    const promises = []
    let next = playlist.tracks.next
    while (initialItems < playlist.tracks.total && next) {
        promises.push(fetch(next, {headers}).then(r => r.json()).then((d) => d.items))
        initialItems += limit
        next = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=${initialItems}&limit=${limit}`
    }

    const responses = await Promise.all(promises)
    const items = responses.flat()
    playlist.tracks.items = playlist.tracks.items.concat(items)

    return playlist
}

export async function me(state: AuthState): Promise<SimplifiedPlaylist[]> {
    let aToken = state.token;
    if (!state.token || state.validUntil < Date.now()) {
        aToken = await refreshAuth(state);
    }

    //TODO handle mas de una pág
    const r = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            Authorization: 'Bearer ' + aToken
        }
    })
    const playlists : { items: SimplifiedPlaylist[] } = await r.json()
    return playlists.items
}

export async function getAllTops(tops: TopState, state: AuthState) {
    if (!state.isUser) return
    let aToken = state.token;
    if (!state.token || state.validUntil < Date.now()) {
        aToken = await refreshAuth(state);
    }

    const headers = {
        Authorization: 'Bearer ' + aToken
    }

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
        console.log(d)
        d.items.forEach((items: any) => {
            console.log(items)
            items.forEach((item: any, i : number) => {
                const id = type === "artists" ? item.name : item.artists.map((a: any) => a.name).join(", ")
                if (type === "artists") {
                    artists[time].set(id, i+1)
                } else {
                    tracks[time].set(id, i+1)
                }
            })
        })
    })

    console.log(artists)
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

export async function handleStartAuth(auth: AuthState): Promise<void> {
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

        await refreshAuth(auth)
    }
}

export async function refreshAuth(auth: AuthState) {
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