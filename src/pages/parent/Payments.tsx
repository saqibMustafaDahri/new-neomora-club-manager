// import { useState, useMemo } from 'react';
// import { AlertTriangle, Plus } from 'lucide-react';
// import { useDataStore, PaymentActions } from '../../store/dataStore';
// import { selectFamilyRegistrations } from '../../store/selectors';
// import { Badge } from '../../components/ui/Badge';
// import { Modal } from '../../components/ui/Modal';
// import { FormField } from '../../components/ui/FormField';
// import { useToast } from '../../components/ui/Toast';

// const PAYMENT_METHODS = [
//   { value: 'bank_transfer', label: 'Bank Transfer' },
//   { value: 'credit_card', label: 'Credit Card' },
//   { value: 'cash', label: 'Cash' }
// ];

// export function Payments() {
//   const { invoices, payments, programs, terms } = useDataStore();
//   const { success } = useToast();
//   const familyRegistrations = selectFamilyRegistrations();

//   const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   const familyRegIds = new Set(familyRegistrations.map(r => r.id));
//   const familyInvoices = useMemo(() =>
//     invoices.filter(i => familyRegIds.has(i.registrationId)),
//     [invoices, familyRegistrations]
//   );

//   const invoiceRows = useMemo(() => {
//     return familyInvoices.map(inv => {
//       const reg = familyRegistrations.find(r => r.id === inv.registrationId);
//       const program = reg ? programs.find(p => p.id === reg.programId) : null;
//       const term = reg ? terms.find(t => t.id === reg.termId) : null;
//       const invoicePayments = payments.filter(p => p.invoiceId === inv.id);
//       const totalPaid = invoicePayments.reduce((s, p) => s + p.amount, 0);
//       const balance = inv.total - totalPaid;

//       let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
//       if (totalPaid >= inv.total) status = 'Paid';
//       else if (totalPaid > 0) status = 'Partial';

//       const hasFlag = invoicePayments.some(p => !p.bankRef || !p.paidDate);

//       return { ...inv, program, term, invoicePayments, totalPaid, balance, status, hasFlag };
//     });
//   }, [familyInvoices, familyRegistrations, programs, terms, payments]);

//   function handlePaymentSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!payingInvoiceId) return;
//     const fd = new FormData(e.currentTarget);
//     const amount = parseFloat(fd.get('amount') as string);
//     const method = fd.get('method') as 'bank_transfer' | 'credit_card' | 'cash';
//     const bankRef = (fd.get('bankRef') as string) || null;

//     PaymentActions.add({
//       id: `pay_${Date.now()}`,
//       invoiceId: payingInvoiceId,
//       amount,
//       paidDate: new Date().toISOString().split('T')[0],
//       bankRef,
//       method,
//       notes: null
//     });

//     success('Payment recorded successfully!');
//     setPayingInvoiceId(null);
//   }

//   const payingInvoice = useMemo(() => invoiceRows.find(i => i.id === payingInvoiceId), [invoiceRows, payingInvoiceId]);

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto">
//       <div className=''>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Payments</h1>
//         <p className="text-text-muted mt-1">Your family's invoices and payment history.</p>
//       </div>

//       <div className="space-y-3">
//         {invoiceRows.length === 0 && (
//           <div className="bg-surface rounded-lg border border-border shadow-sm p-12 text-center text-sm text-text-muted">
//             No invoices yet.
//           </div>
//         )}
//         {invoiceRows.map(inv => (
//           <div key={inv.id} className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
//             {/* Invoice header row */}
//             <button
//               onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
//               className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-muted/20 transition-colors"
//             >
//               <div className="flex items-center gap-3 min-w-0">
//                 <div>
//                   <p className="text-sm font-semibold text-text truncate">
//                     {inv.program?.name || 'Programme'} · Term {inv.term?.termNo}
//                   </p>
//                   <p className="text-xs text-text-muted font-mono">{inv.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 shrink-0">
//                 {inv.hasFlag && <AlertTriangle className="w-4 h-4 text-warning" aria-label="Payment missing info" />}
//                 <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Partial' ? 'warning' : 'danger'}>
//                   {inv.status}
//                 </Badge>
//                 <span className="text-sm font-bold text-text">{inv.total.toFixed(0)} SAR</span>
//               </div>
//             </button>

