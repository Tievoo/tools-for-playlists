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
        <div className="flex flex-col w-full items-center relative">
                <button className="mr-3 mt-2 p-2 px-3 bg-spoti  rounded-full absolute right-0">
                    <span className=" font-semibold text-black font-spoti">
                        Login
                    </span>
                </button>
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
                <div className="flex flex-row gap-1 w-2/3 md:w-1/3">
                    <input
                        className="w-full p-1 px-2"
                        type="text"
                        value={search || ""}
                        placeholder="Paste a playlist url"
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
