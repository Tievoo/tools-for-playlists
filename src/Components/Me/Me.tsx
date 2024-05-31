import { useQuery } from "@tanstack/react-query";
import { SimplifiedPlaylist } from "../../Types/spotify.types";
import { useAuthStore, useTopStore } from "../../store";
import { getAllTops, me } from "../../Managers/spotify.manager";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Me() {
    const auth = useAuthStore();
    const top = useTopStore()
    const navigate = useNavigate();
    const { data, fetchStatus } = useQuery<SimplifiedPlaylist[]>({
        queryKey: ["me"],
        queryFn: async () => me(auth.token.length > 0 ? auth : JSON.parse(localStorage.getItem("auth") || "{}")),
    });

    useEffect(() => {
        if (auth.token.length && !auth.isUser) {
            window.location.href = "/";
        } else if (auth.token.length && auth.isUser) {
            getAllTops(top, auth);
        }
    }, [auth]);

    if (fetchStatus === "fetching") {
        return <>Loading...</>;
    }

    if (data && data.length) {
        return (
            <div className="flex flex-row w-full gap-8 md:gap-12 flex-wrap px-5 md:px-20 my-12 md:my-20 justify-center" >
                {data.map((playlist) => (
                    <button key={playlist.id} className="flex flex-col w-24 md:w-40 gap-1" onClick={() => navigate(`/${playlist.id}`)}>
                        <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="w-full h-24 md:h-40"
                        />
                        <span className="font-spoti font-semibold text-center w-full truncate">{playlist.name}</span>
                    </button>
                ))}
            </div>
        )
    }
}

export default Me;
