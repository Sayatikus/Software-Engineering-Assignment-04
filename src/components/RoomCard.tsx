import { Users, MapPin, Lock, CheckCircle2 } from "lucide-react";
import type { Room } from "@/lib/types";

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      data-testid={`room-${room.id}`}
      className={`group relative w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/20"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-800">
            {room.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{room.building}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>Capacity {room.capacity}</span>
          </div>
        </div>
        {room.blocked ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
            <Lock className="h-3 w-3" />
            Blocked
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Open
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-600">
        Equipment: {room.equipment.join(", ")}
      </p>
      {selected && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white shadow">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      )}
    </button>
  );
}
