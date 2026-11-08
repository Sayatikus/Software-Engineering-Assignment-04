import { useState } from "react";
import { rooms, bookings } from "./lib/sampleData";
import { filterRooms } from "./lib/roomFilters";
import { evaluateSelection } from "./lib/selection";
import { parseTime } from "./lib/time";
import { RoomFilters } from "./components/RoomFilters";
import { TimeForm } from "./components/TimeForm";
import { RoomCard } from "./components/RoomCard";
import { ResultPanel } from "./components/ResultPanel";
import { Timeline } from "./components/Timeline";
import { BookingList } from "./components/BookingList";

export default function App() {
  const [attendees, setAttendees] = useState("1");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [checked, setChecked] = useState(false);
  const matchingRooms = filterRooms(rooms, Number(attendees), equipment);
  // A hidden selection is never used for availability, and is cleared on filter changes.
  const selectedRoom = matchingRooms.find((r) => r.id === selectedId) ?? null;
  const roomBookings = bookings.filter((b) => b.roomId === selectedRoom?.id);
  // Derived result automatically refreshes when the selected room or interval changes (F5).
  const result = checked
    ? evaluateSelection(
        rooms,
        bookings,
        selectedId,
        Number(attendees),
        equipment,
        start,
        end,
      )
    : null;
  const reset = () => {
    setAttendees("1");
    setEquipment([]);
    setSelectedId("");
    setStart("10:00");
    setEnd("11:00");
    setChecked(false);
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
            Smart Campus / Assignment 04
          </p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">
            Find a room for your next session
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fictional campus catalog. Check availability without creating a
            booking.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-label="Room catalog">
            <h2 className="mb-3 font-semibold">
              Choose a room{" "}
              <span className="text-sm font-normal text-slate-500">
                ({matchingRooms.length} matching rooms)
              </span>
            </h2>
            <RoomFilters
              attendees={attendees}
              equipment={equipment}
              onAttendees={(v) => {
                setAttendees(v);
                setSelectedId("");
                setChecked(false);
              }}
              onEquipment={(v) => {
                setEquipment(v);
                setSelectedId("");
                setChecked(false);
              }}
            />
            {matchingRooms.length === 0 ? (
              <p role="status" className="rounded-xl border border-dashed p-5">
                No rooms match your requirements. Reduce attendees or remove
                equipment.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {matchingRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={room.id === selectedRoom?.id}
                    onSelect={() => setSelectedId(room.id)}
                  />
                ))}
              </div>
            )}
          </section>
          <section className="space-y-4" aria-label="Availability checker">
            <TimeForm
              start={start}
              end={end}
              onStart={setStart}
              onEnd={setEnd}
              onCheck={() => setChecked(true)}
              onReset={reset}
            />
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              data-testid="availability-result"
            >
              {selectedRoom && (
                <h2 className="mb-2 text-sm font-semibold">
                  Availability - {selectedRoom.name}
                </h2>
              )}
              <ResultPanel result={result} />
            </div>
            {selectedRoom && (
              <Timeline
                bookings={roomBookings}
                candidateStart={parseTime(start)}
                candidateEnd={parseTime(end)}
              />
            )}
          </section>
        </div>
        {selectedRoom && (
          <BookingList bookings={roomBookings} name={selectedRoom.name} />
        )}
      </main>
      <footer className="px-4 py-5 text-center text-xs text-slate-500">
        All rooms, people and bookings are fictional. Fixed current time 09:00.
      </footer>
    </div>
  );
}
