import useIsMobile from "../../../Hooks/useIsMobile";
import { useTopStore } from "../../../store";

interface Props {
    id: string;
    type: "artists" | "tracks";
}

function TopPill({ id, type }: Props) {
    const topState = useTopStore((state) => state[type]);
    const isMobile = useIsMobile();

    return !isMobile  && (
        <>
            {topState.short.has(id) && (
                <div className=" flex gap-1 bg-spoti-light rounded-full text-xs text-black px-2">
                    #{topState.short.get(id)} <span className="hidden 2xl:flex">last 4 weeks</span>
                </div>
            )}
            {topState.medium.has(id) && (
                <div className="flex gap-1 bg-spoti-dark rounded-full text-xs text-black px-2">
                    #{topState.medium.get(id)} <span className="hidden 2xl:flex">last 6 months</span>
                </div>
            )}
            {topState.long.has(id) && (
                <div className="flex gap-1 bg-green-800 rounded-full text-xs text-white px-2">
                    #{topState.long.get(id)} <span className="hidden 2xl:flex">last 12 months</span>
                </div>
            )}
        </>
    );
}

export default TopPill;
