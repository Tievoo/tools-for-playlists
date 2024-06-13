import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Home from "./Components/Home";
import "./index.css";
import Detail from "./Components/Detail/Detail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { handleStartAuth } from "./Managers/spotify.manager";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Callback from "./Components/Callback";
import Me from "./Components/Me/Me";
import Modal from "react-modal";

const router = createBrowserRouter([
    {
        path: "/callback",
        element: <Callback />,
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/me",
                element: <Me />,
            },
            {
                path: "/:id",
                element: <Detail />,
            },
        ],
    },
]);

function App() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        handleStartAuth().then(() => setLoading(false));
    }, []);

    return loading ? (
        <div>Loading...</div>
    ) : (
        <div className="flex flex-col">
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </div>
    );
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
