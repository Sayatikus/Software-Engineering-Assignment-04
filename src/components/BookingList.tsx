import type { Booking } from "../lib/types";
import { fmt } from "../lib/time";
export function BookingList({
  bookings,
  name,
}: {
  bookings: Booking[];
  name: string;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 font-semibold">Existing bookings - {name}</h2>
      {bookings.length === 0 ? (
        <p>No existing bookings for this room.</p>
      ) : (
        <ul className="space-y-2">
          {[...bookings]
            .sort((a, b) => a.start - b.start)
            .map((b) => (
              <li key={b.id} className="flex flex-wrap gap-2 text-sm">
                <span className="font-mono">
                  {fmt(b.start)} - {fmt(b.end)}
                </span>
                <span>{b.title}</span>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
