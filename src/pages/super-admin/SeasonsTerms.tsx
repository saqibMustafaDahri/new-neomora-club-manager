// import { useState } from 'react';
// import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
// import { useDataStore, TermActions } from '../../store/dataStore';
// import { DataTable, type Column } from '../../components/ui/DataTable';
// import { Modal } from '../../components/ui/Modal';
// import { FormField } from '../../components/ui/FormField';
// import { useToast } from '../../components/ui/Toast';
// import type { Term } from '../../types';

// export function SeasonsTerms() {
//   const { seasons, terms, locations } = useDataStore();
//   const { success } = useToast();

//   const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(new Set([seasons[0]?.id]));
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingTerm, setEditingTerm] = useState<Term | null>(null);
//   const [activeSeasonId, setActiveSeasonId] = useState<string>('');

//   const toggleSeason = (seasonId: string) => {
//     setExpandedSeasons(prev => {
//       const next = new Set(prev);
//       if (next.has(seasonId)) next.delete(seasonId);
//       else next.add(seasonId);
//       return next;
//     });
//   };

//   function handleAddTermClick(seasonId: string) {
//     setActiveSeasonId(seasonId);
//     setEditingTerm(null);
//     setModalOpen(true);
//   }

//   function handleRowClick(row: Term) {
//     setActiveSeasonId(row.seasonId);
//     setEditingTerm(row);
//     setModalOpen(true);
//   }

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const fd = new FormData(e.currentTarget);
//     const locationId = fd.get('locationId') as string;
//     const termNo = parseInt(fd.get('termNo') as string, 10);
//     const startDate = fd.get('startDate') as string;
//     const endDate = fd.get('endDate') as string;
//     const totalWeeks = parseInt(fd.get('totalWeeks') as string, 10);

//     if (editingTerm) {
//       TermActions.update(editingTerm.id, { locationId, termNo, startDate, endDate, totalWeeks });
//       success('Term updated successfully.');
//     } else {
//       const id = `term_${termNo}_${locationId}_${Date.now()}`;
//       TermActions.add({ id, seasonId: activeSeasonId, locationId, termNo, startDate, endDate, totalWeeks });
//       success('Term added successfully.');
//     }
//     setModalOpen(false);
//   }

//   const columns: Column<Term>[] = [
//     {
//       key: 'locationId',
//       label: 'Location',
//       render: (val) => locations.find(l => l.id === val)?.name || 'Unknown'
//     },
//     { key: 'termNo', label: 'Term No' },
//     { key: 'startDate', label: 'Start Date' },
//     { key: 'endDate', label: 'End Date' },
//     { key: 'totalWeeks', label: 'Weeks' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Seasons & Terms</h1>
//         <p className="text-text-muted mt-1">Manage academic years and their location-specific terms.</p>
//       </div>

//       <div className="space-y-4">
//         {seasons.map(season => {
//           const isExpanded = expandedSeasons.has(season.id);
//           const seasonTerms = terms.filter(t => t.seasonId === season.id);

//           return (
//             <div key={season.id} className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
//               <div
//                 className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-muted/50 transition-colors"
//                 onClick={() => toggleSeason(season.id)}
//               >
//                 <div className="flex items-center gap-3">
//                   {isExpanded ? <ChevronDown className="w-5 h-5 text-text-muted" /> : <ChevronRight className="w-5 h-5 text-text-muted" />}
//                   <div>
//                     <h3 className="text-lg font-semibold text-text">{season.name}</h3>
//                     <p className="text-sm text-text-muted">{season.startDate} to {season.endDate}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <span className="text-sm font-medium text-text-muted bg-surface-muted px-2.5 py-1 rounded-md">
//                     {seasonTerms.length} Terms
//                   </span>
//                 </div>
//               </div>

//               {isExpanded && (
//                 <div className="border-t border-border p-4 bg-surface-muted/10">
//                   <div className="flex justify-end mb-4">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddTermClick(season.id);
//                       }}
//                       className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Term
//                     </button>
//                   </div>
//                   <DataTable
//                     columns={columns}
//                     rows={seasonTerms}
//                     onRowClick={handleRowClick}
//                     searchPlaceholder="Search terms..."
//                   />
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <Modal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editingTerm ? 'Edit Term' : 'Add Term'}
//       >
//         <form id="term-form" onSubmit={handleSubmit} className="space-y-4 py-2">
//           <FormField label="Location" required>
//             {(id) => (
//               <select id={id} name="locationId" required defaultValue={editingTerm?.locationId}>
//                 <option value="" disabled>Select Location</option>
//                 {locations.map(loc => (
//                   <option key={loc.id} value={loc.id}>{loc.name}</option>
//                 ))}
//               </select>
//             )}
//           </FormField>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Term Number" required>
//               {(id) => (
//                 <input id={id} name="termNo" type="number" min="1" required defaultValue={editingTerm?.termNo} />
//               )}
//             </FormField>

//             <FormField label="Total Weeks" required>
//               {(id) => (
//                 <input id={id} name="totalWeeks" type="number" min="1" required defaultValue={editingTerm?.totalWeeks} />
//               )}
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Start Date" required>
//               {(id) => (
//                 <input id={id} name="startDate" type="date" required defaultValue={editingTerm?.startDate} />
//               )}
//             </FormField>

//             <FormField label="End Date" required>
//               {(id) => (
//                 <input id={id} name="endDate" type="date" required defaultValue={editingTerm?.endDate} />
//               )}
//             </FormField>
//           </div>

