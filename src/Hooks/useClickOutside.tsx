import { RefObject, useEffect } from "react"

function useClickOutside(divRef: RefObject<HTMLDivElement>, buttonRef : RefObject<HTMLButtonElement> | RefObject<HTMLDivElement>, callback : () => void) {
    useEffect(()=>{
        function handleClickOutside(event : any) {
            if (!divRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])
}

export default useClickOutside;