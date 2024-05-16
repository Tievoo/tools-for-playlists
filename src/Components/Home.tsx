import usePlaylistInput from "../Hooks/usePlaylistInput";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import { useEffect, useMemo } from "react";
import { FaXmark } from "react-icons/fa6";

function Home() {
    const location = useLocation();
    const { isUser } = useAuthStore();

    const [search, setSearch] = usePlaylistInput();

    const inDetail = useMemo(() => location.pathname.length > 1, [location]);

    useEffect(() => {
        if (inDetail && search && search.length === 0) {
            setSearch(
                "https://open.spotify.com/playlist/" +
                    location.pathname.slice(1)
            );
        }
    }, [location]);

    return (
        <div className="flex flex-col w-full items-center">
            <div
                className="flex flex-col items-center home-move w-full"
                style={{
                    marginTop:
                        inDetail
                            ? "2rem"
                            : isUser
                            ? "4rem"
                            : "12rem",
                }}
            >
                <span>ToolsForPlaylists</span>
                <div className="flex flex-row gap-1 w-1/3">
                    <input
                        className="w-full"
                        type="text"
                        value={search || ""}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={() => setSearch(null)}
                        className="disabled:opacity-0 opacity-100"
                        disabled={!inDetail}
                    >
                        <FaXmark color="white" />
                    </button>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Home;
