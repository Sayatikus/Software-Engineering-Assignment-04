import type { Room } from "./types";

export function filterRooms(
  rooms: Room[],
  attendees: number,
  equipment: string[],
): Room[] {
  if (!Number.isInteger(attendees) || attendees < 1) return [];
  return rooms.filter(
    (room) =>
      room.capacity >= attendees &&
      equipment.every((item) => room.equipment.includes(item)),
  );
}
