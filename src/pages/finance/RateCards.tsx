import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDataStore, RateCardActions } from '../../store/dataStore';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { FormField } from '../../components/ui/FormField';
import type { RateCard } from '../../types';

export function RateCards() {
  const { rateCards, programs } = useDataStore();
  const { success, error } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);

  const tableData = useMemo(() => {
    const now = new Date().toISOString().split('T')[0];
    
    return rateCards.map(rc => {
      const program = programs.find(p => p.id === rc.programId);
      
      let status: 'Active' | 'Scheduled' | 'Expired' = 'Active';
      if (rc.effectiveFrom > now) {
        status = 'Scheduled';
      } else if (rc.effectiveTo && rc.effectiveTo < now) {
        status = 'Expired';
      }

      return {
        ...rc,
        programName: program ? `${program.name} (${program.code})` : 'Unknown Program',
        status
      };
    });
  }, [rateCards, programs]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const programId = fd.get('programId') as string;
    const weeklyRate = parseFloat(fd.get('weeklyRate') as string);
    const kitFee = parseFloat(fd.get('kitFee') as string);
    const registrationFee = parseFloat(fd.get('registrationFee') as string);
    const minBillableWeeks = parseInt(fd.get('minBillableWeeks') as string, 10);
    const effectiveFrom = fd.get('effectiveFrom') as string;
    const effectiveTo = (fd.get('effectiveTo') as string) || null;

    // Validation: Check for overlap
    const existingCards = rateCards.filter(rc => rc.programId === programId);
    
    for (const card of existingCards) {
      const existingFrom = card.effectiveFrom;
      const existingTo = card.effectiveTo || '9999-12-31';
      const newFrom = effectiveFrom;
      const newTo = effectiveTo || '9999-12-31';
      
      // Check overlap: (StartA <= EndB) and (EndA >= StartB)
      if (existingFrom <= newTo && existingTo >= newFrom) {
        error('This date range overlaps with an existing rate card for this program.');
        return;
      }
    }

    RateCardActions.add({
      id: `rc_${Date.now()}`,
      programId,
      weeklyRate,
      kitFee,
      registrationFee,
      minBillableWeeks,
      effectiveFrom,
      effectiveTo
    });

    success('Rate card created successfully.');
    setModalOpen(false);
  }

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'programName', label: 'Program' },
    { key: 'weeklyRate', label: 'Weekly Rate', render: (val) => `${val} SAR` },
    { key: 'kitFee', label: 'Kit Fee', render: (val) => `${val} SAR` },
    { key: 'registrationFee', label: 'Reg Fee', render: (val) => `${val} SAR` },
    { key: 'minBillableWeeks', label: 'Min Weeks' },
    { 
      key: 'effectiveFrom', 
      label: 'Date Range', 
      render: (_, row) => `${row.effectiveFrom} to ${row.effectiveTo || 'Ongoing'}` 
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : val === 'Scheduled' ? 'info' : 'neutral'}>
          {String(val)}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Rate Cards</h1>
          <p className="text-text-muted mt-1">Manage program pricing and fees over time.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Rate Card
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={tableData}
          searchPlaceholder="Search programs..."
          searchKeys={['programName']}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Rate Card"
      >
        <form id="rate-card-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          
          <FormField label="Program" required>
            {(id) => (
              <select id={id} name="programId" required>
                <option value="" disabled selected>Select Program...</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                ))}
              </select>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Weekly Rate (SAR)" required>
              {(id) => <input id={id} name="weeklyRate" type="number" step="0.01" min="0" required />}
            </FormField>
            <FormField label="Registration Fee (SAR)" required>
              {(id) => <input id={id} name="registrationFee" type="number" step="0.01" min="0" required />}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kit Fee (SAR)" required>
              {(id) => <input id={id} name="kitFee" type="number" step="0.01" min="0" required />}
            </FormField>
            <FormField label="Min Billable Weeks" required>
              {(id) => <input id={id} name="minBillableWeeks" type="number" min="1" required defaultValue={1} />}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Effective From" required>
              {(id) => <input id={id} name="effectiveFrom" type="date" required />}
            </FormField>
            <FormField label="Effective To (Optional)">
              {(id) => <input id={id} name="effectiveTo" type="date" />}
            </FormField>
          </div>
          
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
              form="rate-card-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Create Rate Card
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
