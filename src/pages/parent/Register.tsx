import { useState, useMemo, useEffect } from 'react';
import { useDataStore, RegistrationActions, InvoiceActions } from '../../store/dataStore';
import { selectFamilyStudents, selectFamilyRegistrations } from '../../store/selectors';
import { calculateFee } from '../../lib/pricingEngine';
import { FormField } from '../../components/ui/FormField';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import type { Registration } from '../../types';

export function Register() {
  // Subscribe to all store slices that affect the live preview so it re-renders on any change
  const { programs, terms, rateCards, discountRules, vatConfigs, registrations, students, cohorts, cohortRules } = useDataStore();
  const { success, error } = useToast();
  const familyStudents = selectFamilyStudents();
  const familyRegistrations = selectFamilyRegistrations();

  const [studentId, setStudentId] = useState(familyStudents[0]?.id ?? '');
  const [programId, setProgramId] = useState(programs[0]?.id ?? '');
  const [termId, setTermId] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [commitmentTerms, setCommitmentTerms] = useState(1);
  const [kitOptIn, setKitOptIn] = useState(false);

  const selectedStudent = useMemo(() => students.find(s => s.id === studentId), [students, studentId]);

  // Terms available for this student's location
  const availableTerms = useMemo(() => {
    if (!selectedStudent) return [];
    return terms.filter(t => t.locationId === selectedStudent.locationId);
  }, [selectedStudent, terms]);

  // Auto-select first available term when student changes
  useEffect(() => {
    if (availableTerms.length > 0) setTermId(availableTerms[0].id);
  }, [studentId, availableTerms]);

  // Sibling detection: other active registrations in this family (excluding current student)
  const hasSibling = useMemo(() => {
    return familyRegistrations.some(r => r.studentId !== studentId && r.status === 'active');
  }, [familyRegistrations, studentId]);

  // Build a draft registration for calculateFee
  const draftReg = useMemo((): Registration => ({
    id: '__preview__',
    studentId,
    programId,
    termId,
    cohortId: '',
    joinDate,
    commitmentTerms,
    kitOptIn,
    status: 'active'
  }), [studentId, programId, termId, joinDate, commitmentTerms, kitOptIn]);

  // Live fee preview — re-runs whenever store state (rateCards, discountRules, vatConfigs) changes
  const feePreview = useMemo(() => {
    if (!studentId || !programId || !termId) return null;
    try {
      return calculateFee(draftReg);
    } catch {
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftReg, rateCards, discountRules, vatConfigs, registrations, students]);

  // Per-commitment-term discount preview for radios
  const commitmentOptions = useMemo(() => {
    const selectedTerm = terms.find(t => t.id === termId);
    if (!selectedTerm) return [1, 2, 3].map(n => ({ terms: n, weeks: undefined as number | undefined, discountPct: 0 }));
    return [1, 2, 3].map(n => {
      const committedWeeks = n * selectedTerm.totalWeeks;
      const termRules = discountRules.filter(dr => dr.type === 'term_commitment' && dr.active);
      let pct = 0;
      for (const rule of termRules) {
        if (committedWeeks >= rule.minWeeks && (!rule.maxWeeks || committedWeeks <= rule.maxWeeks)) {
          pct = Math.max(pct, rule.discountPct);
        }
      }
      return { terms: n, weeks: committedWeeks as number | undefined, discountPct: pct };
    });
  }, [termId, terms, discountRules]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feePreview) { error('Cannot calculate fee — check program/term selection.'); return; }

    const regId = `reg_${Date.now()}`;
    const invoiceId = `inv_${Date.now()}`;

    // Find the best matching cohort: prefer one whose cohortRule matches this program
    const programCohortRuleIds = cohortRules
      .filter(cr => cr.programId === programId)
      .map(cr => cr.id);
    const matchingCohort = cohorts.find(c => programCohortRuleIds.includes(c.cohortRuleId)) ?? cohorts[0];
    const cohortId = matchingCohort?.id ?? '';

    const newReg: Registration = {
      id: regId,
      studentId,
      programId,
      termId,
      cohortId,
      joinDate,
      commitmentTerms,
      kitOptIn,
      status: 'active'
    };

    RegistrationActions.add(newReg);
    InvoiceActions.add({
      id: invoiceId,
      registrationId: regId,
      baseAmount: feePreview.baseAmount,
      discountPct: feePreview.discountPct,
      discountAmount: feePreview.discountAmount,
      kitFee: kitOptIn ? (rateCards.find(rc => rc.programId === programId)?.kitFee ?? 0) : 0,
      registrationFee: rateCards.find(rc => rc.programId === programId)?.registrationFee ?? 0,
      vatAmount: feePreview.vatAmount,
      total: feePreview.total
    });

    success('Registration submitted! Invoice created and visible in Finance portal.');
  }

  const selectedRateCard = useMemo(() => rateCards.find(rc => rc.programId === programId), [rateCards, programId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Register for a Programme</h1>
        <p className="text-text-muted mt-1">Select a programme for your child. The invoice is calculated live.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-surface rounded-lg border border-border shadow-sm p-6 space-y-5">

          <FormField label="Student" required>
            {(id) => (
              <select id={id} value={studentId} onChange={e => setStudentId(e.target.value)} required>
                {familyStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </FormField>

          {/* Sibling status — read-only auto-detected */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Sibling status:</span>
            {hasSibling
              ? <Badge variant="success">Sibling discount applies</Badge>
              : <Badge variant="neutral">No sibling discount</Badge>}
          </div>

          <FormField label="Programme" required>
            {(id) => (
              <select id={id} value={programId} onChange={e => setProgramId(e.target.value)} required>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label="Term" required>
            {(id) => (
              <select id={id} value={termId} onChange={e => setTermId(e.target.value)} required>
                <option value="">Select a term...</option>
                {availableTerms.map(t => (
                  <option key={t.id} value={t.id}>Term {t.termNo} · {t.startDate} to {t.endDate} ({t.totalWeeks} wks)</option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label="Join Date" required>
            {(id) => (
              <input id={id} type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} required />
            )}
          </FormField>

          {/* Commitment radios with live discount % */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Commitment Length</label>
            <div className="space-y-2">
              {commitmentOptions.map(opt => (
                <label
                  key={opt.terms}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    commitmentTerms === opt.terms ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="commitment"
                      checked={commitmentTerms === opt.terms}
                      onChange={() => setCommitmentTerms(opt.terms)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text">
                      {opt.terms} term{opt.terms > 1 ? 's' : ''} {opt.weeks ? `(${opt.weeks} weeks)` : ''}
                    </span>
                  </div>
                  {opt.discountPct > 0
                    ? <Badge variant="success">{opt.discountPct}% off</Badge>
                    : <Badge variant="neutral">No discount</Badge>}
                </label>
              ))}
            </div>
          </div>

          {/* Kit toggle */}
          {selectedRateCard && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={kitOptIn}
                  onChange={e => setKitOptIn(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${kitOptIn ? 'bg-primary' : 'bg-surface-muted border border-border'}`} />
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${kitOptIn ? 'transform translate-x-4' : ''}`} />
              </div>
              <span className="text-sm text-text">
                Include Kit (+{selectedRateCard.kitFee} SAR)
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={!feePreview}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Registration
          </button>
        </form>

        {/* Live Invoice Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden sticky top-4">
            <div className="bg-surface-muted/30 px-5 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text">Live Invoice Preview</h3>
              <p className="text-xs text-text-muted mt-0.5">Powered by calculateFee() · updates live</p>
            </div>

            {feePreview ? (
              <div className="divide-y divide-border text-sm">
                <div className="px-5 py-3 flex justify-between">
                  <span className="text-text-muted">Weeks billed</span>
                  <span className="font-medium text-text">{feePreview.weeksBilled}</span>
                </div>
                <div className="px-5 py-3 flex justify-between">
                  <span className="text-text-muted">Base tuition + fees</span>
                  <span className="font-medium text-text">{feePreview.baseAmount.toFixed(2)} SAR</span>
                </div>
                {feePreview.discountPct > 0 && (
                  <div className="px-5 py-3 flex justify-between text-success">
                    <span>Discount ({feePreview.discountPct}%)</span>
                    <span>-{feePreview.discountAmount.toFixed(2)} SAR</span>
                  </div>
                )}
                <div className="px-5 py-3 flex justify-between text-text-muted">
                  <span>VAT</span>
                  <span>{feePreview.vatAmount.toFixed(2)} SAR</span>
                </div>
                <div className="px-5 py-4 flex justify-between bg-surface-muted/20 font-bold text-base">
                  <span className="text-text">Total</span>
                  <span className="text-primary">{feePreview.total.toFixed(2)} SAR</span>
                </div>
                {feePreview.discountPct > 0 && (
                  <div className="px-5 py-2 bg-success/5 text-xs text-success text-center">
                    {hasSibling && feePreview.discountPct > 0 ? 'Sibling discount applied ✓' : 'Commitment discount applied ✓'}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-text-muted">
                Select a student, programme, and term to see the invoice preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