//             {/* Expanded payment history */}
//             {expandedId === inv.id && (
//               <div className="border-t border-border px-5 py-4 space-y-4 bg-surface-muted/10">
//                 {/* Fee breakdown */}
//                 <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-text-muted">
//                   <div className="flex justify-between"><span>Base amount</span><span>{inv.baseAmount.toFixed(0)} SAR</span></div>
//                   <div className="flex justify-between"><span>Kit fee</span><span>{inv.kitFee.toFixed(0)} SAR</span></div>
//                   <div className="flex justify-between"><span>Reg fee</span><span>{inv.registrationFee.toFixed(0)} SAR</span></div>
//                   {inv.discountPct > 0 && <div className="flex justify-between text-success"><span>Discount ({inv.discountPct}%)</span><span>-{inv.discountAmount.toFixed(0)} SAR</span></div>}
//                   <div className="flex justify-between"><span>VAT</span><span>{inv.vatAmount.toFixed(0)} SAR</span></div>
//                 </div>

//                 <div className="border-t border-border pt-3">
//                   <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Payment History</p>
//                   {inv.invoicePayments.length === 0 ? (
//                     <p className="text-xs text-text-muted">No payments recorded.</p>
//                   ) : (
//                     <div className="space-y-1.5">
//                       {inv.invoicePayments.map(p => (
//                         <div key={p.id} className="flex justify-between text-xs text-text-muted">
//                           <span>{p.paidDate} · {p.method.replace('_', ' ')}</span>
//                           <span className={`font-medium ${!p.bankRef ? 'text-warning' : 'text-text'}`}>
//                             {p.amount.toFixed(0)} SAR {!p.bankRef && '⚠ no ref'}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <div className="flex justify-between text-xs font-semibold text-text mt-2 pt-2 border-t border-border">
//                     <span>Balance due</span>
//                     <span className={inv.balance <= 0 ? 'text-success' : 'text-danger'}>
//                       {Math.max(0, inv.balance).toFixed(0)} SAR
//                     </span>
//                   </div>
//                 </div>

//                 {inv.status !== 'Paid' && (
//                   <button
//                     onClick={() => setPayingInvoiceId(inv.id)}
//                     className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
//                   >
//                     <Plus className="w-3.5 h-3.5" />
//                     Make a Payment
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Payment modal */}
//       <Modal isOpen={!!payingInvoiceId} onClose={() => setPayingInvoiceId(null)} title="Make a Payment">
//         {payingInvoice && (
//           <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4 py-2">
//             <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm text-primary">
//               Balance due: <strong>{Math.max(0, payingInvoice.balance).toFixed(0)} SAR</strong>
//             </div>

//             <FormField label="Amount (SAR)" required>
//               {(id) => (
//                 <input
//                   id={id} name="amount" type="number" step="0.01" min="0.01"
//                   max={payingInvoice.balance}
//                   required
//                   defaultValue={Math.max(0, payingInvoice.balance).toFixed(0)}
//                 />
//               )}
//             </FormField>

//             <FormField label="Payment Method" required>
//               {(id) => (
//                 <select id={id} name="method" required>
//                   {PAYMENT_METHODS.map(m => (
//                     <option key={m.value} value={m.value}>{m.label}</option>
//                   ))}
//                 </select>
//               )}
//             </FormField>

//             <FormField label="Bank Reference (Optional)">
//               {(id) => <input id={id} name="bankRef" type="text" placeholder="e.g. TRX-123456" />}
//             </FormField>

//             <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
//               <button type="button" onClick={() => setPayingInvoiceId(null)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" form="payment-form" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
//                 Record Payment
//               </button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// }




// import { useState, useMemo } from 'react';
// import { AlertTriangle, Plus, CreditCard, Lock, CheckCircle2, Receipt } from 'lucide-react';
// import { useDataStore, PaymentActions } from '../../store/dataStore';
// import { selectFamilyRegistrations } from '../../store/selectors';
// import { Badge } from '../../components/ui/Badge';
// import { Modal } from '../../components/ui/Modal';
// import { FormField } from '../../components/ui/FormField';
// import { useToast } from '../../components/ui/Toast';

// type PaymentStep = 'form' | 'processing' | 'success';

// function formatCardNumber(value: string): string {
//   const digits = value.replace(/\D/g, '').slice(0, 16);
//   return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
// }

// function formatExpiry(value: string): string {
//   const digits = value.replace(/\D/g, '').slice(0, 4);
//   if (digits.length <= 2) return digits;
//   return `${digits.slice(0, 2)}/${digits.slice(2)}`;
// }

// export function Payments() {
//   const { invoices, payments, programs, terms } = useDataStore();
//   const { success } = useToast();
//   const familyRegistrations = selectFamilyRegistrations();

