// import { useState, useMemo } from 'react';
// import { AlertTriangle } from 'lucide-react';
// import { useDataStore } from '../../store/dataStore';
// import { DataTable, type Column } from '../../components/ui/DataTable';
// import { Badge } from '../../components/ui/Badge';
// import { Modal } from '../../components/ui/Modal';
// import type { Invoice } from '../../types';

// const PAYMENT_METHODS: Record<string, string> = {
//   bank_transfer: 'Bank Transfer',
//   credit_card: 'Credit Card',
//   cash: 'Cash'
// };

// export function Invoices() {
//   const { invoices, registrations, students, programs, terms, locations, payments } = useDataStore();

//   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

//   // Build filter options
//   const [filterLocation, setFilterLocation] = useState<string>('all');
//   const [filterTerm, setFilterTerm] = useState<string>('all');
//   const [filterStatus, setFilterStatus] = useState<string>('all');

//   const tableData = useMemo(() => {
//     return invoices.map(inv => {
//       const reg = registrations.find(r => r.id === inv.registrationId);
//       const student = reg ? students.find(s => s.id === reg.studentId) : null;
//       const program = reg ? programs.find(p => p.id === reg.programId) : null;
//       const term = reg ? terms.find(t => t.id === reg.termId) : null;
//       const location = student ? locations.find(l => l.id === student.locationId) : null;

//       const invoicePayments = payments.filter(p => p.invoiceId === inv.id);
//       const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);

//       let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
//       if (totalPaid >= inv.total) paymentStatus = 'Paid';
//       else if (totalPaid > 0) paymentStatus = 'Partial';

//       // Flag: any payment missing bankRef or paidDate
//       const hasFlag = invoicePayments.some(p => !p.bankRef || !p.paidDate);

//       return {
//         ...inv,
//         studentName: student?.name || 'Unknown',
//         programName: program?.name || 'Unknown',
//         termName: term ? `Term ${term.termNo}` : 'Unknown',
//         locationId: location?.id || '',
//         locationName: location?.name || 'Unknown',
//         paymentStatus,
//         hasFlag,
//         totalPaid
//       };
//     });
//   }, [invoices, registrations, students, programs, terms, locations, payments]);

//   const filteredData = useMemo(() => {
//     return tableData.filter(row => {
//       if (filterLocation !== 'all' && row.locationId !== filterLocation) return false;
//       if (filterTerm !== 'all') {
//         const reg = registrations.find(r => r.id === row.registrationId);
//         if (!reg || reg.termId !== filterTerm) return false;
//       }
//       if (filterStatus !== 'all' && row.paymentStatus !== filterStatus) return false;
//       return true;
//     });
//   }, [tableData, filterLocation, filterTerm, filterStatus, registrations]);

//   // Payments for the selected invoice
//   const selectedPayments = useMemo(() => {
//     if (!selectedInvoice) return [];
//     return payments.filter(p => p.invoiceId === selectedInvoice.id);
//   }, [selectedInvoice, payments]);

//   const columns: Column<typeof tableData[0]>[] = [
//     { key: 'id', label: 'Invoice', render: (val) => <span className="text-xs font-mono text-text-muted">{String(val)}</span> },
//     { key: 'studentName', label: 'Student' },
//     { key: 'programName', label: 'Program' },
//     { key: 'termName', label: 'Term' },
//     { key: 'locationName', label: 'Location' },
//     { key: 'total', label: 'Total', render: (val) => <span className="font-semibold">{Number(val).toFixed(0)} SAR</span> },
//     {
//       key: 'paymentStatus',
//       label: 'Status',
//       render: (val, row) => (
//         <div className="flex items-center gap-2">
//           <Badge variant={val === 'Paid' ? 'success' : val === 'Partial' ? 'warning' : 'danger'}>
//             {String(val)}
//           </Badge>
//           {row.hasFlag && (
//             <div className="group relative">
//               <AlertTriangle className="w-4 h-4 text-warning" />
//               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-text text-background text-xs rounded shadow-lg z-10 text-center">
//                 Payment is missing a bank reference or date.
//               </div>
//             </div>
//           )}
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Invoices</h1>
//         <p className="text-text-muted mt-1">All invoices across both locations.</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3">
//         <select
//           value={filterLocation}
//           onChange={e => setFilterLocation(e.target.value)}
//           className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
//         >
//           <option value="all">All Locations</option>
//           {locations.map(l => (
//             <option key={l.id} value={l.id}>{l.name}</option>
//           ))}
//         </select>

