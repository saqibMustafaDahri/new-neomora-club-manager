import { useMemo, useState } from 'react';
import { MapPin, Users, Banknote, ListOrdered, TrendingUp, CalendarClock, Percent, AlertTriangle, SaudiRiyal } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';

export function Dashboard() {
  const { locations, registrations, invoices, payments, waitlistEntries, terms, seasons } = useDataStore();

  const [seasonId, setSeasonId] = useState<string>(seasons[0]?.id ?? '');
  const selectedSeason = seasons.find((s) => s.id === seasonId) ?? seasons[0];

  // Every downstream number on this page is scoped to the selected season's terms.
  const seasonTerms = useMemo(
    () => terms.filter((t) => t.seasonId === selectedSeason?.id),
    [terms, selectedSeason]
  );
  const seasonTermIds = useMemo(() => new Set(seasonTerms.map((t) => t.id)), [seasonTerms]);

  const seasonRegistrations = useMemo(
    () => registrations.filter((r) => seasonTermIds.has(r.termId)),
    [registrations, seasonTermIds]
  );
  const activeRegistrations = seasonRegistrations.filter((r) => r.status === 'active');
  const uniqueActiveStudents = new Set(activeRegistrations.map((r) => r.studentId)).size;

  const invoiceByRegId = useMemo(() => new Map(invoices.map((i) => [i.registrationId, i])), [invoices]);
  const seasonInvoices = useMemo(
    () => seasonRegistrations.map((r) => invoiceByRegId.get(r.id)).filter(Boolean) as typeof invoices,
    [seasonRegistrations, invoiceByRegId]
  );
  const totalRevenue = seasonInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const avgRevenuePerStudent = uniqueActiveStudents > 0 ? totalRevenue / uniqueActiveStudents : 0;

  const paymentsByInvoiceId = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of payments) map.set(p.invoiceId, (map.get(p.invoiceId) ?? 0) + p.amount);
    return map;
  }, [payments]);
  const unpaidOrPartialCount = seasonInvoices.filter((inv) => (paymentsByInvoiceId.get(inv.id) ?? 0) < inv.total - 0.01).length;
  const collectionRatePct = totalRevenue > 0
    ? (seasonInvoices.reduce((sum, inv) => sum + Math.min(paymentsByInvoiceId.get(inv.id) ?? 0, inv.total), 0) / totalRevenue) * 100
    : 0;

  const waitlisted = waitlistEntries.filter((w) => w.status === 'pending').length;

  // Registrations per location per term - existing breakdown, still season-scoped
  const tableData = useMemo(() => {
    const groups: Record<string, { locationName: string; termName: string; count: number }> = {};
    for (const reg of activeRegistrations) {
      const term = seasonTerms.find((t) => t.id === reg.termId);
      if (!term) continue;
      const location = locations.find((l) => l.id === term.locationId);
      if (!location) continue;
      const key = `${location.id}-${term.id}`;
      if (!groups[key]) {
        groups[key] = { locationName: location.name, termName: `Term ${term.termNo} (${term.startDate})`, count: 0 };
      }
      groups[key].count++;
    }
    return Object.values(groups);
  }, [activeRegistrations, seasonTerms, locations]);

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'locationName', label: 'Location' },
    { key: 'termName', label: 'Term' },
    { key: 'count', label: 'Active Registrations', render: (val) => <Badge variant="info">{String(val)}</Badge> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">Overview of academy performance.</p>
        </div>

        {/* Season selector - only one season exists today, but this scales as future seasons are added */}
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-text-muted" />
          <label htmlFor="season-select" className="text-xs font-medium text-text-muted uppercase tracking-wider">Season</label>
          <Select
            id="season-select"
            value={selectedSeason?.id ?? ''}
            onChange={(e) => setSeasonId(e.target.value)}
            className="text-sm px-3 py-2 bg-surface text-text"
            containerClassName="min-w-[160px]"
          >
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </div>
      </div>

      {selectedSeason && (
        <p className="text-xs text-text-muted -mt-4">
          Showing {selectedSeason.name} · {selectedSeason.startDate} to {selectedSeason.endDate}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={MapPin} label="Total Locations" value={locations.length} accent="primary" />
        <StatCard icon={Users} label="Active Students" value={uniqueActiveStudents} accent="success" />
        <StatCard icon={Banknote} label="Total Revenue" value={<span className="inline-flex items-center"><SaudiRiyal className="w-8 h-8 mr-1.5 opacity-80" />{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>} accent="warning" />
        <StatCard icon={ListOrdered} label="Waitlisted Students" value={waitlisted} accent="danger" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp} label="Avg. Revenue per Student" value={<span className="inline-flex items-center"><SaudiRiyal className="w-8 h-8 mr-1.5 opacity-80" />{avgRevenuePerStudent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>} accent="primary" />
        <StatCard icon={Percent} label="Collection Rate" value={`${collectionRatePct.toFixed(0)}%`} accent={collectionRatePct >= 99 ? 'success' : collectionRatePct >= 90 ? 'warning' : 'danger'} />
        <StatCard icon={AlertTriangle} label="Invoices Needing Attention" value={unpaidOrPartialCount} accent={unpaidOrPartialCount > 0 ? 'warning' : 'success'} />
        <StatCard icon={Users} label="Total Registrations" value={seasonRegistrations.length} accent="primary" />
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Registrations per Location</h2>
        </div>
        <div className="p-6">
          <DataTable
            columns={columns}
            rows={tableData}
            searchPlaceholder="Search locations or terms..."
          />
        </div>
      </div>
    </div>
  );
}