//   const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [step, setStep] = useState<PaymentStep>('form');
//   const [amount, setAmount] = useState('');
//   const [cardNumber, setCardNumber] = useState('');
//   const [cardName, setCardName] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [receiptRef, setReceiptRef] = useState('');

//   const familyRegIds = new Set(familyRegistrations.map(r => r.id));
//   const familyInvoices = useMemo(() =>
//     invoices.filter(i => familyRegIds.has(i.registrationId)),
//     [invoices, familyRegistrations]
//   );

//   const invoiceRows = useMemo(() => {
//     return familyInvoices.map(inv => {
//       const reg = familyRegistrations.find(r => r.id === inv.registrationId);
//       const program = reg ? programs.find(p => p.id === reg.programId) : null;
//       const term = reg ? terms.find(t => t.id === reg.termId) : null;
//       const invoicePayments = payments.filter(p => p.invoiceId === inv.id);
//       const totalPaid = invoicePayments.reduce((s, p) => s + p.amount, 0);
//       const balance = inv.total - totalPaid;

//       let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
//       if (totalPaid >= inv.total) status = 'Paid';
//       else if (totalPaid > 0) status = 'Partial';

//       const hasFlag = invoicePayments.some(p => !p.bankRef || !p.paidDate);

//       return { ...inv, program, term, invoicePayments, totalPaid, balance, status, hasFlag };
//     });
//   }, [familyInvoices, familyRegistrations, programs, terms, payments]);

//   const payingInvoice = useMemo(() => invoiceRows.find(i => i.id === payingInvoiceId), [invoiceRows, payingInvoiceId]);

//   function openPaymentFlow(invoiceId: string, defaultAmount: number) {
//     setPayingInvoiceId(invoiceId);
//     setAmount(defaultAmount.toFixed(0));
//     setCardNumber('');
//     setCardName('');
//     setExpiry('');
//     setCvv('');
//     setStep('form');
//   }

//   function closeModal() {
//     setPayingInvoiceId(null);
//     setStep('form');
//   }

//   function handleCardSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!payingInvoiceId) return;
//     setStep('processing');

//     // Simulated processing delay - this is a UI-only mock, no real card processor is involved
//     setTimeout(() => {
//       const ref = `PAY-${Date.now().toString().slice(-8)}`;
//       setReceiptRef(ref);
//       PaymentActions.add({
//         id: `pay_${Date.now()}`,
//         invoiceId: payingInvoiceId,
//         amount: parseFloat(amount),
//         paidDate: new Date().toISOString().split('T')[0],
//         bankRef: null,
//         method: 'credit_card',
//         notes: `Online card payment - ref ${ref}`,
//       });
//       setStep('success');
//     }, 1100);
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Payments</h1>
//         <p className="text-text-muted mt-1">Your family's invoices and payment history.</p>
//       </div>

//       <div className="space-y-3">
//         {invoiceRows.length === 0 && (
//           <div className="bg-surface rounded-lg border border-border shadow-sm p-12 text-center text-sm text-text-muted">
//             No invoices yet.
//           </div>
//         )}
//         {invoiceRows.map(inv => (
//           <div key={inv.id} className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
//             <button
//               onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
//               className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-muted/20 transition-colors"
//             >
//               <div className="flex items-center gap-3 min-w-0">
//                 <div>
//                   <p className="text-sm font-semibold text-text truncate">
//                     {inv.program?.name || 'Programme'} · Term {inv.term?.termNo}
//                   </p>
//                   <p className="text-xs text-text-muted font-mono">{inv.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 shrink-0">
//                 {inv.hasFlag && <AlertTriangle className="w-4 h-4 text-warning" aria-label="Payment missing info" />}
//                 <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Partial' ? 'warning' : 'danger'}>
//                   {inv.status}
//                 </Badge>
//                 <span className="text-sm font-bold text-text">{inv.total.toFixed(0)} SAR</span>
//               </div>
//             </button>

//             {expandedId === inv.id && (
//               <div className="border-t border-border px-5 py-4 space-y-4 bg-surface-muted/10">
//                 <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-text-muted">
//                   <div className="flex justify-between"><span>Base amount</span><span>{inv.baseAmount.toFixed(0)} SAR</span></div>
//                   <div className="flex justify-between"><span>Kit fee</span><span>{inv.kitFee.toFixed(0)} SAR</span></div>
//                   <div className="flex justify-between"><span>Reg fee</span><span>{inv.registrationFee.toFixed(0)} SAR</span></div>
//                   {inv.discountPct > 0 && <div className="flex justify-between text-success"><span>Discount ({inv.discountPct}%)</span><span>-{inv.discountAmount.toFixed(0)} SAR</span></div>}
//                   <div className="flex justify-between"><span>VAT</span><span>{inv.vatAmount.toFixed(0)} SAR</span></div>
//                 </div>

