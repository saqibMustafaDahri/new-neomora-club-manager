import { useState, useMemo } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { useDataStore, PaymentActions } from '../../store/dataStore';
import { selectFamilyRegistrations } from '../../store/selectors';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' }
];

export function Payments() {
  const { invoices, payments, programs, terms } = useDataStore();
  const { success } = useToast();
  const familyRegistrations = selectFamilyRegistrations();

  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const familyRegIds = new Set(familyRegistrations.map(r => r.id));
  const familyInvoices = useMemo(() =>
    invoices.filter(i => familyRegIds.has(i.registrationId)),
    [invoices, familyRegistrations]
  );

  const invoiceRows = useMemo(() => {
    return familyInvoices.map(inv => {
      const reg = familyRegistrations.find(r => r.id === inv.registrationId);
      const program = reg ? programs.find(p => p.id === reg.programId) : null;
      const term = reg ? terms.find(t => t.id === reg.termId) : null;
      const invoicePayments = payments.filter(p => p.invoiceId === inv.id);
      const totalPaid = invoicePayments.reduce((s, p) => s + p.amount, 0);
      const balance = inv.total - totalPaid;

      let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
      if (totalPaid >= inv.total) status = 'Paid';
      else if (totalPaid > 0) status = 'Partial';

      const hasFlag = invoicePayments.some(p => !p.bankRef || !p.paidDate);

      return { ...inv, program, term, invoicePayments, totalPaid, balance, status, hasFlag };
    });
  }, [familyInvoices, familyRegistrations, programs, terms, payments]);

  function handlePaymentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!payingInvoiceId) return;
    const fd = new FormData(e.currentTarget);
    const amount = parseFloat(fd.get('amount') as string);
    const method = fd.get('method') as 'bank_transfer' | 'credit_card' | 'cash';
    const bankRef = (fd.get('bankRef') as string) || null;

    PaymentActions.add({
      id: `pay_${Date.now()}`,
      invoiceId: payingInvoiceId,
      amount,
      paidDate: new Date().toISOString().split('T')[0],
      bankRef,
      method,
      notes: null
    });

    success('Payment recorded successfully!');
    setPayingInvoiceId(null);
  }

  const payingInvoice = useMemo(() => invoiceRows.find(i => i.id === payingInvoiceId), [invoiceRows, payingInvoiceId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Payments</h1>
        <p className="text-text-muted mt-1">Your family's invoices and payment history.</p>
      </div>

      <div className="space-y-3">
        {invoiceRows.length === 0 && (
          <div className="bg-surface rounded-lg border border-border shadow-sm p-12 text-center text-sm text-text-muted">
            No invoices yet.
          </div>
        )}
        {invoiceRows.map(inv => (
          <div key={inv.id} className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
            {/* Invoice header row */}
            <button
              onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div>
                  <p className="text-sm font-semibold text-text truncate">
                    {inv.program?.name || 'Programme'} · Term {inv.term?.termNo}
                  </p>
                  <p className="text-xs text-text-muted font-mono">{inv.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {inv.hasFlag && <AlertTriangle className="w-4 h-4 text-warning" aria-label="Payment missing info" />}
                <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Partial' ? 'warning' : 'danger'}>
                  {inv.status}
                </Badge>
                <span className="text-sm font-bold text-text">{inv.total.toFixed(2)} SAR</span>
              </div>
            </button>

            {/* Expanded payment history */}
            {expandedId === inv.id && (
              <div className="border-t border-border px-5 py-4 space-y-4 bg-surface-muted/10">
                {/* Fee breakdown */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-text-muted">
                  <div className="flex justify-between"><span>Base amount</span><span>{inv.baseAmount.toFixed(2)} SAR</span></div>
                  <div className="flex justify-between"><span>Kit fee</span><span>{inv.kitFee.toFixed(2)} SAR</span></div>
                  <div className="flex justify-between"><span>Reg fee</span><span>{inv.registrationFee.toFixed(2)} SAR</span></div>
                  {inv.discountPct > 0 && <div className="flex justify-between text-success"><span>Discount ({inv.discountPct}%)</span><span>-{inv.discountAmount.toFixed(2)} SAR</span></div>}
                  <div className="flex justify-between"><span>VAT</span><span>{inv.vatAmount.toFixed(2)} SAR</span></div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Payment History</p>
                  {inv.invoicePayments.length === 0 ? (
                    <p className="text-xs text-text-muted">No payments recorded.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {inv.invoicePayments.map(p => (
                        <div key={p.id} className="flex justify-between text-xs text-text-muted">
                          <span>{p.paidDate} · {p.method.replace('_', ' ')}</span>
                          <span className={`font-medium ${!p.bankRef ? 'text-warning' : 'text-text'}`}>
                            {p.amount.toFixed(2)} SAR {!p.bankRef && '⚠ no ref'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-semibold text-text mt-2 pt-2 border-t border-border">
                    <span>Balance due</span>
                    <span className={inv.balance <= 0 ? 'text-success' : 'text-danger'}>
                      {Math.max(0, inv.balance).toFixed(2)} SAR
                    </span>
                  </div>
                </div>

                {inv.status !== 'Paid' && (
                  <button
                    onClick={() => setPayingInvoiceId(inv.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Make a Payment
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment modal */}
      <Modal isOpen={!!payingInvoiceId} onClose={() => setPayingInvoiceId(null)} title="Make a Payment">
        {payingInvoice && (
          <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4 py-2">
            <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm text-primary">
              Balance due: <strong>{Math.max(0, payingInvoice.balance).toFixed(2)} SAR</strong>
            </div>

            <FormField label="Amount (SAR)" required>
              {(id) => (
                <input
                  id={id} name="amount" type="number" step="0.01" min="0.01"
                  max={payingInvoice.balance}
                  required
                  defaultValue={Math.max(0, payingInvoice.balance).toFixed(2)}
                />
              )}
            </FormField>

            <FormField label="Payment Method" required>
              {(id) => (
                <select id={id} name="method" required>
                  {PAYMENT_METHODS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="Bank Reference (Optional)">
              {(id) => <input id={id} name="bankRef" type="text" placeholder="e.g. TRX-123456" />}
            </FormField>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
              <button type="button" onClick={() => setPayingInvoiceId(null)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
                Cancel
              </button>
              <button type="submit" form="payment-form" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                Record Payment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
