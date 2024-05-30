export function msFormat(ms: number) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;

    return `${
        hours > 0 ? hours + ":" : ""
    }${minutes > 0 ? minutes + ":" : "0:"}${seconds % 10 === seconds ? "0" + seconds : seconds}`;
}