//         <select
//           value={filterTerm}
//           onChange={e => setFilterTerm(e.target.value)}
//           className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
//         >
//           <option value="all">All Terms</option>
//           {terms.map(t => (
//             <option key={t.id} value={t.id}>{t.termNo === 1 ? 'Term 1' : t.termNo === 2 ? 'Term 2' : 'Term 3'} — {locations.find(l => l.id === t.locationId)?.name}</option>
//           ))}
//         </select>

//         <select
//           value={filterStatus}
//           onChange={e => setFilterStatus(e.target.value)}
//           className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
//         >
//           <option value="all">All Statuses</option>
//           <option value="Paid">Paid</option>
//           <option value="Partial">Partial</option>
//           <option value="Unpaid">Unpaid</option>
//         </select>
//       </div>

//       <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
//         <DataTable
//           columns={columns}
//           rows={filteredData}
//           onRowClick={(row) => setSelectedInvoice(row)}
//           searchPlaceholder="Search by student or program..."
//           searchKeys={['studentName', 'programName', 'locationName']}
//         />
//       </div>

//       {/* Invoice detail modal */}
//       <Modal
//         isOpen={!!selectedInvoice}
//         onClose={() => setSelectedInvoice(null)}
//         title="Invoice Details"
//       >
//         {selectedInvoice && (() => {
//           const row = tableData.find(d => d.id === selectedInvoice.id)!;
//           return (
//             <div className="space-y-6 py-2">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-text-muted">Student</p>
//                   <p className="font-medium text-text">{row.studentName}</p>
//                 </div>
//                 <div>
//                   <p className="text-text-muted">Program</p>
//                   <p className="font-medium text-text">{row.programName}</p>
//                 </div>
//                 <div>
//                   <p className="text-text-muted">Term</p>
//                   <p className="font-medium text-text">{row.termName}</p>
//                 </div>
//                 <div>
//                   <p className="text-text-muted">Location</p>
//                   <p className="font-medium text-text">{row.locationName}</p>
//                 </div>
//               </div>

//               {/* Fee breakdown */}
//               <div className="border border-border rounded-lg overflow-hidden">
//                 <div className="bg-surface-muted px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Fee Breakdown</div>
//                 <div className="divide-y divide-border text-sm">
//                   <div className="px-4 py-2.5 flex justify-between">
//                     <span className="text-text-muted">Base Tuition</span>
//                     <span className="font-medium text-text">{selectedInvoice.baseAmount.toFixed(0)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between">
//                     <span className="text-text-muted">Kit Fee</span>
//                     <span className="font-medium text-text">{selectedInvoice.kitFee.toFixed(0)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between">
//                     <span className="text-text-muted">Registration Fee</span>
//                     <span className="font-medium text-text">{selectedInvoice.registrationFee.toFixed(0)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between text-danger">
//                     <span>Discount ({selectedInvoice.discountPct}%)</span>
//                     <span>-{selectedInvoice.discountAmount.toFixed(0)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between text-text-muted">
//                     <span>VAT</span>
//                     <span>{selectedInvoice.vatAmount.toFixed(0)} SAR</span>
//                   </div>
//                   <div className="px-4 py-3 flex justify-between bg-surface-muted/40 font-semibold">
//                     <span className="text-text">Total</span>
//                     <span className="text-text">{selectedInvoice.total.toFixed(0)} SAR</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment history */}
//               <div>
//                 <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Payment History</h4>
//                 {selectedPayments.length === 0 ? (
//                   <p className="text-sm text-text-muted">No payments recorded.</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {selectedPayments.map(p => (
//                       <div key={p.id} className={`p-3 rounded-lg border flex justify-between items-start gap-4 ${(!p.bankRef || !p.paidDate) ? 'border-warning/40 bg-warning/5' : 'border-border bg-surface-muted/20'}`}>
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-medium text-text">{p.amount.toFixed(0)} SAR</span>
//                             {(!p.bankRef || !p.paidDate) && (
//                               <AlertTriangle className="w-3.5 h-3.5 text-warning" />
//                             )}
//                           </div>
//                           <p className="text-xs text-text-muted mt-0.5">{PAYMENT_METHODS[p.method]} · {p.paidDate || 'No date'}</p>
//                           {p.bankRef ? (
//                             <p className="text-xs font-mono text-text-muted">{p.bankRef}</p>
//                           ) : (
//                             <p className="text-xs text-warning">Missing bank reference</p>
//                           )}
//                           {p.notes && <p className="text-xs text-text-muted italic mt-0.5">{p.notes}</p>}
//                         </div>
//                       </div>
//                     ))}
//                     <div className="text-xs text-right text-text-muted pt-1">
//                       Paid: {row.totalPaid.toFixed(0)} / {selectedInvoice.total.toFixed(0)} SAR
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="pt-4 flex justify-end border-t border-border">
//                 <button
//                   onClick={() => setSelectedInvoice(null)}
//                   className="px-4 py-2 bg-surface-muted border border-border rounded-md text-sm font-medium hover:bg-border/50 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           );
//         })()}
//       </Modal>
//     </div>
//   );
// }



