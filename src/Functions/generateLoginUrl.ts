import { generateRandomString } from "./generateRandomString";

export function generateLoginUrl() {
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
    var redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "";

    const state = generateRandomString(16);

    localStorage.setItem("login-state", state);
    const scope = 'user-read-private user-read-email playlist-read-private user-top-read';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    console.log(url);

    return url;
}