//                 <div className="border-t border-border pt-3">
//                   <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Payment History</p>
//                   {inv.invoicePayments.length === 0 ? (
//                     <p className="text-xs text-text-muted">No payments recorded.</p>
//                   ) : (
//                     <div className="space-y-1.5">
//                       {inv.invoicePayments.map(p => (
//                         <div key={p.id} className="flex justify-between text-xs text-text-muted">
//                           <span>{p.paidDate} · {p.method.replace('_', ' ')}</span>
//                           <span className={`font-medium ${!p.bankRef ? 'text-warning' : 'text-text'}`}>
//                             {p.amount.toFixed(0)} SAR {!p.bankRef && '⚠ no ref'}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <div className="flex justify-between text-xs font-semibold text-text mt-2 pt-2 border-t border-border">
//                     <span>Balance due</span>
//                     <span className={inv.balance <= 0 ? 'text-success' : 'text-danger'}>
//                       {Math.max(0, inv.balance).toFixed(0)} SAR
//                     </span>
//                   </div>
//                 </div>

//                 {inv.status !== 'Paid' && (
//                   <button
//                     onClick={() => openPaymentFlow(inv.id, Math.max(0, inv.balance))}
//                     className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
//                   >
//                     <Plus className="w-3.5 h-3.5" />
//                     Make a Payment
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Online card payment flow */}
//       <Modal
//         isOpen={!!payingInvoiceId}
//         onClose={step === 'processing' ? () => {} : closeModal}
//         title={step === 'success' ? 'Payment Successful' : 'Make a Payment'}
//       >
//         {payingInvoice && step === 'form' && (
//           <form onSubmit={handleCardSubmit} className="space-y-4 py-2">
//             <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm text-primary">
//               Balance due: <strong>{Math.max(0, payingInvoice.balance).toFixed(0)} SAR</strong>
//             </div>

//             <FormField label="Amount (SAR)" required>
//               {(id) => (
//                 <input
//                   id={id} type="number" step="0.01" min="0.01"
//                   max={payingInvoice.balance}
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   required
//                 />
//               )}
//             </FormField>

//             <div className="border-t border-border pt-4">
//               <div className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
//                 <CreditCard className="w-4 h-4 text-text-muted" />
//                 Card Details
//               </div>

//               <FormField label="Cardholder Name" required>
//                 {(id) => (
//                   <input id={id} type="text" placeholder="As shown on card" value={cardName}
//                     onChange={(e) => setCardName(e.target.value)} required />
//                 )}
//               </FormField>

//               <FormField label="Card Number" required>
//                 {(id) => (
//                   <input id={id} type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
//                     value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
//                     maxLength={19} required />
//                 )}
//               </FormField>

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField label="Expiry" required>
//                   {(id) => (
//                     <input id={id} type="text" placeholder="MM/YY" value={expiry}
//                       onChange={(e) => setExpiry(formatExpiry(e.target.value))} maxLength={5} required />
//                   )}
//                 </FormField>
//                 <FormField label="CVV" required>
//                   {(id) => (
//                     <input id={id} type="password" inputMode="numeric" placeholder="123" value={cvv}
//                       onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} required />
//                   )}
//                 </FormField>
//               </div>

//               <p className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
//                 <Lock className="w-3 h-3" />
//                 This is a UI demo only - no real card details are transmitted or stored.
//               </p>
//             </div>

//             <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
//               <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
//                 Pay {amount ? `${parseFloat(amount).toFixed(0)} SAR` : ''}
//               </button>
//             </div>
//           </form>
//         )}

//         {step === 'processing' && (
//           <div className="py-12 flex flex-col items-center justify-center gap-4">
//             <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
//             <p className="text-sm text-text-muted">Processing payment...</p>
//           </div>
//         )}

//         {step === 'success' && payingInvoice && (
//           <div className="py-4 space-y-5">
//             <div className="flex flex-col items-center gap-3 text-center">
//               <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
//                 <CheckCircle2 className="w-8 h-8 text-success" />
//               </div>
//               <div>
//                 <p className="text-lg font-bold text-text">Payment Successful</p>
//                 <p className="text-sm text-text-muted mt-0.5">Your payment has been recorded.</p>
//               </div>
//             </div>

