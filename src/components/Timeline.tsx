import { fmt } from '@/lib/bookingLogic';
import type { Booking } from '@/lib/types';

interface TimelineProps {
  bookings: Booking[];
  candidateStart: number | null;
  candidateEnd: number | null;
}

const HOURS = Array.from({ length: 25 }, (_, i) => i); // 0..24

export function Timeline({ bookings, candidateStart, candidateEnd }: TimelineProps) {
  const toPercent = (min: number) => `${(min / 1440) * 100}%`;

  const hasCandidate =
    candidateStart !== null &&
    candidateEnd !== null &&
    candidateStart < candidateEnd &&
    candidateStart >= 0 &&
    candidateEnd <= 1440;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-1 text-sm font-semibold text-slate-800">
        Today's Schedule
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        Existing bookings shown in blue; your proposed slot in teal.
      </p>

      {/* Track */}
      <div className="relative mb-2 h-14 rounded-lg bg-slate-100">
        {/* Hour gridlines */}
        {HOURS.map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 border-l border-slate-200"
            style={{ left: `${(h / 24) * 100}%` }}
          />
        ))}

        {/* Existing bookings */}
        {bookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-1 bottom-1 flex items-center overflow-hidden rounded-md bg-blue-500/90 px-2 text-[10px] font-medium text-white shadow-sm"
            style={{
              left: toPercent(b.start),
              width: toPercent(b.end - b.start),
            }}
            title={`${fmt(b.start)}–${fmt(b.end)}: ${b.title}`}
          >
            <span className="truncate">{b.title}</span>
          </div>
        ))}

        {/* Candidate slot */}
        {hasCandidate && (
          <div
            className="absolute top-0 bottom-0 rounded-md border-2 border-dashed border-teal-500 bg-teal-400/30"
            style={{
              left: toPercent(candidateStart!),
              width: toPercent(candidateEnd! - candidateStart!),
            }}
          />
        )}
      </div>

      {/* Hour labels */}
      <div className="relative h-4 text-[10px] text-slate-400">
        {[0, 4, 8, 12, 16, 20, 24].map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2"
            style={{ left: `${(h / 24) * 100}%` }}
          >
            {fmt(h * 60)}
          </span>
        ))}
      </div>
    </div>
  );
}
