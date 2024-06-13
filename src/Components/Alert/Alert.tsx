import { useEffect, useState } from "react";
import { create } from "zustand";

interface AlertState {
    message: string;
    type: "success" | "error";
    setAlert: (d: {message: string, type: "success" | "error"}) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    message: "",
    type: "success",
    setAlert: ({message, type}) => set({ message, type }),
}));

function Alert() {
    const { message, type } = useAlertStore();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message.length) {
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 3000);
        }
    }, [message, type]);

    return (
        <div className={`absolute ${show ? "opacity-100" : "opacity-0"} transition-opacity z-10 top-5 `}>
            <div className={`${type === "success" ? "bg-green-600" : "bg-red-600"} text-white p-2 rounded-md`}>
                {message}
            </div>
        </div>
    )
}

export default Alert;