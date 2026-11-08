import type { Room, Booking, CheckResult } from './types';

/** AC1: interval is valid when 0 ≤ start < end ≤ 1440 and start > currentTime */
export function validateInterval(
  start: number,
  end: number,
  currentTime: number
): string[] {
  const errors: string[] = [];

  if (start < 0 || end > 1440) {
    errors.push('Times must be between 00:00 and 24:00.');
  }
  if (start >= end) {
    errors.push('Start time must be earlier than end time.');
  }
  if (start <= currentTime) {
    errors.push('Start time must be after the current time.');
  }
  return errors;
}

/** AC2: reject bookings longer than 120 minutes */
export function validateDuration(start: number, end: number): string[] {
  if (end - start > 120) {
    return ['Booking duration cannot exceed 120 minutes.'];
  }
  return [];
}

/** AC4: reject overlapping intervals; touching endpoints are allowed */
export function findOverlaps(
  start: number,
  end: number,
  existing: Booking[]
): Booking[] {
  return existing.filter((b) => start < b.end && b.start < end);
}

/**
 * Full availability check (AC1–AC5).
 * Returns a decision without modifying any booking data.
 */
export function checkAvailability(
  room: Room | null,
  start: number,
  end: number,
  currentTime: number,
  existingBookings: Booking[]
): CheckResult {
  if (!room) {
    return { decision: 'unavailable', reasons: ['Please select a room.'] };
  }

  const reasons: string[] = [];

  // AC1 – interval validity
  reasons.push(...validateInterval(start, end, currentTime));

  // AC2 – duration
  if (start < end) {
    reasons.push(...validateDuration(start, end));
  }

  // AC3 – room blocked
  if (room.blocked) {
    reasons.push(`${room.name} is currently blocked and cannot be booked.`);
  }

  // AC4 – overlaps
  if (start < end && start >= 0 && end <= 1440) {
    const roomBookings = existingBookings.filter((b) => b.roomId === room.id);
    const overlaps = findOverlaps(start, end, roomBookings);
    if (overlaps.length > 0) {
      const labels = overlaps
        .map((b) => `${fmt(b.start)}–${fmt(b.end)} (${b.title})`)
        .join(', ');
      reasons.push(`Overlaps existing booking: ${labels}.`);
    }
  }

  return {
    decision: reasons.length === 0 ? 'available' : 'unavailable',
    reasons,
  };
}

/* ---------- formatting helpers ---------- */

export function fmt(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Convert "HH:MM" string to minutes; returns null on invalid input */
export function parseTime(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h > 24 || m > 59 || (h === 24 && m !== 0)) return null;
  return h * 60 + m;
}
