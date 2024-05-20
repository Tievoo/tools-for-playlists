import { Playlist } from "../Types/spotify.types"
import { AuthState } from "../store"

export async function get(url: string, state: AuthState): Promise<Playlist> {
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

// export function get_me(url: string, token: string) {
//     return get('me/' + url, token)
// }

export async function token_no_user(): Promise<string> {
    const t = await fetch("https://tfp-no-user-auth.tievolib8216.workers.dev/")
    return t.text()
}

export async function handleStartAuth(auth: AuthState): Promise<string> {
    const authInfo: Partial<AuthState> = JSON.parse(
        localStorage.getItem("auth") || "{}"
    );
    if (
        authInfo.validUntil &&
        authInfo.validUntil > Date.now() &&
        authInfo.token
    ) {
        auth.setToken(authInfo);
        return authInfo.token;
    } else {
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
}

export async function refreshAuth(auth: AuthState) {
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