//             <div className="bg-surface-muted/20 border border-border rounded-lg overflow-hidden">
//               <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-muted/30">
//                 <Receipt className="w-4 h-4 text-text-muted" />
//                 <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Receipt</span>
//               </div>
//               <div className="divide-y divide-border text-sm">
//                 <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Reference</span><span className="font-mono text-text">{receiptRef}</span></div>
//                 <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Programme</span><span className="text-text">{payingInvoice.program?.name} · Term {payingInvoice.term?.termNo}</span></div>
//                 <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Card</span><span className="text-text">•••• {cardNumber.replace(/\s/g, '').slice(-4)}</span></div>
//                 <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Date</span><span className="text-text">{new Date().toISOString().split('T')[0]}</span></div>
//                 <div className="px-4 py-3 flex justify-between bg-surface-muted/20 font-bold"><span className="text-text">Amount Paid</span><span className="text-success">{parseFloat(amount || '0').toFixed(0)} SAR</span></div>
//               </div>
//             </div>

//             <button
//               onClick={() => { closeModal(); success('Payment recorded!'); }}
//               className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
//             >
//               Done
//             </button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }







// import { useState, useMemo } from 'react';
// import { AlertTriangle, Plus } from 'lucide-react';
// import { useDataStore, PaymentActions } from '../../store/dataStore';
// import { selectFamilyRegistrations } from '../../store/selectors';
// import { Badge } from '../../components/ui/Badge';
// import { Modal } from '../../components/ui/Modal';
// import { FormField } from '../../components/ui/FormField';
// import { useToast } from '../../components/ui/Toast';

// const PAYMENT_METHODS = [
//   { value: 'bank_transfer', label: 'Bank Transfer' },
//   { value: 'credit_card', label: 'Credit Card' },
//   { value: 'cash', label: 'Cash' }
// ];

// export function Payments() {
//   const { invoices, payments, programs, terms } = useDataStore();
//   const { success } = useToast();
//   const familyRegistrations = selectFamilyRegistrations();

//   const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   const familyRegIds = new Set(familyRegistrations.map(r => r.id));
//   const familyInvoices = useMemo(() =>
//     invoices.filter(i => familyRegIds.has(i.registrationId)),
//     [invoices, familyRegistrations]
//   );

//   const invoiceRows = useMemo(() => {
//     return familyInvoices.map(inv => {
//       const reg = familyRegistrations.find(r => r.id === inv.registrationId);
//       const program = reg ? programs.find(p => p.id === reg.programId) : null;
//       const term = reg ? terms.find(t => t.id === reg.termId) : null;
//       const invoicePayments = payments.filter(p => p.invoiceId === inv.id);
//       const totalPaid = invoicePayments.reduce((s, p) => s + p.amount, 0);
//       const balance = inv.total - totalPaid;

//       let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
//       if (totalPaid >= inv.total) status = 'Paid';
//       else if (totalPaid > 0) status = 'Partial';

//       const hasFlag = invoicePayments.some(p => !p.bankRef || !p.paidDate);

//       return { ...inv, program, term, invoicePayments, totalPaid, balance, status, hasFlag };
//     });
//   }, [familyInvoices, familyRegistrations, programs, terms, payments]);

//   function handlePaymentSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!payingInvoiceId) return;
//     const fd = new FormData(e.currentTarget);
//     const amount = parseFloat(fd.get('amount') as string);
//     const method = fd.get('method') as 'bank_transfer' | 'credit_card' | 'cash';
//     const bankRef = (fd.get('bankRef') as string) || null;

//     PaymentActions.add({
//       id: `pay_${Date.now()}`,
//       invoiceId: payingInvoiceId,
//       amount,
//       paidDate: new Date().toISOString().split('T')[0],
//       bankRef,
//       method,
//       notes: null
//     });

//     success('Payment recorded successfully!');
//     setPayingInvoiceId(null);
//   }

//   const payingInvoice = useMemo(() => invoiceRows.find(i => i.id === payingInvoiceId), [invoiceRows, payingInvoiceId]);

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto">
//       <div className=''>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Payments</h1>
//         <p className="text-text-muted mt-1">Your family's invoices and payment history.</p>
//       </div>

