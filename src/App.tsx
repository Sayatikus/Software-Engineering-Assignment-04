import { useMemo, useState } from 'react';
import { Clock, Search, RotateCcw, GraduationCap } from 'lucide-react';
import { rooms, bookings as initialBookings } from '@/lib/sampleData';
import { checkAvailability, fmt, parseTime } from '@/lib/bookingLogic';
import type { Booking, CheckResult } from '@/lib/types';
import { RoomCard } from '@/components/RoomCard';
import { Timeline } from '@/components/Timeline';
import { ResultPanel } from '@/components/ResultPanel';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [currentTimeStr, setCurrentTimeStr] = useState('09:00');
  const [result, setResult] = useState<CheckResult | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [selectedRoomId]
  );

  const roomBookings = useMemo(
    () => bookings.filter((b) => b.roomId === selectedRoomId),
    [bookings, selectedRoomId]
  );

  const parsedStart = parseTime(startTime);
  const parsedEnd = parseTime(endTime);
  const parsedCurrent = parseTime(currentTimeStr);

  const handleCheck = () => {
    if (!selectedRoom || parsedStart === null || parsedEnd === null || parsedCurrent === null) {
      setResult({
        decision: 'unavailable',
        reasons: ['Please select a room and enter valid times in HH:MM format.'],
      });
      return;
    }
    const res = checkAvailability(selectedRoom, parsedStart, parsedEnd, parsedCurrent, bookings);
    setResult(res);

    // AC5: if available, create a booking to demonstrate the checker
    // — but the requirement says "without changing the existing booking data",
    // so we only show the decision and DO NOT persist.
  };

  const handleReset = () => {
    setBookings(initialBookings);
    setSelectedRoomId('');
    setStartTime('10:00');
    setEndTime('11:00');
    setCurrentTimeStr('09:00');
    setResult(null);
  };

  const timeInputsValid =
    parseTime(startTime) !== null &&
    parseTime(endTime) !== null &&
    parseTime(currentTimeStr) !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-teal-50/40">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 sm:text-lg">
              Smart Campus Room Availability Checker
            </h1>
            <p className="text-xs text-slate-500">
              Check if a campus room is free for your time slot
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left: Room selection */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-700">Select a Room</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {rooms.length} rooms
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  selected={room.id === selectedRoomId}
                  onSelect={() => {
                    setSelectedRoomId(room.id);
                    setResult(null);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Right: Form + result */}
          <section className="space-y-5">
            {/* Time inputs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">
                  Time Interval
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TimeField
                  id="current-time"
                  label="Current time"
                  value={currentTimeStr}
                  onChange={setCurrentTimeStr}
                />
                <TimeField
                  id="start-time"
                  label="Start"
                  value={startTime}
                  onChange={setStartTime}
                />
                <TimeField
                  id="end-time"
                  label="End"
                  value={endTime}
                  onChange={setEndTime}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono">
                  Duration: {durationLabel(startTime, endTime)}
                </span>
                {!timeInputsValid && (
                  <span className="text-amber-600">
                    Enter all times as HH:MM (24-hour format).
                  </span>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleCheck}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" />
                  Check Availability
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Result */}
            <ResultPanel result={result} />

            {/* Timeline */}
            {selectedRoom && (
              <Timeline
                bookings={roomBookings}
                candidateStart={parsedStart}
                candidateEnd={parsedEnd}
              />
            )}
          </section>
        </div>

        {/* Existing bookings for selected room */}
        {selectedRoom && roomBookings.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Existing bookings — {selectedRoom.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="pb-2 pr-4 font-medium">Time</th>
                    <th className="pb-2 pr-4 font-medium">Title</th>
                    <th className="pb-2 font-medium">Booked by</th>
                  </tr>
                </thead>
                <tbody>
                  {roomBookings
                    .slice()
                    .sort((a, b) => a.start - b.start)
                    .map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-2.5 pr-4 font-mono text-xs text-slate-600">
                          {fmt(b.start)}–{fmt(b.end)}
                        </td>
                        <td className="py-2.5 pr-4 text-slate-700">{b.title}</td>
                        <td className="py-2.5 text-slate-500">{b.bookedBy}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Fictional sample data for demonstration only.
      </footer>
    </div>
  );
}

function TimeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        {label}
      </label>
      <input
        id={id}
        type={id === "end-time" ? "text" : "time"}
        placeholder={id === "end-time" ? "HH:MM (up to 24:00)" : undefined}
        inputMode={id === "end-time" ? "numeric" : undefined}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      />
    </div>
  );
}

function durationLabel(startStr: string, endStr: string): string {
  const s = parseTime(startStr);
  const e = parseTime(endStr);
  if (s === null || e === null || s >= e) return '—';
  const mins = e - s;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
