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