// import { useMemo } from 'react';
// import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';
// import { useDataStore } from '../../store/dataStore';

// function formatDate(iso: string): string {
//   if (!iso) return '—';
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return '—';
//   return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
// }

// export function Invoices() {
//   const students = useDataStore((s) => s.students);
//   const families = useDataStore((s) => s.families);
//   const registrations = useDataStore((s) => s.registrations);
//   const invoices = useDataStore((s) => s.invoices);
//   const payments = useDataStore((s) => s.payments);
//   const programs = useDataStore((s) => s.programs);
//   const terms = useDataStore((s) => s.terms);
//   const locations = useDataStore((s) => s.locations);

//   // Build one row per Registration, matching the exact shape this table already expects.
//   const mockStudents = useMemo(() => {
//     const studentById = new Map(students.map((s) => [s.id, s]));
//     const familyById = new Map(families.map((f) => [f.id, f]));
//     const programById = new Map(programs.map((p) => [p.id, p]));
//     const termById = new Map(terms.map((t) => [t.id, t]));
//     const locationById = new Map(locations.map((l) => [l.id, l]));
//     const invoiceByRegId = new Map(invoices.map((i) => [i.registrationId, i]));
//     const paymentsByInvoiceId = new Map<string, typeof payments>();
//     for (const p of payments) {
//       const list = paymentsByInvoiceId.get(p.invoiceId) ?? [];
//       list.push(p);
//       paymentsByInvoiceId.set(p.invoiceId, list);
//     }

//     return registrations.map((reg) => {
//       const student = studentById.get(reg.studentId);
//       const family = student ? familyById.get(student.familyId) : undefined;
//       const program = programById.get(reg.programId);
//       const term = termById.get(reg.termId);
//       const location = term ? locationById.get(term.locationId) : undefined;
//       const invoice = invoiceByRegId.get(reg.id);
//       const paidAmount = invoice
//         ? (paymentsByInvoiceId.get(invoice.id) ?? []).reduce((sum, p) => sum + p.amount, 0)
//         : 0;
//       const total = invoice?.total ?? 0;
//       const balance = total - paidAmount;
//       const status = balance <= 0.01 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid';

//       return {
//         id: reg.id,
//         studentName: student?.name ?? 'Unknown',
//         gender: '',
//         guardianName: family?.guardianName || '—',
//         guardianPhone: family?.phonePrimary || '—',
//         program: program?.name ?? 'Unknown',
//         branch: location?.name ?? 'Unknown',
//         term: term ? `${location?.name ?? ''} Term ${term.termNo} (${term.startDate})` : 'Unknown',
//         joinDate: formatDate(reg.joinDate),
//         total,
//         paid: paidAmount,
//         balance,
//         status,
//       };
//     });
//   }, [students, families, registrations, invoices, payments, programs, terms, locations]);

