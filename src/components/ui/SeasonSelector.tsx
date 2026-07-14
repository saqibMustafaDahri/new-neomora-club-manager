import { CalendarRange } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { Select } from './Select';

/**
 * The one global season control. Every season-aware page reads `selectedSeasonId`
 * from the store rather than keeping its own local season state, so switching
 * seasons here is felt everywhere at once - Dashboard stats, Participants,
 * Reports, Invoices, Roster, System Logs, Notifications, and the Registration
 * Requests approval flow all filter against this same value.
 */
export function SeasonSelector({ compact = false }: { compact?: boolean }) {
  const seasons = useDataStore((s) => s.seasons);
  const selectedSeasonId = useDataStore((s) => s.selectedSeasonId);
  const setSelectedSeasonId = useDataStore((s) => s.setSelectedSeasonId);

  if (seasons.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <CalendarRange className="w-4 h-4 text-text-muted shrink-0" />
      {!compact && (
        <label htmlFor="global-season-select" className="text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:inline">
          Season
        </label>
      )}
      <Select
        id="global-season-select"
        value={selectedSeasonId}
        onChange={(e) => setSelectedSeasonId(e.target.value)}
        className="!py-1.5 !pr-9 text-sm min-w-[140px]"
        aria-label="Select season"
      >
        <option value="all">All Seasons</option>
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </Select>
    </div>
  );
}
