import { useQuery } from "@tanstack/react-query";
import { SimplifiedPlaylist } from "../../Types/spotify.types";
import { useAuthStore, useTopStore, useUserStore } from "../../store";
import { getAllTops, getUser, me } from "../../Managers/spotify.manager";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Me() {
    const auth = useAuthStore();
    const user = useUserStore();
    const top = useTopStore();
    const navigate = useNavigate();
    const { data, fetchStatus } = useQuery<SimplifiedPlaylist[]>({
        queryKey: ["me"],
        queryFn: async () => me(auth.token.length > 0 ? auth : JSON.parse(localStorage.getItem("auth") || "{}")),
    });

    const owned = useMemo(() => data?.filter((playlist) => playlist.owner.id === user.user?.id) || [], [data, user.user]);
    const notOwned = useMemo(() => data?.filter((playlist) => playlist.owner.id !== user.user?.id) || [], [data, user.user]);

    useEffect(() => {
        if (auth.token.length && !auth.isUser) {
            window.location.href = "/";
        } else if (auth.token.length && auth.isUser) {
            getUser(user, auth);
            if (top.canSearch) getAllTops(top, auth);
        }
    }, [auth]);

    if (fetchStatus === "fetching") {
        return <>Loading...</>;
    }

    if (data && data.length && user.user) {
        return (
            <div className="flex flex-col gap-8 px-5 md:px-20 w-full my-12 md:my-20">
                <div className="flex flex-col">
                    <span className="font-spoti text-xl font-semibold">Owned Playlists</span>
                    <span className="w-full h-[2px] bg-gray-300"></span>
                    <div className="flex flex-row w-full overflow-x-auto scroll-container gap-8 md:gap-12 mt-5 pb-3">
                        {owned.map((playlist) => (
                            <button key={playlist.id} className="flex flex-col w-24 md:w-40 gap-1" onClick={() => navigate(`/${playlist.id}`)}>
                                <img
                                    src={playlist.images?.[0].url}
                                    alt={playlist.name}
                                    className="w-full h-24 md:h-40 object-cover"
                                />
                                <div className="flex flex-col w-24 md:w-40 ">
                                    <span className="font-spoti font-semibold text-center w-full truncate">{playlist.name}</span>
                                    <span className="text-center text-xs text-gray-400">{playlist.owner.display_name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <span className="font-spoti text-xl font-semibold">Not Owned Playlists</span>
                    <span className="w-full h-[2px] bg-gray-300"></span>
                    <div className="flex flex-row w-full overflow-x-auto scroll-container gap-8 md:gap-12 mt-5 pb-3">
                        {notOwned.map((playlist) => (
                            <button key={playlist.id} className="flex flex-col w-24 md:w-40 gap-1" onClick={() => navigate(`/${playlist.id}`)}>
                                <img
                                    src={playlist.images?.[0].url}
                                    alt={playlist.name}
                                    className="w-full h-24 md:h-40 object-cover"
                                />
                                <div className="flex flex-col w-24 md:w-40">
                                    <span className="font-spoti font-semibold text-center w-full truncate">{playlist.name}</span>
                                    <span className="text-center text-xs text-gray-400">{playlist.owner.display_name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default Me;