//   // Compute metric totals
//   const totalInvoiced = mockStudents.reduce((sum, s) => sum + s.total, 0);
//   const totalCollected = mockStudents.reduce((sum, s) => sum + s.paid, 0);
//   const totalOutstanding = mockStudents.reduce((sum, s) => sum + s.balance, 0);

//   const filters: FilterConfig[] = useMemo(() => [
//     {
//       key: 'branch',
//       label: 'locations',
//       options: locations.map((l) => ({ value: l.name, label: l.name }))
//     },
//     {
//       key: 'program',
//       label: 'programs',
//       options: programs.map((p) => ({ value: p.name, label: p.name }))
//     },
//     {
//       key: 'status',
//       label: 'payment statuses',
//       options: [
//         { value: 'Partial', label: 'Partial' },
//         { value: 'Unpaid', label: 'Unpaid' },
//         { value: 'Paid', label: 'Paid' }
//       ]
//     }
//   ], [locations, programs]);

//   const columns: Column<typeof mockStudents[0]>[] = useMemo(() => [
//     {
//       key: 'studentName',
//       label: 'STUDENT',
//       render: (_, row) => (
//         <div>
//           <div className="font-semibold text-text">{row.studentName}</div>
//           <div className="text-xs text-text-muted mt-0.5">{row.gender}</div>
//         </div>
//       )
//     },
//     {
//       key: 'guardianName',
//       label: 'GUARDIAN',
//       render: (_, row) => (
//         <div>
//           <div className="text-text">{row.guardianName}</div>
//           <div className="text-xs text-text-muted mt-0.5">{row.guardianPhone}</div>
//         </div>
//       )
//     },
//     {
//       key: 'program',
//       label: 'PROGRAM',
//       render: (val) => <span className="font-semibold text-text">{String(val)}</span>
//     },
//     {
//       key: 'branch',
//       label: 'BRANCH / TERM',
//       render: (_, row) => (
//         <div>
//           <div className="text-text">{row.branch}</div>
//           <div className="text-xs text-text-muted mt-0.5">{row.term}</div>
//         </div>
//       )
//     },
//     { key: 'joinDate', label: 'JOIN DATE' },
//     {
//       key: 'total',
//       label: 'TOTAL',
//       render: (val) => <span className="font-bold text-text">SAR {Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
//     },
//     {
//       key: 'paid',
//       label: 'PAID',
//       render: (val) => <span className="font-bold text-success">SAR {Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
//     },
//     {
//       key: 'balance',
//       label: 'BALANCE',
//       render: (val) => <span className="font-bold text-danger">SAR {Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
//     },
//     {
//       key: 'status',
//       label: 'STATUS',
//       render: (val) => {
//         const s = String(val);
//         let colorClass = '';
//         if (s === 'Partial') colorClass = 'bg-warning/10 text-warning border-warning/20';
//         else if (s === 'Unpaid') colorClass = 'bg-danger/10 text-danger border-danger/20';
//         else if (s === 'Paid') colorClass = 'bg-success/10 text-success border-success/20';

//         return (
//           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
//             {s}
//           </span>
//         );
//       }
//     },
//     {
//       key: 'actions',
//       label: '',
//       render: (_, row) => {
//         if (row.status === 'Paid') {
//           return <div className="text-right"><span className="text-xs text-text-muted font-medium">Settled</span></div>;
//         }
//         return (
//           <div className="text-right">
//             <button className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
//               Record payment
//             </button>
//           </div>
//         );
//       }
//     }
//   ], []);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-text">Invoices</h1>
//           <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">
//             Search registrations across both branches, review invoice status and record preset payments without manually typing any fee or payment amount.
//           </p>
//         </div>
//         {/* <Link to="/super-admin/register-form" className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
//           <Plus className="w-4 h-4" />
//           Register Student
//         </Link> */}
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Registrations</p>
//           <p className="text-2xl font-bold text-text mt-2">{mockStudents.length}</p>
//           <p className="text-xs text-text-muted mt-1">Matching current filters</p>
//         </div>
//         <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Invoiced</p>
//           <p className="text-2xl font-bold text-text mt-2">SAR {totalInvoiced.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
//           <p className="text-xs text-text-muted mt-1">Total calculated charges</p>
//         </div>
//         <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Collected</p>
//           <p className="text-2xl font-bold text-text mt-2">SAR {totalCollected.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
//           <p className="text-xs text-text-muted mt-1">Recorded payments</p>
//         </div>
//         <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Outstanding</p>
//           <p className="text-2xl font-bold text-text mt-2">SAR {totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
//           <p className="text-xs text-text-muted mt-1">Remaining balance</p>
//         </div>
//       </div>