//           <div className="pt-4 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={() => setModalOpen(false)}
//               className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               form="term-form"
//               className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
//             >
//               {editingTerm ? 'Save Changes' : 'Create Term'}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// }
import { useState, useMemo } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useDataStore, TermActions } from '../../store/dataStore';
import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import type { Term } from '../../types';

type TermStatus = 'open' | 'closed' | 'upcoming';

interface TermWithStatus extends Term {
  status: TermStatus;
}

function getTermStatus(term: Term): TermStatus {
  const today = new Date().toISOString().slice(0, 10);
  if (today < term.startDate) return 'upcoming';
  if (today > term.endDate) return 'closed';
  return 'open';
}

const STATUS_LABELS: Record<TermStatus, string> = {
  open: 'Open',
  closed: 'Closed',
  upcoming: 'Upcoming',
};

const STATUS_STYLES: Record<TermStatus, string> = {
  open: 'bg-success/10 text-success border-success/20',
  closed: 'bg-danger/10 text-danger border-danger/20',
  upcoming: 'bg-warning/10 text-warning border-warning/20',
};

export function SeasonsTerms() {
  const { seasons, terms, locations } = useDataStore();
  const { success } = useToast();

  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(new Set([seasons[0]?.id]));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [activeSeasonId, setActiveSeasonId] = useState<string>('');

  const toggleSeason = (seasonId: string) => {
    setExpandedSeasons(prev => {
      const next = new Set(prev);
      if (next.has(seasonId)) next.delete(seasonId);
      else next.add(seasonId);
      return next;
    });
  };

  function handleAddTermClick(seasonId: string) {
    setActiveSeasonId(seasonId);
    setEditingTerm(null);
    setModalOpen(true);
  }

  function handleRowClick(row: Term) {
    setActiveSeasonId(row.seasonId);
    setEditingTerm(row);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const locationId = fd.get('locationId') as string;
    const termNo = parseInt(fd.get('termNo') as string, 10);
    const startDate = fd.get('startDate') as string;
    const endDate = fd.get('endDate') as string;
    const totalWeeks = parseInt(fd.get('totalWeeks') as string, 10);

    if (editingTerm) {
      TermActions.update(editingTerm.id, { locationId, termNo, startDate, endDate, totalWeeks });
      success('Term updated successfully.');
    } else {
      const id = `term_${termNo}_${locationId}_${Date.now()}`;
      TermActions.add({ id, seasonId: activeSeasonId, locationId, termNo, startDate, endDate, totalWeeks });
      success('Term added successfully.');
    }
    setModalOpen(false);
  }

  const columns: Column<TermWithStatus>[] = [
    {
      key: 'locationId',
      label: 'Location',
      render: (val) => locations.find(l => l.id === val)?.name || 'Unknown'
    },
    { key: 'termNo', label: 'Term No' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'totalWeeks', label: 'Weeks' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const status = val as TermStatus;
        return (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        );
      },
    },
  ];

  const locationFilterOptions = useMemo(
    () => locations.map((loc) => ({ value: loc.id, label: loc.name })),
    [locations],
  );

  const filters: FilterConfig[] = [
    { key: 'locationId', label: 'Locations', options: locationFilterOptions },
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
        { value: 'upcoming', label: 'Upcoming' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Seasons & Terms</h1>
        <p className="text-text-muted mt-1">Manage academic years and their location-specific terms.</p>
      </div>

      <div className="space-y-4">
        {seasons.map(season => {
          const isExpanded = expandedSeasons.has(season.id);
          const seasonTerms: TermWithStatus[] = terms
            .filter(t => t.seasonId === season.id)
            .map((t) => ({ ...t, status: getTermStatus(t) }));

          return (
            <div key={season.id} className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-muted/50 transition-colors"
                onClick={() => toggleSeason(season.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-text-muted" /> : <ChevronRight className="w-5 h-5 text-text-muted" />}
                  <div>
                    <h3 className="text-lg font-semibold text-text">{season.name}</h3>
                    <p className="text-sm text-text-muted">{season.startDate} to {season.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text-muted bg-surface-muted px-2.5 py-1 rounded-md">
                    {seasonTerms.length} Terms
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border p-4 bg-surface-muted/10">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTermClick(season.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Term
                    </button>
                  </div>
                  <DataTable
                    columns={columns}
                    rows={seasonTerms}
                    onRowClick={handleRowClick}
                    searchPlaceholder="Search terms..."
                    filters={filters}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTerm ? 'Edit Term' : 'Add Term'}
      >
        <form id="term-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <FormField label="Location" required>
            {(id) => (
              <select id={id} name="locationId" required defaultValue={editingTerm?.locationId}>
                <option value="" disabled>Select Location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Term Number" required>
              {(id) => (
                <input id={id} name="termNo" type="number" min="1" required defaultValue={editingTerm?.termNo} />
              )}
            </FormField>

            <FormField label="Total Weeks" required>
              {(id) => (
                <input id={id} name="totalWeeks" type="number" min="1" required defaultValue={editingTerm?.totalWeeks} />
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" required>
              {(id) => (
                <input id={id} name="startDate" type="date" required defaultValue={editingTerm?.startDate} />
              )}
            </FormField>

            <FormField label="End Date" required>
              {(id) => (
                <input id={id} name="endDate" type="date" required defaultValue={editingTerm?.endDate} />
              )}
            </FormField>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="term-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              {editingTerm ? 'Save Changes' : 'Create Term'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}