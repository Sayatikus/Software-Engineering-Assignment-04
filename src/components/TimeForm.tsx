import { fmt } from "../lib/time";
import { CURRENT_TIME } from "../lib/selection";
interface Props {
  start: string;
  end: string;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
  onCheck: () => void;
  onReset: () => void;
}
export function TimeForm({
  start,
  end,
  onStart,
  onEnd,
  onCheck,
  onReset,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCheck();
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h2 className="mb-2 font-semibold">Time interval</h2>
      <p className="mb-4 text-sm text-slate-500">
        Fixed current time: {fmt(CURRENT_TIME)}. Maximum duration: 120 minutes.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm" htmlFor="start-time">
          Start
          <input
            id="start-time"
            type="text"
            placeholder="HH:MM"
            value={start}
            onChange={(e) => onStart(e.target.value)}
            className="mt-1 block w-full rounded-lg border p-2"
          />
        </label>
        <label className="text-sm" htmlFor="end-time">
          End
          <input
            id="end-time"
            type="text"
            placeholder="HH:MM (up to 24:00)"
            value={end}
            onChange={(e) => onEnd(e.target.value)}
            className="mt-1 block w-full rounded-lg border p-2"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white"
        >
          Check Availability
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border px-4 py-3"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
