import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Home from "./Components/Home";
import "./index.css";
import { useAuthStore } from "./store";
import Detail from "./Components/Detail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { handleStartAuth } from "./Managers/spotify.manager";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/:id",
        element: <Detail />,
    },
]);

function App() {
    const auth = useAuthStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        handleStartAuth(auth).then(() => setLoading(false));
    }, []);

    return loading ? (
        <div>Loading...</div>
    ) : (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