//       <div className="space-y-3">
//         {invoiceRows.length === 0 && (
//           <div className="bg-surface rounded-lg border border-border shadow-sm p-12 text-center text-sm text-text-muted">
//             No invoices yet.
//           </div>
//         )}
//         {invoiceRows.map(inv => (
//           <div key={inv.id} className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
//             {/* Invoice header row */}
//             <button
//               onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
//               className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-muted/20 transition-colors"
//             >
//               <div className="flex items-center gap-3 min-w-0">
//                 <div>
//                   <p className="text-sm font-semibold text-text truncate">
//                     {inv.program?.name || 'Programme'} · Term {inv.term?.termNo}
//                   </p>
//                   <p className="text-xs text-text-muted font-mono">{inv.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 shrink-0">
//                 {inv.hasFlag && <AlertTriangle className="w-4 h-4 text-warning" aria-label="Payment missing info" />}
//                 <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Partial' ? 'warning' : 'danger'}>
//                   {inv.status}
//                 </Badge>
//                 <span className="text-sm font-bold text-text">{inv.total.toFixed(2)} SAR</span>
//               </div>
//             </button>

//             {/* Expanded payment history */}
//             {expandedId === inv.id && (
//               <div className="border-t border-border px-5 py-4 space-y-4 bg-surface-muted/10">
//                 {/* Fee breakdown */}
//                 <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-text-muted">
//                   <div className="flex justify-between"><span>Base amount</span><span>{inv.baseAmount.toFixed(2)} SAR</span></div>
//                   <div className="flex justify-between"><span>Kit fee</span><span>{inv.kitFee.toFixed(2)} SAR</span></div>
//                   <div className="flex justify-between"><span>Reg fee</span><span>{inv.registrationFee.toFixed(2)} SAR</span></div>
//                   {inv.discountPct > 0 && <div className="flex justify-between text-success"><span>Discount ({inv.discountPct}%)</span><span>-{inv.discountAmount.toFixed(2)} SAR</span></div>}
//                   <div className="flex justify-between"><span>VAT</span><span>{inv.vatAmount.toFixed(2)} SAR</span></div>
//                 </div>

//                 <div className="border-t border-border pt-3">
//                   <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Payment History</p>
//                   {inv.invoicePayments.length === 0 ? (
//                     <p className="text-xs text-text-muted">No payments recorded.</p>
//                   ) : (
//                     <div className="space-y-1.5">
//                       {inv.invoicePayments.map(p => (
//                         <div key={p.id} className="flex justify-between text-xs text-text-muted">
//                           <span>{p.paidDate} · {p.method.replace('_', ' ')}</span>
//                           <span className={`font-medium ${!p.bankRef ? 'text-warning' : 'text-text'}`}>
//                             {p.amount.toFixed(2)} SAR {!p.bankRef && '⚠ no ref'}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <div className="flex justify-between text-xs font-semibold text-text mt-2 pt-2 border-t border-border">
//                     <span>Balance due</span>
//                     <span className={inv.balance <= 0 ? 'text-success' : 'text-danger'}>
//                       {Math.max(0, inv.balance).toFixed(2)} SAR
//                     </span>
//                   </div>
//                 </div>

//                 {inv.status !== 'Paid' && (
//                   <button
//                     onClick={() => setPayingInvoiceId(inv.id)}
//                     className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
//                   >
//                     <Plus className="w-3.5 h-3.5" />
//                     Make a Payment
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Payment modal */}
//       <Modal isOpen={!!payingInvoiceId} onClose={() => setPayingInvoiceId(null)} title="Make a Payment">
//         {payingInvoice && (
//           <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4 py-2">
//             <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm text-primary">
//               Balance due: <strong>{Math.max(0, payingInvoice.balance).toFixed(2)} SAR</strong>
//             </div>

//             <FormField label="Amount (SAR)" required>
//               {(id) => (
//                 <input
//                   id={id} name="amount" type="number" step="0.01" min="0.01"
//                   max={payingInvoice.balance}
//                   required
//                   defaultValue={Math.max(0, payingInvoice.balance).toFixed(2)}
//                 />
//               )}
//             </FormField>

//             <FormField label="Payment Method" required>
//               {(id) => (
//                 <select id={id} name="method" required>
//                   {PAYMENT_METHODS.map(m => (
//                     <option key={m.value} value={m.value}>{m.label}</option>
//                   ))}
//                 </select>
//               )}
//             </FormField>

//             <FormField label="Bank Reference (Optional)">
//               {(id) => <input id={id} name="bankRef" type="text" placeholder="e.g. TRX-123456" />}
//             </FormField>

//             <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
//               <button type="button" onClick={() => setPayingInvoiceId(null)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" form="payment-form" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
//                 Record Payment
//               </button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// }




