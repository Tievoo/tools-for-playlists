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
                <div className="bg-spoti rounded-full text-xs text-black px-1">
                    #{topState.short.get(id)} last 4 weeks
                </div>
            )}
            {topState.medium.has(id) && (
                <div className="bg-spoti rounded-full text-xs text-black px-1">
                    #{topState.medium.get(id)} last 6 months
                </div>
            )}
            {topState.long.has(id) && (
                <div className="bg-spoti rounded-full text-xs text-black px-1">
                    #{topState.long.get(id)} last 12 months
                </div>
            )}
        </>
    );
}

export default TopPill;
