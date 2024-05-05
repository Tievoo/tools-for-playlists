import { Playlist } from "../Types/spotify.types"
import { AuthState } from "../store"

export async function get(url: string, token: string) : Promise<Playlist> {

    const r = await fetch('https://api.spotify.com/v1/' + url, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return r.json()
}

export function get_me(url: string, token: string) {
    return get('me/' + url, token)
}

export async function token_no_user() : Promise<string> {
    const t = await fetch("https://tfp-no-user-auth.tievolib8216.workers.dev/")
    return t.text()
}

export async function handleStartAuth(auth: AuthState) : Promise<string> {
    const authInfo: Partial<AuthState> = JSON.parse(
        localStorage.getItem("auth") || "{}"
    );
    if (
        authInfo.validUntil &&
        authInfo.validUntil > Date.now() &&
        authInfo.token
    ) {
        console.log(authInfo)
        auth.setToken(authInfo);
        console.log(authInfo.token)
        return authInfo.token;
    } else {
        const token = await token_no_user();
        console.log(token)
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