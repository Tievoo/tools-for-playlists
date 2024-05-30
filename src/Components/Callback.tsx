import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

function Callback() {
    const navigate = useNavigate();
    const { setToken } = useAuthStore(); 

    const handleAuth = () => {
        const hash = new URLSearchParams(window.location.hash?.slice(1));
        // const query = new URLSearchParams(window.location.search);
        if (hash.has("access_token")) {
            const state = hash.get("state");
            const loginState = localStorage.getItem("login-state");
            if (state === loginState) {
                const newAuth = {
                    token: hash.get("access_token")!,
                    validUntil: Date.now() + 60 * 60 * 1000,
                    isUser: true,
                }
                setToken(newAuth);
                localStorage.setItem(
                    "auth",
                    JSON.stringify(newAuth)
                );
                return navigate("/me");
            }
        } 
        return navigate("/");
    }

    useEffect(() => {
        handleAuth();
    }, [])

    return <>Loading...</>;
}

export default Callback;