//       {/* Data Table */}
//       <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
//         <DataTable
//           columns={columns}
//           rows={mockStudents}
//           searchPlaceholder="Search student, guardian, phone or program"
//           searchKeys={['studentName', 'guardianName', 'guardianPhone', 'program']}
//           filters={filters}
//           pageSize={20}
//         />
//       </div>
//     </div>
//   );
// }


import { useMemo, useState } from 'react';
import { ChevronRight, SaudiRiyal } from 'lucide-react';
import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';
import { useDataStore } from '../../store/dataStore';
import { Modal } from '../../components/ui/Modal';
import { InvoiceDocument } from '../../components/ui/InvoiceDocument';

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface TermEntry {
  registrationId: string;
  invoiceId: string;
  termNo: number;
  joinDate: string;
  total: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  hasFlag: boolean;
}

interface InvoiceParticipantRow {
  id: string; // studentId
  studentName: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  program: string;
  branch: string;
  terms: TermEntry[];
  total: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  hasFlag: boolean;
}

const TERM_BADGE_STYLE: Record<TermEntry['status'], string> = {
  Paid: 'bg-success/10 text-success border-success/30',
  Partial: 'bg-warning/10 text-warning border-warning/30',
  Unpaid: 'bg-danger/10 text-danger border-danger/30',
};

