import { Playlist, SimplifiedPlaylist } from "../Types/spotify.types"
import { AuthState } from "../store"
import { generateLoginUrl } from "../Functions/generateLoginUrl";

export async function get(url: string, state: AuthState, setLoadingName : (n: string) => void): Promise<Playlist> {
    let aToken = state.token;
    if (!state.token || state.validUntil < Date.now()) {
        aToken = await refreshAuth(state);
    }

    const r = await fetch('https://api.spotify.com/v1/' + url, {
        headers: {
            Authorization: 'Bearer ' + aToken
        }
    })

    const playlist: Playlist = await r.json()
    setLoadingName(playlist.name)
    let next = playlist.tracks.next
    while (playlist.tracks.items.length < playlist.tracks.total && next) {
        const r = await fetch(next!, {
            headers: {
                Authorization: 'Bearer ' + aToken
            }
        }
        )
        const nextD = await r.json()
        next = nextD.next
        // const tracks : PlaylistedTrack<Track>[] = [...nextD.items.map((i:any)=>i.track)].filter((t:Track)=>!!t)
        const items = nextD.items.filter((i: any) => !!i.track)
        playlist.tracks.items = playlist.tracks.items.concat(items)

    }
    console.log(playlist.tracks.items)
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