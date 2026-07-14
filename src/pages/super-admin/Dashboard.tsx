// import { useMemo } from 'react';
// import { MapPin, Users, Banknote, ListOrdered } from 'lucide-react';
// import { useDataStore } from '../../store/dataStore';
// import { StatCard } from '../../components/ui/StatCard';
// import { DataTable, type Column } from '../../components/ui/DataTable';
// import { Badge } from '../../components/ui/Badge';

// export function Dashboard() {
//   const { locations, registrations, invoices, waitlistEntries, terms } = useDataStore();

//   const activeRegistrations = registrations.filter(r => r.status === 'active');
//   const uniqueActiveStudents = new Set(activeRegistrations.map(r => r.studentId)).size;
//   const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
//   const waitlisted = waitlistEntries.filter(w => w.status === 'pending').length;

//   const tableData = useMemo(() => {
//     // Group active registrations by locationId and termId
//     const groups: Record<string, { locationName: string; termName: string; count: number }> = {};

//     for (const reg of activeRegistrations) {
//       const term = terms.find(t => t.id === reg.termId);
//       if (!term) continue;
//       const location = locations.find(l => l.id === term.locationId);
//       if (!location) continue;

//       const key = `${location.id}-${term.id}`;
//       if (!groups[key]) {
//         groups[key] = {
//           locationName: location.name,
//           termName: `Term ${term.termNo} (${term.startDate})`,
//           count: 0
//         };
//       }
//       groups[key].count++;
//     }

//     return Object.values(groups);
//   }, [activeRegistrations, terms, locations]);

//   const columns: Column<typeof tableData[0]>[] = [
//     { key: 'locationName', label: 'Location' },
//     { key: 'termName', label: 'Term' },
//     {
//       key: 'count',
//       label: 'Active Registrations',
//       render: (val) => <Badge variant="info">{String(val)}</Badge>
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Dashboard</h1>
//         <p className="text-text-muted mt-1">Overview of academy performance.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard icon={MapPin} label="Total Locations" value={locations.length} accent="primary" />
//         <StatCard icon={Users} label="Active Students" value={uniqueActiveStudents} accent="success" />
//         <StatCard icon={Banknote} label="Total Revenue (SAR)" value={totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} accent="warning" />
//         <StatCard icon={ListOrdered} label="Waitlisted Students" value={waitlisted} accent="danger" />
//       </div>

//       <div className="bg-surface rounded-lg border border-border overflow-hidden">
//         <div className="px-6 py-5 border-b border-border">
//           <h2 className="text-lg font-semibold text-text">Registrations per Location</h2>
//         </div>
//         <div className="p-6">
//           <DataTable
//             columns={columns}
//             rows={tableData}
//             searchPlaceholder="Search locations or terms..."
//           />
//         </div>
//       </div>
//     </div>
//   );
// }




import { useMemo } from 'react';
import { MapPin, Users, Banknote, ListOrdered, TrendingUp, Percent, AlertTriangle, SaudiRiyal } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { selectTermsForSelectedSeason, filterRegistrationsBySelectedSeason } from '../../store/selectors';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';

export function Dashboard() {
  const { locations, registrations, invoices, payments, waitlistEntries, selectedSeasonId, seasons } = useDataStore();

  const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);

  // Every downstream number on this page is scoped to the season selected in the top bar -
  // this page has no season control of its own anymore, it just reads the shared one.
  const seasonTerms = useMemo(() => selectTermsForSelectedSeason(), [selectedSeasonId]);

  const seasonRegistrations = useMemo(
    () => filterRegistrationsBySelectedSeason(registrations),
    [registrations, selectedSeasonId]
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of academy performance.</p>
      </div>

      <p className="text-xs text-text-muted -mt-4">
        {selectedSeasonId === 'all'
          ? `Showing all seasons on record (${seasons.length} season${seasons.length !== 1 ? 's' : ''})`
          : selectedSeason
            ? `Showing ${selectedSeason.name} · ${selectedSeason.startDate} to ${selectedSeason.endDate}`
            : 'No season selected'}
        {' · '}Change this from the season selector in the top bar.
      </p>

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
