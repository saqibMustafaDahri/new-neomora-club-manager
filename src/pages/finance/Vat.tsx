import { useState, useMemo } from 'react';
import { CalendarClock } from 'lucide-react';
import { useDataStore, VatConfigActions } from '../../store/dataStore';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';

export function Vat() {
  const { vatConfigs } = useDataStore();
  const { success } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);

  const { activeConfig, scheduledConfigs } = useMemo(() => {
    const now = new Date().toISOString().split('T')[0];
    
    // Sort descending by effective date
    const sorted = [...vatConfigs].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
    
    const active = sorted.find(v => v.effectiveFrom <= now);
    const scheduled = sorted.filter(v => v.effectiveFrom > now);

    return { activeConfig: active, scheduledConfigs: scheduled };
  }, [vatConfigs]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rate = parseFloat(fd.get('rate') as string);
    const effectiveFrom = fd.get('effectiveFrom') as string;

    VatConfigActions.add({
      id: `vat_${Date.now()}`,
      rate,
      effectiveFrom
    });

    success('Future VAT rate scheduled successfully.');
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">VAT Configuration</h1>
        <p className="text-text-muted mt-1">Manage global Value Added Tax settings.</p>
      </div>

      {scheduledConfigs.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex items-start gap-3">
          <CalendarClock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-warning">Scheduled VAT Change</h3>
            <p className="text-sm text-warning/80 mt-1">
              A new VAT rate of <strong>{scheduledConfigs[0].rate}%</strong> is scheduled to take effect on <strong>{scheduledConfigs[0].effectiveFrom}</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-lg border border-border shadow-sm p-8 max-w-2xl text-center flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-lg font-medium text-text-muted">Current Active VAT Rate</h2>
        <div className="text-7xl font-bold text-primary mt-4 mb-2">
          {activeConfig?.rate ?? 0}%
        </div>
        <p className="text-sm text-text-muted">
          Effective since: {activeConfig?.effectiveFrom || 'Unknown'}
        </p>

        <button
          onClick={() => setModalOpen(true)}
          className="mt-10 px-6 py-2.5 bg-background border border-border rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
        >
          Schedule Future Rate Change
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule VAT Change"
      >
        <form id="vat-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          
          <div className="bg-primary/5 p-3 rounded-md border border-primary/20 mb-4">
            <p className="text-sm text-primary">
              The new VAT rate will automatically apply to all invoices generated on or after the effective date.
            </p>
          </div>

          <FormField label="New VAT Rate (%)" required>
            {(id) => <input id={id} name="rate" type="number" step="0.1" min="0" required placeholder="e.g. 15" />}
          </FormField>

          <FormField label="Effective From" required>
            {(id) => <input id={id} name="effectiveFrom" type="date" required />}
          </FormField>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="vat-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Schedule Rate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