import { useState, useMemo } from 'react';
import { AlertTriangle, Plus, CreditCard, Lock, CheckCircle2, Receipt } from 'lucide-react';
import { useDataStore, PaymentActions } from '../../store/dataStore';
import { selectFamilyRegistrations, selectFamilyStudents, filterRegistrationsBySelectedSeason } from '../../store/selectors';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InvoiceDocument } from '../../components/ui/InvoiceDocument';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';

type PaymentStep = 'form' | 'processing' | 'success';

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function Payments() {
  const { invoices, payments, programs, terms, selectedSeasonId, seasons } = useDataStore();
  const { success } = useToast();
  const familyRegistrations = filterRegistrationsBySelectedSeason(selectFamilyRegistrations());
  const familyStudents = selectFamilyStudents();
  const currentSeasonName = seasons.find((s) => s.id === selectedSeasonId)?.name;

  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [viewingInvoiceRegId, setViewingInvoiceRegId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [step, setStep] = useState<PaymentStep>('form');
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [receiptRef, setReceiptRef] = useState('');

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

      return { ...inv, studentId: reg?.studentId ?? '', program, term, invoicePayments, totalPaid, balance, status, hasFlag };
    });
  }, [familyInvoices, familyRegistrations, programs, terms, payments]);

  // Group by child - each of this family's students gets one card, with their term(s) listed
  // inside it, instead of every term-invoice appearing as an unrelated flat row.
  const groupedByStudent = useMemo(() => {
    const groups = familyStudents.map(student => {
      const rows = invoiceRows
        .filter(r => r.studentId === student.id)
        .sort((a, b) => (a.term?.termNo ?? 0) - (b.term?.termNo ?? 0));
      const total = rows.reduce((s, r) => s + r.total, 0);
      const paid = rows.reduce((s, r) => s + r.totalPaid, 0);
      const balance = total - paid;
      let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
      if (rows.length > 0) {
        if (paid >= total - 0.01) status = 'Paid';
        else if (paid > 0) status = 'Partial';
      }
      return { student, rows, total, paid, balance, status };
    }).filter(g => g.rows.length > 0);
    return groups;
  }, [familyStudents, invoiceRows]);

  const payingInvoice = useMemo(() => invoiceRows.find(i => i.id === payingInvoiceId), [invoiceRows, payingInvoiceId]);

  function openPaymentFlow(invoiceId: string, defaultAmount: number) {
    setPayingInvoiceId(invoiceId);
    setAmount(defaultAmount.toFixed(2));
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setStep('form');
  }

  function closeModal() {
    setPayingInvoiceId(null);
    setStep('form');
  }

  function handleCardSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!payingInvoiceId) return;
    setStep('processing');

    // Simulated processing delay - this is a UI-only mock, no real card processor is involved
    setTimeout(() => {
      const ref = `PAY-${Date.now().toString().slice(-8)}`;
      setReceiptRef(ref);
      PaymentActions.add({
        id: `pay_${Date.now()}`,
        invoiceId: payingInvoiceId,
        amount: parseFloat(amount),
        paidDate: new Date().toISOString().split('T')[0],
        bankRef: null,
        method: 'credit_card',
        notes: `Online card payment - ref ${ref}`,
      });
      setStep('success');
    }, 1100);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Payments</h1>
        <p className="text-text-muted mt-1">Your family's invoices and payment history.</p>
        <p className="text-xs text-text-muted mt-1">
          {selectedSeasonId === 'all' ? 'Showing all seasons' : `Showing ${currentSeasonName ?? 'the selected season'}`} - change this from the season selector at the top.
        </p>
      </div>

      <div className="space-y-4">
        {groupedByStudent.length === 0 && (
          <div className="bg-surface rounded-lg border border-border shadow-sm p-12 text-center text-sm text-text-muted">
            No invoices yet.
          </div>
        )}
        {groupedByStudent.map(group => (
          <div key={group.student.id} className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between gap-4 bg-surface-muted/20 border-b border-border">
              <div>
                <p className="text-sm font-semibold text-text">{group.student.name}</p>
                <p className="text-xs text-text-muted">DOB: {group.student.dob || 'Unknown'}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex gap-1">
                  {group.rows.map(r => (
                    <span
                      key={r.id}
                      title={`Term ${r.term?.termNo}: ${r.status}`}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${r.status === 'Paid' ? 'bg-success/10 text-success border-success/30'
                          : r.status === 'Partial' ? 'bg-warning/10 text-warning border-warning/30'
                            : 'bg-danger/10 text-danger border-danger/30'
                        }`}
                    >
                      T{r.term?.termNo}
                    </span>
                  ))}
                </div>
                <Badge variant={group.status === 'Paid' ? 'success' : group.status === 'Partial' ? 'warning' : 'danger'}>
                  {group.status}
                </Badge>
                <span className="text-sm font-bold text-text">{group.total.toFixed(2)} SAR</span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {group.rows.map(inv => (
                <div key={inv.id}>
                  <button
                    onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                    className="w-full px-5 py-3 flex items-center justify-between gap-4 text-left hover:bg-surface-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div>
                        <p className="text-sm font-medium text-text truncate">
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

                  {expandedId === inv.id && (
                    <div className="border-t border-border px-5 py-4 space-y-4 bg-surface-muted/10">
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

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewingInvoiceRegId(inv.registrationId)}
                          className="flex items-center gap-2 px-4 py-2 bg-surface-muted border border-border text-text rounded-md text-sm font-medium hover:bg-border/40 transition-colors"
                        >
                          View Invoice
                        </button>
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => openPaymentFlow(inv.id, Math.max(0, inv.balance))}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Make a Payment
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Online card payment flow */}
      <Modal
        isOpen={!!payingInvoiceId}
        onClose={step === 'processing' ? () => { } : closeModal}
        title={step === 'success' ? 'Payment Successful' : 'Make a Payment'}
      >
        {payingInvoice && step === 'form' && (
          <form onSubmit={handleCardSubmit} className="space-y-4 py-2">
            <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm text-primary">
              Balance due: <strong>{Math.max(0, payingInvoice.balance).toFixed(2)} SAR</strong>
            </div>

            <FormField label="Amount (SAR)" required>
              {(id) => (
                <input
                  id={id} type="number" step="0.01" min="0.01"
                  max={payingInvoice.balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              )}
            </FormField>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-text">
                <CreditCard className="w-4 h-4 text-text-muted" />
                Card Details
              </div>

              <FormField label="Cardholder Name" required>
                {(id) => (
                  <input id={id} type="text" placeholder="As shown on card" value={cardName}
                    onChange={(e) => setCardName(e.target.value)} required />
                )}
              </FormField>

              <FormField label="Card Number" required>
                {(id) => (
                  <input id={id} type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                    value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19} required />
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry" required>
                  {(id) => (
                    <input id={id} type="text" placeholder="MM/YY" value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))} maxLength={5} required />
                  )}
                </FormField>
                <FormField label="CVV" required>
                  {(id) => (
                    <input id={id} type="password" inputMode="numeric" placeholder="123" value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} required />
                  )}
                </FormField>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                <Lock className="w-3 h-3" />
                This is a UI demo only - no real card details are transmitted or stored.
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                Pay {amount ? `${parseFloat(amount).toFixed(2)} SAR` : ''}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Processing payment...</p>
          </div>
        )}

        {step === 'success' && payingInvoice && (
          <div className="py-4 space-y-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-lg font-bold text-text">Payment Successful</p>
                <p className="text-sm text-text-muted mt-0.5">Your payment has been recorded.</p>
              </div>
            </div>

            <div className="bg-surface-muted/20 border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-muted/30">
                <Receipt className="w-4 h-4 text-text-muted" />
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Receipt</span>
              </div>
              <div className="divide-y divide-border text-sm">
                <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Reference</span><span className="font-mono text-text">{receiptRef}</span></div>
                <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Programme</span><span className="text-text">{payingInvoice.program?.name} · Term {payingInvoice.term?.termNo}</span></div>
                <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Card</span><span className="text-text">•••• {cardNumber.replace(/\s/g, '').slice(-4)}</span></div>
                <div className="px-4 py-2.5 flex justify-between"><span className="text-text-muted">Date</span><span className="text-text">{new Date().toISOString().split('T')[0]}</span></div>
                <div className="px-4 py-3 flex justify-between bg-surface-muted/20 font-bold"><span className="text-text">Amount Paid</span><span className="text-success">{parseFloat(amount || '0').toFixed(2)} SAR</span></div>
              </div>
            </div>

            <button
              onClick={() => { closeModal(); success('Payment recorded!'); }}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        )}
      </Modal>

      {viewingInvoiceRegId && (
        <InvoiceDocument registrationId={viewingInvoiceRegId} onClose={() => setViewingInvoiceRegId(null)} />
      )}
    </div>
  );
}
