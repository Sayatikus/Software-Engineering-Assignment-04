const EQUIPMENT = ["Projector", "Whiteboard", "Computers", "Microphone"];
interface Props {
  attendees: string;
  equipment: string[];
  onAttendees: (value: string) => void;
  onEquipment: (value: string[]) => void;
}
export function RoomFilters({
  attendees,
  equipment,
  onAttendees,
  onEquipment,
}: Props) {
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <label htmlFor="attendees" className="block text-sm font-medium">
        Attendees (minimum capacity)
      </label>
      <input
        id="attendees"
        type="number"
        min="1"
        step="1"
        value={attendees}
        onChange={(e) => onAttendees(e.target.value)}
        className="mt-2 w-full rounded-lg border p-2"
      />
      {(!Number.isInteger(Number(attendees)) || Number(attendees) < 1) && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          Enter a positive whole number of attendees.
        </p>
      )}
      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-medium">
          Required equipment (all selected items)
        </legend>
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {EQUIPMENT.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={equipment.includes(item)}
                onChange={(e) =>
                  onEquipment(
                    e.target.checked
                      ? [...equipment, item]
                      : equipment.filter((x) => x !== item),
                  )
                }
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
