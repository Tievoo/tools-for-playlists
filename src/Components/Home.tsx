import usePlaylistInput from "../Hooks/usePlaylistInput";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore, useTopStore, useUserStore } from "../store";
import { useEffect, useMemo } from "react";
import { FaXmark } from "react-icons/fa6";
import { generateLoginUrl } from "../Functions/generateLoginUrl";
import Alert from "./Alert/Alert";
import { getAllTops, getUser } from "../Managers/spotify.manager";

function Home() {
    const location = useLocation();
    const { isUser } = useAuthStore();
    const auth = useAuthStore();
    const navigate = useNavigate();
    const user = useUserStore();
	const top = useTopStore();

    const [search, setSearch] = usePlaylistInput();

    const inDetail = useMemo(
        () => location.pathname.length > 1 && location.pathname !== "/me",
        [location]
    );

    useEffect(() => {
        if (inDetail && search && search.length === 0) {
            setSearch(
                "https://open.spotify.com/playlist/" +
                    location.pathname.slice(1)
            );
        }

        if (location.pathname === "/" && auth.isUser) {
            navigate("/me");
        }
    }, [location]);

	useEffect(() => {
        let { token, isUser } = auth;

        if (!token.length) {
            const lAuth = localStorage.getItem("auth");
            if (lAuth) {
                const authInfo = JSON.parse(lAuth);
                token = authInfo.token;
                isUser = authInfo.isUser;
            }
        }

        if (token.length && !isUser && window.location.pathname !== "/" ) {
            navigate("/");
        } else if (token.length && isUser) {
            getUser();
            if (top.canSearch) getAllTops();
        }
    }, [auth]);

    return (
        <div className="flex flex-col w-full items-center relative">
			<Alert />
            <div className="flex flex-row gap-3 absolute right-0 items-center">
                {user.user && (
                    <div className="flex flex-row gap-2 items-center">
                        {user.user.images && user.user.images.length > 0 ? (
                            <img
                                src={user.user.images[0].url}
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-400" />
                        )}
                        <div className="flex flex-col">
                            <span className="font-spoti font-semibold text-white">
                                {user.user.display_name}
                            </span>
                            <span className="font-spoti text-xs text-gray-300">
                                {user.user.email}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    className="mr-3 mt-2 p-2 px-3 bg-spoti-light  rounded-full"
                    onClick={() => {
						if (isUser) {
							auth.logout();
                            user.setUser(null);
                            navigate("/");
						} else {
							window.location.href = generateLoginUrl();
						}
					}}
                >
                    <span className=" font-semibold text-black font-spoti">
                        {isUser ? "Logout" : "Login"}
                    </span>
                </button>
            </div>
            <div
                className="flex flex-col items-center home-move w-full"
                style={{
                    marginTop: inDetail ? "4rem" : isUser ? "4rem" : "12rem",
                }}
            >
                {/* <span>ToolsForPlaylists</span> */}
                <div className="flex flex-row gap-1 w-2/3 md:w-1/3">
                    <input
                        className="w-full p-1 px-2 disabled:text-gray-400"
                        type="text"
                        value={search || ""}
                        placeholder="Paste a playlist url"
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={inDetail}
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
