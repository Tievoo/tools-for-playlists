export function removeFeat(track: string) {
    if (track.includes("feat.")) {
        const rm =  track.split("feat.")[0]
        if (rm[rm.length - 1] === "(" || rm[rm.length - 1] === "[") return rm.slice(0, -1)
        else return rm
    } else return track
}