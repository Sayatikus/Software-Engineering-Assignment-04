import { CheckCircle2, XCircle, Info } from 'lucide-react';
import type { CheckResult } from '@/lib/types';

interface ResultPanelProps {
  result: CheckResult | null;
}

export function ResultPanel({ result }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Info className="h-5 w-5 shrink-0 text-slate-400" />
        <p className="text-sm text-slate-500">
          Select a room, enter a time interval, and click Check Availability.
        </p>
      </div>
    );
  }

  if (result.decision === 'available') {
    return (
      <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Available</p>
          <p className="text-xs text-emerald-600">
            This room can be booked for the selected interval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-3">
        <XCircle className="h-6 w-6 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-800">Unavailable</p>
          <p className="text-xs text-red-600">
            The booking could not be accepted for the following reasons:
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5 pl-9">
        {result.reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-red-700">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
