import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Link2, Copy } from 'lucide-react';
import { useDataStore, FamilyActions, StudentActions, RegistrationActions, InvoiceActions } from '../../store/dataStore';
import { useRegistrationRequestsStore } from '../../store/registrationRequestsStore';
import { calculateFee } from '../../lib/pricingEngine';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import type { RegistrationRequest } from '../../types';

export function RegistrationRequests() {
    const { locations, programs, cohorts, cohortRules, terms, rateCards } = useDataStore();
    const requests = useRegistrationRequestsStore((s) => s.requests);
    const updateRequest = useRegistrationRequestsStore((s) => s.updateRequest);
    const { success, error } = useToast();

    const [reviewing, setReviewing] = useState<RegistrationRequest | null>(null);
    const [termId, setTermId] = useState('');
    const [cohortId, setCohortId] = useState('');

    const locationById = new Map(locations.map((l) => [l.id, l]));
    const programById = new Map(programs.map((p) => [p.id, p]));

    const shareLink = `${window.location.origin}/apply`;

    function copyLink() {
        navigator.clipboard.writeText(shareLink);
        success('Registration link copied to clipboard');
    }

    function openReview(req: RegistrationRequest) {
        setReviewing(req);
        const locTerms = terms.filter((t) => t.locationId === req.locationId);
        setTermId(locTerms[0]?.id ?? '');
        const eligibleCohorts = cohorts.filter((c) => {
            const rule = cohortRules.find((r) => r.id === c.cohortRuleId);
            return rule?.programId === req.programId;
        });
        const preferredMatch = eligibleCohorts.find((c) => c.label === req.preferredCohortLabel);
        setCohortId((preferredMatch ?? eligibleCohorts[0])?.id ?? '');
    }

    function reject(req: RegistrationRequest) {
        updateRequest(req.id, { status: 'rejected' });
        success('Request rejected');
    }

    function approve() {
        if (!reviewing || !termId || !cohortId) return;
        try {
            const rateCard = rateCards.find((rc) => rc.programId === reviewing.programId);
            if (!rateCard) throw new Error('No rate card configured for this programme');

            const familyId = `family_req_${Date.now()}`;
            const studentId = `student_req_${Date.now()}`;
            const registrationId = `registration_req_${Date.now()}`;
            const invoiceId = `invoice_req_${Date.now()}`;

            FamilyActions.add({
                id: familyId,
                guardianName: reviewing.guardianName,
                phonePrimary: reviewing.guardianPhone,
                phoneSecondary: null,
                email: reviewing.guardianEmail || '',
            });
            StudentActions.add({
                id: studentId,
                familyId,
                name: reviewing.studentName,
                dob: reviewing.dob,
                locationId: reviewing.locationId,
            });

            const registration = {
                id: registrationId,
                studentId,
                programId: reviewing.programId,
                termId,
                cohortId,
                joinDate: new Date().toISOString().split('T')[0],
                commitmentTerms: 1,
                kitOptIn: reviewing.kitOptIn,
                status: 'active' as const,
            };

            // calculateFee reads the student/term/rateCard/vatConfig from the store directly, using
            // only the fields on this registration object - safe to call before the registration
            // itself is added to the store.
            const fee = calculateFee(registration);

            RegistrationActions.add(registration);

            // pricingEngine's baseAmount bundles tuition + registration fee + kit fee together;
            // Invoice wants them broken out separately, so unbundle using the same RateCard here.
            const term = terms.find((t) => t.id === termId)!;
            let weeksBilled = term.totalWeeks;
            const joinDate = new Date(registration.joinDate);
            const startDate = new Date(term.startDate);
            if (joinDate > startDate) {
                const diffDays = Math.ceil(Math.abs(new Date(term.endDate).getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
                weeksBilled = Math.max(1, Math.ceil(diffDays / 7));
            }
            weeksBilled = Math.max(weeksBilled, rateCard.minBillableWeeks);
            const tuitionOnly = weeksBilled * rateCard.weeklyRate;

            InvoiceActions.add({
                id: invoiceId,
                registrationId,
                baseAmount: tuitionOnly,
                discountPct: fee.discountPct,
                discountAmount: fee.discountAmount,
                kitFee: reviewing.kitOptIn ? rateCard.kitFee : 0,
                registrationFee: rateCard.registrationFee,
                vatAmount: fee.vatAmount,
                total: fee.total,
            });

            updateRequest(reviewing.id, { status: 'approved', resultingStudentId: studentId });
            setReviewing(null);
            success(`${reviewing.studentName} registered - invoice SAR ${fee.total.toFixed(2)} created`);
        } catch (e) {
            error(e instanceof Error ? e.message : 'Could not approve this request');
        }
    }

    const eligibleCohortsForReview = useMemo(() => {
        if (!reviewing) return [];
        return cohorts.filter((c) => {
            const rule = cohortRules.find((r) => r.id === c.cohortRuleId);
            return rule?.programId === reviewing.programId;
        });
    }, [reviewing, cohorts, cohortRules]);

    const termsForReview = useMemo(() => {
        if (!reviewing) return [];
        return terms.filter((t) => t.locationId === reviewing.locationId);
    }, [reviewing, terms]);

    const sorted = [...requests].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-text">Registration Requests</h1>
                <p className="text-text-muted mt-1">Requests submitted through your public registration link.</p>
            </div>

            <div className="bg-surface rounded-lg border border-border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Link2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">Share Registration Link</p>
                        <p className="text-xs text-text-muted font-mono truncate">{shareLink}</p>
                    </div>
                </div>
                <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                >
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                </button>
            </div>

            <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-surface-muted/30">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{sorted.length} requests</span>
                </div>
                {sorted.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-text-muted">
                        No registration requests yet. Share the link above to start receiving them.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {sorted.map((req) => (
                            <div key={req.id} className="px-5 py-4 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text">{req.studentName}</p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-muted mt-0.5">
                                        <span>{req.guardianName} · {req.guardianPhone}</span>
                                        <span>{locationById.get(req.locationId)?.name}</span>
                                        <span>{programById.get(req.programId)?.name}</span>
                                        {req.preferredCohortLabel && <span>Wants: {req.preferredCohortLabel}</span>}
                                        <span>{new Date(req.submittedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}>
                                    {req.status}
                                </Badge>
                                {req.status === 'pending' && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => openReview(req)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Review
                                        </button>
                                        <button
                                            onClick={() => reject(req)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-muted border border-border text-text-muted rounded-md text-xs font-medium hover:text-danger hover:border-danger/40 transition-colors"
                                        >
                                            <XCircle className="w-3.5 h-3.5" /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {reviewing && (
                <Modal isOpen onClose={() => setReviewing(null)} title={`Review Request - ${reviewing.studentName}`}>
                    <div className="space-y-4 py-1">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm bg-surface-muted/20 rounded-md p-3">
                            <div><span className="text-text-muted">Child</span><p className="font-medium text-text">{reviewing.studentName}</p></div>
                            <div><span className="text-text-muted">DOB</span><p className="font-medium text-text">{reviewing.dob}</p></div>
                            <div><span className="text-text-muted">Guardian</span><p className="font-medium text-text">{reviewing.guardianName}</p></div>
                            <div><span className="text-text-muted">Phone</span><p className="font-medium text-text">{reviewing.guardianPhone}</p></div>
                            <div><span className="text-text-muted">Location</span><p className="font-medium text-text">{locationById.get(reviewing.locationId)?.name}</p></div>
                            <div><span className="text-text-muted">Programme</span><p className="font-medium text-text">{programById.get(reviewing.programId)?.name}</p></div>
                            {reviewing.message && <div className="col-span-2"><span className="text-text-muted">Message</span><p className="text-text">{reviewing.message}</p></div>}
                        </div>

                        <p className="text-xs text-text-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Confirm the term and cohort before this becomes a real registration and invoice.</p>

                        <FormField label="Term" required>
                            {(id) => (
                                <select id={id} value={termId} onChange={(e) => setTermId(e.target.value)} required>
                                    {termsForReview.map((t) => <option key={t.id} value={t.id}>Term {t.termNo} ({t.startDate})</option>)}
                                </select>
                            )}
                        </FormField>
                        <FormField label="Cohort" required>
                            {(id) => (
                                <select id={id} value={cohortId} onChange={(e) => setCohortId(e.target.value)} required>
                                    {eligibleCohortsForReview.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            )}
                        </FormField>

                        <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                            <button onClick={() => setReviewing(null)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">Cancel</button>
                            <button onClick={approve} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                Approve &amp; Create Registration
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
