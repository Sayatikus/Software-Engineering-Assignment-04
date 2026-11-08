import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability } from '../src/lib/bookingLogic.ts';

const NOW = 540;
const ROOM = { id: 'r1', name: 'Study Room', building: 'Main', capacity: 8, blocked: false };
const BOOKING = { id: 'b1', roomId: 'r1', start: 600, end: 660, title: 'Study group', bookedBy: 'Student' };
const OVERLAP = 'Overlaps existing booking: 10:00–11:00 (Study group).';
const AVAILABLE = { decision: 'available', reasons: [] };

const cases = [
  ['T01 AC4 touching after', 660, 720],
  ['T02 AC1 starts now', 540, 570, 'Start time must be after the current time.'],
  ['T03 AC1 zero duration', 720, 720, 'Start time must be earlier than end time.'],
  ['T04 AC1 reversed', 750, 720, 'Start time must be earlier than end time.'],
  ['T05 AC1 past day end', 1380, 1441, 'Times must be between 00:00 and 24:00.'],
  ['T06 AC2 120 minutes', 720, 840],
  ['T07 AC2 121 minutes', 720, 841, 'Booking duration cannot exceed 120 minutes.'],
  ['T08 AC4 touching before', 570, 600],
  ['T09 AC4 partial overlap', 630, 690, OVERLAP],
  ['T10 AC4 contains booking', 570, 690, OVERLAP],
  ['T11 AC4 inside booking', 615, 645, OVERLAP],
  ['T12 AC4 identical interval', 600, 660, OVERLAP],
  ['T13 AC3 blocked room', 660, 720, 'Study Room is currently blocked and cannot be booked.', { blocked: true }],
  ['T14 AC4 empty schedule', 630, 690, null, {}, []],
  ['T16 AC4 overlapping booking in another room', 630, 690, null, {}, [{ ...BOOKING, roomId: 'r2' }]],
  ['T17 AC1 end at 24:00', 1380, 1440],
  ['T18 AC1 starts before now', 510, 530, 'Start time must be after the current time.'],
];

for (const [name, start, end, reason, roomOverrides = {}, bookings = [BOOKING]] of cases) {
  test(name, () => {
    const actual = checkAvailability(
      { ...ROOM, ...roomOverrides }, start, end, NOW, structuredClone(bookings)
    );
    const expected = reason ? { decision: 'unavailable', reasons: [reason] } : AVAILABLE;
    assert.deepEqual(actual, expected);
  });
}

test('T15 AC5 preserves booking contents and order', () => {
  const bookings = [
    { ...BOOKING, id: 'b2', start: 780, end: 840 },
    { ...BOOKING },
  ];
  const original = structuredClone(bookings);
  const actual = checkAvailability({ ...ROOM }, 720, 750, NOW, bookings);
  assert.deepEqual(actual, AVAILABLE);
  assert.deepEqual(bookings, original);
});
