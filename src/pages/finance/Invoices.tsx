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
//     { key: 'total', label: 'Total', render: (val) => <span className="font-semibold">{Number(val).toFixed(2)} SAR</span> },
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
//                     <span className="font-medium text-text">{selectedInvoice.baseAmount.toFixed(2)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between">
//                     <span className="text-text-muted">Kit Fee</span>
//                     <span className="font-medium text-text">{selectedInvoice.kitFee.toFixed(2)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between">
//                     <span className="text-text-muted">Registration Fee</span>
//                     <span className="font-medium text-text">{selectedInvoice.registrationFee.toFixed(2)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between text-danger">
//                     <span>Discount ({selectedInvoice.discountPct}%)</span>
//                     <span>-{selectedInvoice.discountAmount.toFixed(2)} SAR</span>
//                   </div>
//                   <div className="px-4 py-2.5 flex justify-between text-text-muted">
//                     <span>VAT</span>
//                     <span>{selectedInvoice.vatAmount.toFixed(2)} SAR</span>
//                   </div>
//                   <div className="px-4 py-3 flex justify-between bg-surface-muted/40 font-semibold">
//                     <span className="text-text">Total</span>
//                     <span className="text-text">{selectedInvoice.total.toFixed(2)} SAR</span>
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
//                             <span className="text-sm font-medium text-text">{p.amount.toFixed(2)} SAR</span>
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
//                       Paid: {row.totalPaid.toFixed(2)} / {selectedInvoice.total.toFixed(2)} SAR
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




import { useMemo } from 'react';
import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';
import { useDataStore } from '../../store/dataStore';

function formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function Invoices() {
    const students = useDataStore((s) => s.students);
    const families = useDataStore((s) => s.families);
    const registrations = useDataStore((s) => s.registrations);
    const invoices = useDataStore((s) => s.invoices);
    const payments = useDataStore((s) => s.payments);
    const programs = useDataStore((s) => s.programs);
    const terms = useDataStore((s) => s.terms);
    const locations = useDataStore((s) => s.locations);

    // Build one row per Registration, matching the exact shape this table already expects.
    const mockStudents = useMemo(() => {
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

        return registrations.map((reg) => {
            const student = studentById.get(reg.studentId);
            const family = student ? familyById.get(student.familyId) : undefined;
            const program = programById.get(reg.programId);
            const term = termById.get(reg.termId);
            const location = term ? locationById.get(term.locationId) : undefined;
            const invoice = invoiceByRegId.get(reg.id);
            const paidAmount = invoice
                ? (paymentsByInvoiceId.get(invoice.id) ?? []).reduce((sum, p) => sum + p.amount, 0)
                : 0;
            const total = invoice?.total ?? 0;
            const balance = total - paidAmount;
            const status = balance <= 0.01 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid';

            return {
                id: reg.id,
                studentName: student?.name ?? 'Unknown',
                // Gender isn't present anywhere in the source spreadsheets - left blank rather than guessed.
                gender: '',
                guardianName: family?.guardianName || '—',
                guardianPhone: family?.phonePrimary || '—',
                program: program?.name ?? 'Unknown',
                branch: location?.name ?? 'Unknown',
                term: term ? `${location?.name ?? ''} Term ${term.termNo} (${term.startDate})` : 'Unknown',
                joinDate: formatDate(reg.joinDate),
                total,
                paid: paidAmount,
                balance,
                status,
            };
        });
    }, [students, families, registrations, invoices, payments, programs, terms, locations]);

    // Compute metric totals
    const totalInvoiced = mockStudents.reduce((sum, s) => sum + s.total, 0);
    const totalCollected = mockStudents.reduce((sum, s) => sum + s.paid, 0);
    const totalOutstanding = mockStudents.reduce((sum, s) => sum + s.balance, 0);

    const filters: FilterConfig[] = useMemo(() => [
        {
            key: 'branch',
            label: 'locations',
            options: locations.map((l) => ({ value: l.name, label: l.name }))
        },
        {
            key: 'program',
            label: 'programs',
            options: programs.map((p) => ({ value: p.name, label: p.name }))
        },
        {
            key: 'status',
            label: 'payment statuses',
            options: [
                { value: 'Partial', label: 'Partial' },
                { value: 'Unpaid', label: 'Unpaid' },
                { value: 'Paid', label: 'Paid' }
            ]
        }
    ], [locations, programs]);

    const columns: Column<typeof mockStudents[0]>[] = useMemo(() => [
        {
            key: 'studentName',
            label: 'STUDENT',
            render: (_, row) => (
                <div>
                    <div className="font-semibold text-text">{row.studentName}</div>
                    <div className="text-xs text-text-muted mt-0.5">{row.gender}</div>
                </div>
            )
        },
        {
            key: 'guardianName',
            label: 'GUARDIAN',
            render: (_, row) => (
                <div>
                    <div className="text-text">{row.guardianName}</div>
                    <div className="text-xs text-text-muted mt-0.5">{row.guardianPhone}</div>
                </div>
            )
        },
        {
            key: 'program',
            label: 'PROGRAM',
            render: (val) => <span className="font-semibold text-text">{String(val)}</span>
        },
        {
            key: 'branch',
            label: 'BRANCH / TERM',
            render: (_, row) => (
                <div>
                    <div className="text-text">{row.branch}</div>
                    <div className="text-xs text-text-muted mt-0.5">{row.term}</div>
                </div>
            )
        },
        { key: 'joinDate', label: 'JOIN DATE' },
        {
            key: 'total',
            label: 'TOTAL',
            render: (val) => <span className="font-bold text-text">SAR {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'paid',
            label: 'PAID',
            render: (val) => <span className="font-bold text-success">SAR {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'balance',
            label: 'BALANCE',
            render: (val) => <span className="font-bold text-danger">SAR {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'status',
            label: 'STATUS',
            render: (val) => {
                const s = String(val);
                let colorClass = '';
                if (s === 'Partial') colorClass = 'bg-warning/10 text-warning border-warning/20';
                else if (s === 'Unpaid') colorClass = 'bg-danger/10 text-danger border-danger/20';
                else if (s === 'Paid') colorClass = 'bg-success/10 text-success border-success/20';

                return (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
                        {s}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => {
                if (row.status === 'Paid') {
                    return <div className="text-right"><span className="text-xs text-text-muted font-medium">Settled</span></div>;
                }
                return (
                    <div className="text-right">
                        <button className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                            Record payment
                        </button>
                    </div>
                );
            }
        }
    ], []);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text">Invoices List</h1>
                    <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">
                        Search registrations across both branches, review invoice status and record preset payments without manually typing any fee or payment amount.
                    </p>
                </div>
                {/* <Link to="/super-admin/register-form" className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    Register Student
                </Link> */}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Registrations</p>
                    <p className="text-2xl font-bold text-text mt-2">{mockStudents.length}</p>
                    <p className="text-xs text-text-muted mt-1">Matching current filters</p>
                </div>
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Invoiced</p>
                    <p className="text-2xl font-bold text-text mt-2">SAR {totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-text-muted mt-1">Total calculated charges</p>
                </div>
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Collected</p>
                    <p className="text-2xl font-bold text-text mt-2">SAR {totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-text-muted mt-1">Recorded payments</p>
                </div>
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Outstanding</p>
                    <p className="text-2xl font-bold text-text mt-2">SAR {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-text-muted mt-1">Remaining balance</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
                <DataTable
                    columns={columns}
                    rows={mockStudents}
                    searchPlaceholder="Search student, guardian, phone or program"
                    searchKeys={['studentName', 'guardianName', 'guardianPhone', 'program']}
                    filters={filters}
                    pageSize={20}
                />
            </div>
        </div>
    );
}
