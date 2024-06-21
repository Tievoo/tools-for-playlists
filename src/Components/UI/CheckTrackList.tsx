import { msFormat } from "../../Functions/msFormat";
import { Track } from "../../Types/spotify.types";
import Checkbox from "../Checkbox";

interface Props {
    checks: Map<string, boolean>;
    changeAll: () => void;
    allChecked: boolean;
    undoChanges?: () => void;
    save: () => void;
    onChange: (id: string) => void;
    tracks: Track[];
    modified: boolean;
}

function CheckTrackList({
    changeAll,
    allChecked,
    undoChanges,
    save,
    onChange,
    tracks,
    checks,
    modified,
}: Props) {
    return (
        <>
            <div className="flex flex-row gap-1 font-spoti font-medium items-center">
                <Checkbox checked={allChecked} onChange={changeAll} />
                <span className="mt-2">Select All</span>
            </div>
            <div className="flex flex-col overflow-y-scroll flex-1 max-h-96">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        className="flex flex-row items-center justify-between w-full gap-3 bg-gray-dark p-2 font-spoti hover:bg-gray-light transition-colors"
                    >
                        <Checkbox
                            checked={checks.get(track.id) || false}
                            onChange={() => onChange(track.id)}
                        />
                        <div className="flex flex-row gap-2">
                            <span>{track.name}</span>
                        </div>
                        <span>{msFormat(track.duration_ms)}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-row gap-2 w-full">
                {
                    undoChanges && (
                        <button
                            className="bg-red-500 text-white p-2 rounded font-spoti font-medium disabled:bg-gray-light w-1/2"
                            onClick={undoChanges}
                            disabled={!modified}
                        >
                            Undo
                        </button>
                    )
                }
                <button
                    className="bg-green-500 text-white p-2 rounded font-spoti font-medium disabled:bg-gray-light w-1/2 flex-1"
                    onClick={save}
                    disabled={!modified}
                >
                    {modified ? "Save" : "Saved"}
                </button>
            </div>
        </>
    );
}

export default CheckTrackList;
