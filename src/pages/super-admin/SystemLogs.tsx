import { useMemo, useState } from 'react';
import { UserPlus, Banknote, Search } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { Badge } from '../../components/ui/Badge';

type LogType = 'registration' | 'payment';

interface LogRow {
  id: string;
  type: LogType;
  timestamp: string;
  entityId: string;
  actor: string;
  description: string;
  amount?: number;
}

export function SystemLogs() {
  const { registrations: allRegistrations, invoices, payments: allPayments, students, terms, locations, seasons, selectedSeasonId } = useDataStore();
  const [typeFilter, setTypeFilter] = useState<'all' | LogType>('all');
  const [query, setQuery] = useState('');

  const registrations = useMemo(() => {
    if (selectedSeasonId === 'all') return allRegistrations;
    const seasonTermIds = new Set(terms.filter((t) => t.seasonId === selectedSeasonId).map((t) => t.id));
    return allRegistrations.filter((r) => seasonTermIds.has(r.termId));
  }, [allRegistrations, terms, selectedSeasonId]);

  const payments = useMemo(() => {
    if (selectedSeasonId === 'all') return allPayments;
    const seasonRegIds = new Set(registrations.map((r) => r.id));
    const seasonInvoiceIds = new Set(invoices.filter((i) => seasonRegIds.has(i.registrationId)).map((i) => i.id));
    return allPayments.filter((p) => seasonInvoiceIds.has(p.invoiceId));
  }, [allPayments, invoices, registrations, selectedSeasonId]);

  const currentSeasonName = seasons.find((s) => s.id === selectedSeasonId)?.name;

  const logs = useMemo(() => {
    const studentById = new Map(students.map((s) => [s.id, s]));
    const termById = new Map(terms.map((t) => [t.id, t]));
    const locationById = new Map(locations.map((l) => [l.id, l]));
    const invoiceById = new Map(invoices.map((i) => [i.id, i]));
    const registrationById = new Map(registrations.map((r) => [r.id, r]));

    const rows: LogRow[] = [];

    for (const r of registrations) {
      if (!r.joinDate) continue; // no real timestamp exists for this row - not logged as an event
      const student = studentById.get(r.studentId);
      const term = termById.get(r.termId);
      const location = term ? locationById.get(term.locationId) : undefined;
      rows.push({
        id: `log-reg-${r.id}`,
        type: 'registration',
        timestamp: r.joinDate,
        entityId: r.id,
        actor: student?.name ?? 'Unknown student',
        description: `Registration created${term ? ` for Term ${term.termNo}${location ? ` (${location.name})` : ''}` : ''}`,
      });
    }

    for (const p of payments) {
      if (!p.paidDate) continue;
      const inv = invoiceById.get(p.invoiceId);
      const reg = inv ? registrationById.get(inv.registrationId) : undefined;
      const student = reg ? studentById.get(reg.studentId) : undefined;
      rows.push({
        id: `log-pay-${p.id}`,
        type: 'payment',
        timestamp: p.paidDate,
        entityId: p.id,
        actor: student?.name ?? 'Unknown student',
        description: `Payment recorded via ${p.method.replace('_', ' ')}${p.bankRef ? ` (ref ${p.bankRef})` : ' (no bank reference)'}`,
        amount: p.amount,
      });
    }

    rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return rows;
  }, [registrations, invoices, payments, students, terms, locations]);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      if (query && !`${l.actor} ${l.description} ${l.entityId}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [logs, typeFilter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">System Logs</h1>
        <p className="text-text-muted mt-1">
          Chronological record of registration and payment events, reconstructed from real timestamped data.
        </p>
        <p className="text-xs text-text-muted mt-1">
          {selectedSeasonId === 'all' ? 'Showing all seasons combined' : `Showing ${currentSeasonName ?? 'the selected season'}`} - change this from the season selector in the top bar.
        </p>
        <p className="text-xs text-text-muted mt-1">
          Other event types (logins, setting changes, record edits) aren't shown here - this demo doesn't
          track them, so nothing is fabricated to fill the gap.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search logs by student or entity ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'registration', 'payment'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-md text-xs font-medium capitalize transition-colors ${
                typeFilter === t ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              {t === 'all' ? 'All events' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface-muted/30 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {filtered.length} of {logs.length} events
          </span>
        </div>
        <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-text-muted">No events match this filter.</div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.type === 'registration' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                  {log.type === 'registration' ? <UserPlus className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-text">{log.actor}</span>
                    <Badge variant={log.type === 'registration' ? 'info' : 'success'} size="sm">{log.type}</Badge>
                    {log.amount !== undefined && (
                      <span className="text-xs font-semibold text-success">SAR {log.amount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{log.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-text-muted">{log.timestamp}</p>
                  <p className="text-[10px] font-mono text-text-muted/60">{log.entityId}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
