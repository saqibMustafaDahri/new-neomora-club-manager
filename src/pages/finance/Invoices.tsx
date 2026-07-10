import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import type { Invoice } from '../../types';

const PAYMENT_METHODS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  cash: 'Cash'
};

export function Invoices() {
  const { invoices, registrations, students, programs, terms, locations, payments, families } = useDataStore();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Build filter options
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterTerm, setFilterTerm] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tableData = useMemo(() => {
    return invoices.map(inv => {
      const reg = registrations.find(r => r.id === inv.registrationId);
      const student = reg ? students.find(s => s.id === reg.studentId) : null;
      const program = reg ? programs.find(p => p.id === reg.programId) : null;
      const term = reg ? terms.find(t => t.id === reg.termId) : null;
      const location = student ? locations.find(l => l.id === student.locationId) : null;

      const invoicePayments = payments.filter(p => p.invoiceId === inv.id);
      const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);

      let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
      if (totalPaid >= inv.total) paymentStatus = 'Paid';
      else if (totalPaid > 0) paymentStatus = 'Partial';

      // Flag: any payment missing bankRef or paidDate
      const hasFlag = invoicePayments.some(p => !p.bankRef || !p.paidDate);

      return {
        ...inv,
        studentName: student?.name || 'Unknown',
        programName: program?.name || 'Unknown',
        termName: term ? `Term ${term.termNo}` : 'Unknown',
        locationId: location?.id || '',
        locationName: location?.name || 'Unknown',
        paymentStatus,
        hasFlag,
        totalPaid
      };
    });
  }, [invoices, registrations, students, programs, terms, locations, payments]);

  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      if (filterLocation !== 'all' && row.locationId !== filterLocation) return false;
      if (filterTerm !== 'all') {
        const reg = registrations.find(r => r.id === row.registrationId);
        if (!reg || reg.termId !== filterTerm) return false;
      }
      if (filterStatus !== 'all' && row.paymentStatus !== filterStatus) return false;
      return true;
    });
  }, [tableData, filterLocation, filterTerm, filterStatus, registrations]);

  // Payments for the selected invoice
  const selectedPayments = useMemo(() => {
    if (!selectedInvoice) return [];
    return payments.filter(p => p.invoiceId === selectedInvoice.id);
  }, [selectedInvoice, payments]);

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'id', label: 'Invoice', render: (val) => <span className="text-xs font-mono text-text-muted">{String(val)}</span> },
    { key: 'studentName', label: 'Student' },
    { key: 'programName', label: 'Program' },
    { key: 'termName', label: 'Term' },
    { key: 'locationName', label: 'Location' },
    { key: 'total', label: 'Total', render: (val) => <span className="font-semibold">{Number(val).toFixed(2)} SAR</span> },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Badge variant={val === 'Paid' ? 'success' : val === 'Partial' ? 'warning' : 'danger'}>
            {String(val)}
          </Badge>
          {row.hasFlag && (
            <div className="group relative">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-text text-background text-xs rounded shadow-lg z-10 text-center">
                Payment is missing a bank reference or date.
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Invoices</h1>
        <p className="text-text-muted mt-1">All invoices across both locations.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterLocation}
          onChange={e => setFilterLocation(e.target.value)}
          className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Locations</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <select
          value={filterTerm}
          onChange={e => setFilterTerm(e.target.value)}
          className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Terms</option>
          {terms.map(t => (
            <option key={t.id} value={t.id}>{t.termNo === 1 ? 'Term 1' : t.termNo === 2 ? 'Term 2' : 'Term 3'} — {locations.find(l => l.id === t.locationId)?.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={filteredData}
          onRowClick={(row) => setSelectedInvoice(row)}
          searchPlaceholder="Search by student or program..."
          searchKeys={['studentName', 'programName', 'locationName']}
        />
      </div>

      {/* Invoice detail modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Invoice Details"
      >
        {selectedInvoice && (() => {
          const row = tableData.find(d => d.id === selectedInvoice.id)!;
          return (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Student</p>
                  <p className="font-medium text-text">{row.studentName}</p>
                </div>
                <div>
                  <p className="text-text-muted">Program</p>
                  <p className="font-medium text-text">{row.programName}</p>
                </div>
                <div>
                  <p className="text-text-muted">Term</p>
                  <p className="font-medium text-text">{row.termName}</p>
                </div>
                <div>
                  <p className="text-text-muted">Location</p>
                  <p className="font-medium text-text">{row.locationName}</p>
                </div>
              </div>

              {/* Fee breakdown */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-surface-muted px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Fee Breakdown</div>
                <div className="divide-y divide-border text-sm">
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-text-muted">Base Tuition</span>
                    <span className="font-medium text-text">{selectedInvoice.baseAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-text-muted">Kit Fee</span>
                    <span className="font-medium text-text">{selectedInvoice.kitFee.toFixed(2)} SAR</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-text-muted">Registration Fee</span>
                    <span className="font-medium text-text">{selectedInvoice.registrationFee.toFixed(2)} SAR</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between text-danger">
                    <span>Discount ({selectedInvoice.discountPct}%)</span>
                    <span>-{selectedInvoice.discountAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between text-text-muted">
                    <span>VAT</span>
                    <span>{selectedInvoice.vatAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between bg-surface-muted/40 font-semibold">
                    <span className="text-text">Total</span>
                    <span className="text-text">{selectedInvoice.total.toFixed(2)} SAR</span>
                  </div>
                </div>
              </div>

              {/* Payment history */}
              <div>
                <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Payment History</h4>
                {selectedPayments.length === 0 ? (
                  <p className="text-sm text-text-muted">No payments recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedPayments.map(p => (
                      <div key={p.id} className={`p-3 rounded-lg border flex justify-between items-start gap-4 ${(!p.bankRef || !p.paidDate) ? 'border-warning/40 bg-warning/5' : 'border-border bg-surface-muted/20'}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text">{p.amount.toFixed(2)} SAR</span>
                            {(!p.bankRef || !p.paidDate) && (
                              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                            )}
                          </div>
                          <p className="text-xs text-text-muted mt-0.5">{PAYMENT_METHODS[p.method]} · {p.paidDate || 'No date'}</p>
                          {p.bankRef ? (
                            <p className="text-xs font-mono text-text-muted">{p.bankRef}</p>
                          ) : (
                            <p className="text-xs text-warning">Missing bank reference</p>
                          )}
                          {p.notes && <p className="text-xs text-text-muted italic mt-0.5">{p.notes}</p>}
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-right text-text-muted pt-1">
                      Paid: {row.totalPaid.toFixed(2)} / {selectedInvoice.total.toFixed(2)} SAR
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end border-t border-border">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-surface-muted border border-border rounded-md text-sm font-medium hover:bg-border/50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
