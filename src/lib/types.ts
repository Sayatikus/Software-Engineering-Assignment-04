export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  equipment: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from midnight (0–1440)
  end: number;
  title: string;
  bookedBy: string;
}

export type Decision = "available" | "unavailable";

export interface CheckResult {
  decision: Decision;
  reasons: string[];
}
