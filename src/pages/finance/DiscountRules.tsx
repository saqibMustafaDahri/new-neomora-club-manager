import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useDataStore, DiscountRuleActions } from '../../store/dataStore';
import { calculateFee } from '../../lib/pricingEngine';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import type { DiscountRule } from '../../types';

export function DiscountRules() {
  const { discountRules, programs, registrations } = useDataStore();
  const { success } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [ruleType, setRuleType] = useState<DiscountRule['type']>('sibling');
  const [liveExample, setLiveExample] = useState<any>(null);

  useEffect(() => {
    // Re-calculate the live example whenever discount rules change
    // We'll mock a 24-week (2 terms) sibling registration using an existing reg
    // reg_1 is a known sibling registration in our mock data
    const baseReg = registrations.find(r => r.id === 'reg_1');
    if (baseReg) {
      const fakeReg = { ...baseReg, commitmentTerms: 2 };
      try {
        const result = calculateFee(fakeReg);
        setLiveExample(result);
      } catch (e) {
        setLiveExample(null);
      }
    }
  }, [discountRules, registrations]);

  const tableData = useMemo(() => {
    return discountRules.map(rule => {
      const programName = rule.programId ? programs.find(p => p.id === rule.programId)?.name : 'All Programs';
      
      let details = '';
      if (rule.type === 'term_commitment') details = `Min ${rule.minWeeks} weeks`;
      else if (rule.type === 'promo') details = `Valid ${rule.minWeeks} weeks+`;
      else details = 'Applies to 2nd+ sibling';

      return {
        ...rule,
        programName,
        details,
        typeLabel: rule.type.replace('_', ' ').toUpperCase()
      };
    });
  }, [discountRules, programs]);

  function handleToggleActive(id: string, currentActive: boolean) {
    DiscountRuleActions.update(id, { active: !currentActive });
    success(`Rule ${!currentActive ? 'activated' : 'deactivated'}.`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const type = ruleType;
    const programId = (fd.get('programId') as string) || null;
    const discountPct = parseFloat(fd.get('discountPct') as string);
    const minWeeks = fd.get('minWeeks') ? parseInt(fd.get('minWeeks') as string, 10) : 1;
    const maxWeeks = fd.get('maxWeeks') ? parseInt(fd.get('maxWeeks') as string, 10) : null;

    DiscountRuleActions.add({
      id: `dr_${Date.now()}`,
      type,
      programId: programId === 'all' ? null : programId,
      minWeeks,
      maxWeeks,
      discountPct,
      active: true
    });

    success('Discount rule created successfully.');
    setModalOpen(false);
  }

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'typeLabel', label: 'Type' },
    { key: 'programName', label: 'Program Scope' },
    { key: 'details', label: 'Details' },
    { 
      key: 'discountPct', 
      label: 'Discount',
      render: (val) => <Badge variant="success">{val as number}% Off</Badge>
    },
    {
      key: 'active',
      label: 'Status',
      render: (val, row) => (
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={val as boolean} 
              onChange={() => handleToggleActive(row.id, val as boolean)} 
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${val ? 'bg-success' : 'bg-surface-muted border border-border'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${val ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Discount Rules</h1>
          <p className="text-text-muted mt-1">Manage sibling, commitment, and promo discounts.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {liveExample && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-primary">Live Pricing Engine Example</h3>
            <p className="text-sm text-text-muted mt-1">
              A 24-week sibling registration is currently discounted by 
              <strong className="text-text ml-1">{liveExample.discountPct}%</strong>.
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Base Tuition: {liveExample.baseAmount} SAR | Total Discount: {liveExample.discountAmount} SAR
            </p>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={tableData}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Discount Rule"
      >
        <form id="discount-rule-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          
          <FormField label="Rule Type" required>
            {(id) => (
              <select id={id} name="type" value={ruleType} onChange={(e) => setRuleType(e.target.value as any)} required>
                <option value="sibling">Sibling Discount</option>
                <option value="term_commitment">Term Commitment</option>
                <option value="promo">Promo Code</option>
              </select>
            )}
          </FormField>

          <FormField label="Program Scope" required>
            {(id) => (
              <select id={id} name="programId" required>
                <option value="all">All Programs</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label="Discount Percentage (%)" required>
            {(id) => <input id={id} name="discountPct" type="number" step="0.1" min="0.1" max="100" required />}
          </FormField>

          {(ruleType === 'term_commitment' || ruleType === 'promo') && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Min Weeks Required" required>
                {(id) => <input id={id} name="minWeeks" type="number" min="1" required defaultValue={12} />}
              </FormField>
              <FormField label="Max Weeks (Optional)">
                {(id) => <input id={id} name="maxWeeks" type="number" min="1" placeholder="Leave blank for no limit" />}
              </FormField>
            </div>
          )}

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
              form="discount-rule-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Create Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
