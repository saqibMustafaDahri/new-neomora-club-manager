import { Printer } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { Modal } from './Modal';

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const METHOD_LABEL: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    credit_card: 'Credit Card',
    cash: 'Cash',
};

interface InvoiceDocumentProps {
    registrationId: string;
    onClose: () => void;
}

/**
 * A single, shared invoice view used identically from Super Admin, Finance, and Parent -
 * every portal renders exactly the same document for the same transaction, since it reads
 * straight from the shared store rather than each portal keeping its own copy.
 */
export function InvoiceDocument({ registrationId, onClose }: InvoiceDocumentProps) {
    const organizations = useDataStore((s) => s.organizations);
    const students = useDataStore((s) => s.students);
    const families = useDataStore((s) => s.families);
    const registrations = useDataStore((s) => s.registrations);
    const invoices = useDataStore((s) => s.invoices);
    const payments = useDataStore((s) => s.payments);
    const programs = useDataStore((s) => s.programs);
    const terms = useDataStore((s) => s.terms);
    const locations = useDataStore((s) => s.locations);
    const cohorts = useDataStore((s) => s.cohorts);

    const registration = registrations.find((r) => r.id === registrationId);
    const invoice = invoices.find((i) => i.registrationId === registrationId);

    if (!registration || !invoice) {
        return (
            <Modal isOpen onClose={onClose} title="Invoice">
                <p className="text-sm text-text-muted py-8 text-center">This transaction couldn't be found.</p>
            </Modal>
        );
    }

    const student = students.find((s) => s.id === registration.studentId);
    const family = student ? families.find((f) => f.id === student.familyId) : undefined;
    const program = programs.find((p) => p.id === registration.programId);
    const term = terms.find((t) => t.id === registration.termId);
    const location = term ? locations.find((l) => l.id === term.locationId) : undefined;
    const cohort = cohorts.find((c) => c.id === registration.cohortId);
    const org = organizations[0];

    const invoicePayments = payments.filter((p) => p.invoiceId === invoice.id).sort((a, b) => a.paidDate.localeCompare(b.paidDate));
    const totalPaid = invoicePayments.reduce((s, p) => s + p.amount, 0);
    const balance = invoice.total - totalPaid;
    const status = balance <= 0.01 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Unpaid';
    const subtotal = invoice.baseAmount + invoice.kitFee + invoice.registrationFee - invoice.discountAmount;

    function handlePrint() {
        if (!registration || !invoice) return;
        const win = window.open('', '_blank', 'width=800,height=900');
        if (!win) return;

        const paymentRowsHtml = invoicePayments.length === 0
            ? `<tr><td colspan="4" style="padding:10px;color:#888;text-align:center;">No payments recorded against this invoice.</td></tr>`
            : invoicePayments.map((p) => `
        <tr>
          <td>${formatDate(p.paidDate)}</td>
          <td>${METHOD_LABEL[p.method] ?? p.method}</td>
          <td style="${p.bankRef ? '' : 'color:#b45309;'}">${p.bankRef ?? 'No reference on file'}</td>
          <td style="text-align:right;font-weight:600;">${p.amount.toFixed(2)}</td>
        </tr>`).join('');

        const statusColor = status === 'Paid' ? '#15803d' : status === 'Partial' ? '#b45309' : '#b91c1c';

        win.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            body { font-family: -apple-system, Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 700px; margin: 0 auto; }
            h1 { font-size: 20px; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
            th { background: #f5f5f4; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; border-bottom: 1px solid #e5e5e5; }
            td { padding: 8px 10px; border-bottom: 1px solid #eee; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1B4332; padding-bottom: 16px; margin-bottom: 20px; }
            .right { text-align: right; }
            .muted { color: #666; font-size: 12px; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .total-row td { font-weight: 700; font-size: 15px; background: #f5f5f4; border-top: 2px solid #1B4332; }
            .status { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${statusColor}; border: 1px solid ${statusColor}44; background: ${statusColor}11; }
            .balance { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid #ddd; }
            .balance-amount { font-size: 20px; font-weight: 700; color: ${balance <= 0.01 ? '#15803d' : '#b91c1c'}; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>${org?.name ?? 'Neomora Club Manager'}</h1>
              <p class="muted">${location?.name ?? ''}, Saudi Arabia</p>
            </div>
            <div class="right">
              <p style="font-weight:700;margin:0;">INVOICE</p>
              <p class="muted" style="font-family:monospace;">${invoice.id}</p>
              <p class="muted">Issued: ${formatDate(registration.joinDate)}</p>
            </div>
          </div>

          <div class="grid">
            <div>
              <p class="muted" style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px;">Bill To</p>
              <p style="font-weight:600;margin:2px 0;">${student?.name ?? 'Unknown'}</p>
              <p class="muted">DOB: ${student?.dob || 'Unknown'}</p>
              <p class="muted">${family?.guardianName || 'Guardian not on file'}</p>
              <p class="muted">${family?.phonePrimary || '—'}</p>
            </div>
            <div class="right">
              <p class="muted" style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px;">Programme</p>
              <p style="font-weight:600;margin:2px 0;">${program?.name ?? 'Unknown'}</p>
              <p class="muted">${cohort?.label ?? ''} · Term ${term?.termNo ?? '—'}</p>
              <p class="muted">${term ? `${formatDate(term.startDate)} – ${formatDate(term.endDate)}` : ''}</p>
            </div>
          </div>

          <table>
            <thead><tr><th>Description</th><th class="right">Amount (SAR)</th></tr></thead>
            <tbody>
              <tr><td>Tuition fee</td><td class="right">${invoice.baseAmount.toFixed(2)}</td></tr>
              ${invoice.kitFee > 0 ? `<tr><td>Kit fee</td><td class="right">${invoice.kitFee.toFixed(2)}</td></tr>` : ''}
              ${invoice.registrationFee > 0 ? `<tr><td>Registration fee</td><td class="right">${invoice.registrationFee.toFixed(2)}</td></tr>` : ''}
              ${invoice.discountAmount > 0 ? `<tr><td style="color:#15803d;">Discount (${invoice.discountPct}%)</td><td class="right" style="color:#15803d;">-${invoice.discountAmount.toFixed(2)}</td></tr>` : ''}
              <tr><td class="muted">Subtotal</td><td class="right muted">${subtotal.toFixed(2)}</td></tr>
              <tr><td>VAT</td><td class="right">${invoice.vatAmount.toFixed(2)}</td></tr>
            </tbody>
            <tfoot><tr class="total-row"><td>Total</td><td class="right">SAR ${invoice.total.toFixed(2)}</td></tr></tfoot>
          </table>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <p class="muted" style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px;margin:0;">Payment History</p>
            <span class="status">${status}</span>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Method</th><th>Reference</th><th class="right">Amount</th></tr></thead>
            <tbody>${paymentRowsHtml}</tbody>
          </table>

          <div class="balance">
            <span style="font-weight:600;">Balance Due</span>
            <span class="balance-amount">SAR ${Math.max(0, balance).toFixed(2)}</span>
          </div>

          <p class="muted" style="text-align:center;margin-top:30px;font-size:10px;">Generated from live records · ${org?.name ?? 'Neomora Club Manager'}</p>
        </body>
      </html>
    `);
        win.document.close();
        win.focus();
        win.print();
    }

    return (
        <Modal isOpen onClose={onClose} title={`Invoice ${invoice.id}`} width="xl">
            <div className="space-y-6">
                <div className="flex items-center justify-end -mt-2 mb-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                    </button>
                </div>

                <div className="flex items-start justify-between border-b border-border pb-5">
                    <div>
                        <h2 className="text-xl font-bold text-text">{org?.name ?? 'Neomora Club Manager'}</h2>
                        <p className="text-xs text-text-muted mt-1">{location?.name ?? ''}, Saudi Arabia</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-text">INVOICE</p>
                        <p className="text-xs text-text-muted font-mono mt-1">{invoice.id}</p>
                        <p className="text-xs text-text-muted mt-1">Issued: {formatDate(registration.joinDate)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Bill To</p>
                        <p className="text-sm font-semibold text-text">{student?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-text-muted mt-0.5">DOB: {student?.dob || 'Unknown'}</p>
                        <p className="text-xs text-text-muted">{family?.guardianName || 'Guardian not on file'}</p>
                        <p className="text-xs text-text-muted">{family?.phonePrimary || '—'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Programme</p>
                        <p className="text-sm font-semibold text-text">{program?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-text-muted mt-0.5">{cohort?.label ?? ''} · Term {term?.termNo ?? '—'}</p>
                        <p className="text-xs text-text-muted">{term ? `${formatDate(term.startDate)} – ${formatDate(term.endDate)}` : ''}</p>
                    </div>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-muted border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
                                <th className="px-3 py-2 text-left">Description</th>
                                <th className="px-3 py-2 text-right">Amount (SAR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr>
                                <td className="px-3 py-2.5 text-text">Tuition fee</td>
                                <td className="px-3 py-2.5 text-right text-text">{invoice.baseAmount.toFixed(2)}</td>
                            </tr>
                            {invoice.kitFee > 0 && (
                                <tr>
                                    <td className="px-3 py-2.5 text-text">Kit fee</td>
                                    <td className="px-3 py-2.5 text-right text-text">{invoice.kitFee.toFixed(2)}</td>
                                </tr>
                            )}
                            {invoice.registrationFee > 0 && (
                                <tr>
                                    <td className="px-3 py-2.5 text-text">Registration fee</td>
                                    <td className="px-3 py-2.5 text-right text-text">{invoice.registrationFee.toFixed(2)}</td>
                                </tr>
                            )}
                            {invoice.discountAmount > 0 && (
                                <tr>
                                    <td className="px-3 py-2.5 text-success">Discount ({invoice.discountPct}%)</td>
                                    <td className="px-3 py-2.5 text-right text-success">-{invoice.discountAmount.toFixed(2)}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="px-3 py-2.5 text-text-muted">Subtotal</td>
                                <td className="px-3 py-2.5 text-right text-text-muted">{subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="px-3 py-2.5 text-text">VAT</td>
                                <td className="px-3 py-2.5 text-right text-text">{invoice.vatAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-surface-muted/50 font-bold text-text border-t border-border">
                                <td className="px-3 py-3">Total</td>
                                <td className="px-3 py-3 text-right">SAR {invoice.total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Payment History</p>
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${status === 'Paid' ? 'bg-success/10 text-success border-success/30'
                                : status === 'Partial' ? 'bg-warning/10 text-warning border-warning/30'
                                    : 'bg-danger/10 text-danger border-danger/30'
                                }`}
                        >
                            {status}
                        </span>
                    </div>
                    {invoicePayments.length === 0 ? (
                        <p className="text-xs text-text-muted">No payments recorded against this invoice.</p>
                    ) : (
                        <div className="rounded-lg border border-border overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-surface-muted border-b border-border text-text-muted uppercase tracking-wider">
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-left">Method</th>
                                        <th className="px-3 py-2 text-left">Reference</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {invoicePayments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-3 py-2 text-text">{formatDate(p.paidDate)}</td>
                                            <td className="px-3 py-2 text-text">{METHOD_LABEL[p.method] ?? p.method}</td>
                                            <td className="px-3 py-2 text-text-muted">
                                                {p.bankRef ?? <span className="text-warning">No reference on file</span>}
                                            </td>
                                            <td className="px-3 py-2 text-right font-semibold text-text">{p.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                        <span className="text-sm font-semibold text-text">Balance Due</span>
                        <span className={`text-lg font-bold ${balance <= 0.01 ? 'text-success' : 'text-danger'}`}>
                            SAR {Math.max(0, balance).toFixed(2)}
                        </span>
                    </div>
                </div>

                <p className="text-[10px] text-text-muted text-center">
                    Generated from live records · {org?.name ?? 'Neomora Club Manager'}
                </p>
            </div>
        </Modal>
    );
}
