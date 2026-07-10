import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useDataStore, ProgramActions, CohortRuleActions } from '../../store/dataStore';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';

export function Programs() {
  const { programs, cohortRules, cohorts, locations } = useDataStore();
  const { success } = useToast();
  
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [ruleType, setRuleType] = useState<'birth_year_range' | 'birth_year_exact'>('birth_year_range');

  const toggleProgram = (programId: string) => {
    setExpandedPrograms(prev => {
      const next = new Set(prev);
      if (next.has(programId)) next.delete(programId);
      else next.add(programId);
      return next;
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const code = fd.get('code') as string;
    const name = fd.get('name') as string;
    const locationId = fd.get('locationId') as string;
    const type = fd.get('ruleType') as 'birth_year_range' | 'birth_year_exact';
    const sessionsPerWeek = parseInt(fd.get('sessionsPerWeek') as string, 10);
    const capacity = parseInt(fd.get('capacity') as string, 10);

    const programId = `prog_${code.toLowerCase()}_${Date.now()}`;
    
    // Add Program
    ProgramActions.add({
      id: programId,
      code,
      name,
      locationId: locationId === 'all' ? null : locationId
    });

    // Add Cohort Rule
    const ruleId = `rule_${programId}_${Date.now()}`;
    const config = type === 'birth_year_range' 
      ? { minYear: parseInt(fd.get('minYear') as string, 10), maxYear: parseInt(fd.get('maxYear') as string, 10) }
      : { exactYear: parseInt(fd.get('exactYear') as string, 10) };

    CohortRuleActions.add({
      id: ruleId,
      programId,
      type,
      config,
      sessionsPerWeek,
      capacity
    });

    success('Program created successfully.');
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Programs</h1>
          <p className="text-text-muted mt-1">Manage programs and age group rules.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      <div className="space-y-4">
        {programs.map(program => {
          const isExpanded = expandedPrograms.has(program.id);
          const pRules = cohortRules.filter(r => r.programId === program.id);
          const locationName = program.locationId 
            ? locations.find(l => l.id === program.locationId)?.name 
            : 'All Locations';
          
          return (
            <div key={program.id} className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-muted/50 transition-colors"
                onClick={() => toggleProgram(program.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-text-muted" /> : <ChevronRight className="w-5 h-5 text-text-muted" />}
                  <div>
                    <h3 className="text-lg font-semibold text-text">{program.name} ({program.code})</h3>
                    <p className="text-sm text-text-muted">{locationName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text-muted bg-surface-muted px-2.5 py-1 rounded-md">
                    {pRules.length} Rules
                  </span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="border-t border-border p-4 bg-surface-muted/10 space-y-4">
                  {pRules.length === 0 ? (
                    <p className="text-sm text-text-muted text-center py-4">No cohort rules configured.</p>
                  ) : pRules.map(rule => {
                    const ruleCohorts = cohorts.filter(c => c.cohortRuleId === rule.id);
                    return (
                      <div key={rule.id} className="bg-background border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-medium text-text block mb-1">
                              {rule.type === 'birth_year_range' 
                                ? `Birth Year Range: ${rule.config.minYear} - ${rule.config.maxYear}`
                                : `Exact Birth Year: ${rule.config.exactYear}`}
                            </span>
                            <span className="text-xs text-text-muted">
                              {rule.sessionsPerWeek} sessions/week · {rule.capacity} max capacity
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Resulting Cohorts</p>
                          <div className="flex flex-wrap gap-2">
                            {ruleCohorts.length > 0 ? ruleCohorts.map(c => (
                              <Badge key={c.id} variant="neutral">{c.label}</Badge>
                            )) : (
                              <span className="text-xs text-text-muted">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Program"
        width="lg"
      >
        <form id="program-form" onSubmit={handleSubmit} className="space-y-6 py-2">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text border-b border-border pb-1">Program Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Program Code" required>
                {(id) => <input id={id} name="code" type="text" placeholder="e.g. JS" required />}
              </FormField>
              <FormField label="Program Name" required>
                {(id) => <input id={id} name="name" type="text" placeholder="e.g. Juventus Select" required />}
              </FormField>
            </div>
            
            <FormField label="Location" required>
              {(id) => (
                <select id={id} name="locationId" required>
                  <option value="all">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              )}
            </FormField>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text border-b border-border pb-1">Primary Cohort Rule</h3>
            
            <FormField label="Rule Type" required>
              {(id) => (
                <select 
                  id={id} 
                  name="ruleType" 
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as any)}
                >
                  <option value="birth_year_range">Birth Year Range</option>
                  <option value="birth_year_exact">Exact Birth Year</option>
                </select>
              )}
            </FormField>

            {ruleType === 'birth_year_range' ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Min Year" required>
                  {(id) => <input id={id} name="minYear" type="number" min="1900" max="2100" required />}
                </FormField>
                <FormField label="Max Year" required>
                  {(id) => <input id={id} name="maxYear" type="number" min="1900" max="2100" required />}
                </FormField>
              </div>
            ) : (
              <FormField label="Exact Year" required>
                {(id) => <input id={id} name="exactYear" type="number" min="1900" max="2100" required />}
              </FormField>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Sessions Per Week" required>
                {(id) => <input id={id} name="sessionsPerWeek" type="number" min="1" required />}
              </FormField>
              <FormField label="Capacity (Max Students)" required>
                {(id) => <input id={id} name="capacity" type="number" min="1" required />}
              </FormField>
            </div>
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
              form="program-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Create Program
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
