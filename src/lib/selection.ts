import type { Room, Booking, CheckResult } from "./types";
import { filterRooms } from "./roomFilters.ts";
import { checkAvailability } from "./bookingLogic.ts";
import { parseTime } from "./time.ts";

export const CURRENT_TIME = 540; // Fixed fictional day: 09:00; no live clock/API.
export function evaluateSelection(
  rooms: Room[],
  bookings: Booking[],
  roomId: string,
  attendees: number,
  equipment: string[],
  startText: string,
  endText: string,
): CheckResult {
  const room =
    filterRooms(rooms, attendees, equipment).find((r) => r.id === roomId) ??
    null;
  const start = parseTime(startText);
  const end = parseTime(endText);
  if (start === null || end === null) {
    return {
      decision: "unavailable",
      reasons: [
        "Enter valid times as HH:MM; 24:00 is allowed only as an end time.",
      ],
    };
  }
  return checkAvailability(room, start, end, CURRENT_TIME, bookings);
}
