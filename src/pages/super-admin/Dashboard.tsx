import { useMemo } from 'react';
import { MapPin, Users, Banknote, ListOrdered } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';

export function Dashboard() {
  const { locations, registrations, invoices, waitlistEntries, terms } = useDataStore();

  const activeRegistrations = registrations.filter(r => r.status === 'active');
  const uniqueActiveStudents = new Set(activeRegistrations.map(r => r.studentId)).size;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const waitlisted = waitlistEntries.filter(w => w.status === 'pending').length;

  const tableData = useMemo(() => {
    // Group active registrations by locationId and termId
    const groups: Record<string, { locationName: string; termName: string; count: number }> = {};

    for (const reg of activeRegistrations) {
      const term = terms.find(t => t.id === reg.termId);
      if (!term) continue;
      const location = locations.find(l => l.id === term.locationId);
      if (!location) continue;

      const key = `${location.id}-${term.id}`;
      if (!groups[key]) {
        groups[key] = {
          locationName: location.name,
          termName: `Term ${term.termNo} (${term.startDate})`,
          count: 0
        };
      }
      groups[key].count++;
    }

    return Object.values(groups);
  }, [activeRegistrations, terms, locations]);

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'locationName', label: 'Location' },
    { key: 'termName', label: 'Term' },
    {
      key: 'count',
      label: 'Active Registrations',
      render: (val) => <Badge variant="info">{String(val)}</Badge>
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of academy performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={MapPin} label="Total Locations" value={locations.length} accent="primary" />
        <StatCard icon={Users} label="Active Students" value={uniqueActiveStudents} accent="success" />
        <StatCard icon={Banknote} label="Total Revenue (SAR)" value={totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} accent="warning" />
        <StatCard icon={ListOrdered} label="Waitlisted Students" value={waitlisted} accent="danger" />
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