export function Invoices() {
  const students = useDataStore((s) => s.students);
  const families = useDataStore((s) => s.families);
  const registrations = useDataStore((s) => s.registrations);
  const invoices = useDataStore((s) => s.invoices);
  const payments = useDataStore((s) => s.payments);
  const programs = useDataStore((s) => s.programs);
  const terms = useDataStore((s) => s.terms);
  const locations = useDataStore((s) => s.locations);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingInvoiceRegId, setViewingInvoiceRegId] = useState<string | null>(null);

  // Group registrations/invoices by student - one row per participant, with each of their terms
  // shown as a badge on that single row instead of the same student repeating 1-3 times.
  const rows = useMemo((): InvoiceParticipantRow[] => {
    const studentById = new Map(students.map((s) => [s.id, s]));
    const familyById = new Map(families.map((f) => [f.id, f]));
    const programById = new Map(programs.map((p) => [p.id, p]));
    const termById = new Map(terms.map((t) => [t.id, t]));
    const locationById = new Map(locations.map((l) => [l.id, l]));
    const invoiceByRegId = new Map(invoices.map((i) => [i.registrationId, i]));
    const paymentsByInvoiceId = new Map<string, typeof payments>();
    for (const p of payments) {
      const list = paymentsByInvoiceId.get(p.invoiceId) ?? [];
      list.push(p);
      paymentsByInvoiceId.set(p.invoiceId, list);
    }

    const byStudent = new Map<string, typeof registrations>();
    for (const reg of registrations) {
      const list = byStudent.get(reg.studentId) ?? [];
      list.push(reg);
      byStudent.set(reg.studentId, list);
    }

    const result: InvoiceParticipantRow[] = [];
    for (const [studentId, regs] of byStudent.entries()) {
      const student = studentById.get(studentId);
      const family = student ? familyById.get(student.familyId) : undefined;

      const termEntries: TermEntry[] = regs.map((reg) => {
        const term = termById.get(reg.termId);
        const invoice = invoiceByRegId.get(reg.id);
        const invoicePayments = invoice ? (paymentsByInvoiceId.get(invoice.id) ?? []) : [];
        const paidAmount = invoicePayments.reduce((sum, p) => sum + p.amount, 0);
        const total = invoice?.total ?? 0;
        const balance = total - paidAmount;
        const status: TermEntry['status'] = balance <= 0.01 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid';
        const hasFlag = invoicePayments.some((p) => !p.bankRef || !p.paidDate) || (status !== 'Paid' && invoicePayments.length === 0);
        return {
          registrationId: reg.id,
          invoiceId: invoice?.id ?? '',
          termNo: term?.termNo ?? 0,
          joinDate: formatDate(reg.joinDate),
          total, paid: paidAmount, balance, status, hasFlag,
        };
      }).sort((a, b) => a.termNo - b.termNo);

      const firstReg = regs[0];
      const firstTerm = termById.get(firstReg.termId);
      const location = firstTerm ? locationById.get(firstTerm.locationId) : undefined;
      const distinctPrograms = Array.from(new Set(regs.map((r) => programById.get(r.programId)?.name ?? 'Unknown')));

      const total = termEntries.reduce((s, t) => s + t.total, 0);
      const paid = termEntries.reduce((s, t) => s + t.paid, 0);
      const balance = total - paid;
      const status: InvoiceParticipantRow['status'] = balance <= 0.01 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';
      const hasFlag = termEntries.some((t) => t.hasFlag);

      result.push({
        id: studentId,
        studentName: student?.name ?? 'Unknown',
        gender: '',
        guardianName: family?.guardianName || '—',
        guardianPhone: family?.phonePrimary || '—',
        program: distinctPrograms.join(', '),
        branch: location?.name ?? 'Unknown',
        terms: termEntries,
        total, paid, balance, status, hasFlag,
      });
    }
    return result.sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [students, families, registrations, invoices, payments, programs, terms, locations]);

  const totalInvoiced = rows.reduce((sum, s) => sum + s.total, 0);
  const totalCollected = rows.reduce((sum, s) => sum + s.paid, 0);
  const totalOutstanding = rows.reduce((sum, s) => sum + s.balance, 0);

  const filters: FilterConfig[] = useMemo(() => [
    { key: 'branch', label: 'locations', options: locations.map((l) => ({ value: l.name, label: l.name })) },
    { key: 'program', label: 'programs', options: programs.map((p) => ({ value: p.name, label: p.name })) },
    {
      key: 'status', label: 'payment statuses',
      options: [
        { value: 'Partial', label: 'Partial' },
        { value: 'Unpaid', label: 'Unpaid' },
        { value: 'Paid', label: 'Paid' },
      ],
    },
  ], [locations, programs]);

  const columns: Column<InvoiceParticipantRow>[] = useMemo(() => [
    {
      key: 'studentName', label: 'STUDENT',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-text">{row.studentName}</div>
          <div className="text-xs text-text-muted mt-0.5">{row.gender}</div>
        </div>
      ),
    },
    {
      key: 'guardianName', label: 'GUARDIAN',
      render: (_, row) => (
        <div>
          <div className="text-text">{row.guardianName}</div>
          <div className="text-xs text-text-muted mt-0.5">{row.guardianPhone}</div>
        </div>
      ),
    },
    { key: 'program', label: 'PROGRAM', render: (val) => <span className="font-semibold text-text">{String(val)}</span> },
    { key: 'branch', label: 'BRANCH' },
    {
      key: 'terms', label: 'TERMS', sortable: false,
      render: (_, row) => (
        <div className="flex gap-1">
          {row.terms.map((t) => (
            <span
              key={t.registrationId}
              title={`Term ${t.termNo}: ${t.status} - SAR ${t.total.toFixed(2)}${t.hasFlag ? ' (flagged - missing payment info)' : ''}`}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TERM_BADGE_STYLE[t.status]} ${t.hasFlag ? 'ring-1 ring-warning' : ''}`}
            >
              T{t.termNo}{t.hasFlag ? '' : ''}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'total', label: 'TOTAL',
      render: (val) => <span className="font-bold text-text"><SaudiRiyal className="w-3.5 h-3.5 inline mr-1" />{Number(val).toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>,
    },
    {
      key: 'paid', label: 'PAID',
      render: (val) => <span className="font-bold text-success"><SaudiRiyal className="w-3.5 h-3.5 inline mr-1" />{Number(val).toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>,
    },
    {
      key: 'balance', label: 'BALANCE',
      render: (val) => <span className="font-bold text-danger"><SaudiRiyal className="w-3.5 h-3.5 inline mr-1" />{Number(val).toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>,
    },
    {
      key: 'status', label: 'STATUS',
      render: (val) => {
        const s = String(val);
        const colorClass = s === 'Partial' ? 'bg-warning/10 text-warning border-warning/20'
          : s === 'Unpaid' ? 'bg-danger/10 text-danger border-danger/20'
            : 'bg-success/10 text-success border-success/20';
        return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>{s}</span>;
      },
    },
    { key: 'actions', label: '', sortable: false, render: () => <div className="flex justify-end"><ChevronRight className="w-4 h-4 text-text-muted" /></div> },
  ], []);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Invoices</h1>
        <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">
          One row per participant across both branches - click a row to see their term-by-term
          breakdown. Review invoice status and record preset payments without manually typing any
          fee or payment amount.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Participants</p>
          <p className="text-2xl font-bold text-text mt-2">{rows.length}</p>
          <p className="text-xs text-text-muted mt-1">Matching current filters · {registrations.length} total registrations</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Invoiced</p>
          <p className="text-2xl font-bold text-text mt-2"><SaudiRiyal className="w-6 h-6 inline mr-1" />{totalInvoiced.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-text-muted mt-1">Total calculated charges</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Collected</p>
          <p className="text-2xl font-bold text-text mt-2"><SaudiRiyal className="w-6 h-6 inline mr-1" />{totalCollected.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-text-muted mt-1">Recorded payments</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Outstanding</p>
          <p className="text-2xl font-bold text-text mt-2"><SaudiRiyal className="w-6 h-6 inline mr-1" />{totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-text-muted mt-1">Remaining balance</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={(row) => setSelectedId(row.id)}
          searchPlaceholder="Search student, guardian, phone or program"
          searchKeys={['studentName', 'guardianName', 'guardianPhone', 'program']}
          filters={filters}
          pageSize={20}
        />
      </div>

      {selected && (
        <Modal isOpen onClose={() => setSelectedId(null)} title={selected.studentName} width="xl">
          <div className="space-y-4 py-1">
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <span>{selected.guardianName} · {selected.guardianPhone}</span>
              <span>{selected.branch}</span>
              <span>{selected.program}</span>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-muted border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="px-3 py-2 text-left">Term</th>
                    <th className="px-3 py-2 text-left">Join Date</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2 text-right">Paid</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selected.terms.map((t) => (
                    <tr key={t.registrationId}>
                      <td className="px-3 py-2.5 font-medium text-text">Term {t.termNo}</td>
                      <td className="px-3 py-2.5 text-text-muted">{t.joinDate}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-text"><SaudiRiyal className="w-4 h-4 inline mr-1" />{t.total.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-success"><SaudiRiyal className="w-4 h-4 inline mr-1" />{t.paid.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-danger"><SaudiRiyal className="w-4 h-4 inline mr-1" />{t.balance.toFixed(2)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${TERM_BADGE_STYLE[t.status]}`}>
                          {t.status}{t.hasFlag ? '' : ''}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => { setSelectedId(null); setViewingInvoiceRegId(t.registrationId); }}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            View Invoice
                          </button>
                          {t.status !== 'Paid' && <button className="text-xs font-semibold text-primary hover:underline">Record payment</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-muted/50 font-bold text-text">
                    <td className="px-3 py-2.5" colSpan={2}>Total across {selected.terms.length} term{selected.terms.length !== 1 ? 's' : ''}</td>
                    <td className="px-3 py-2.5 text-right"><SaudiRiyal className="w-4 h-4 inline mr-1" />{selected.total.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right text-success"><SaudiRiyal className="w-4 h-4 inline mr-1" />{selected.paid.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right text-danger"><SaudiRiyal className="w-4 h-4 inline mr-1" />{selected.balance.toFixed(2)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {viewingInvoiceRegId && (
        <InvoiceDocument registrationId={viewingInvoiceRegId} onClose={() => setViewingInvoiceRegId(null)} />
      )}
    </div>
  );
}
