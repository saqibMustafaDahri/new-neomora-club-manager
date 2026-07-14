import { useState } from 'react';
import { CheckCircle2, MessageCircleQuestion } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useRegistrationRequestsStore } from '../../store/registrationRequestsStore';
import type { RegistrationRequest } from '../../types';

export function Apply() {
    const locations = useDataStore((s) => s.locations);
    const programs = useDataStore((s) => s.programs);
    const cohorts = useDataStore((s) => s.cohorts);
    const addRequest = useRegistrationRequestsStore((s) => s.addRequest);

    const [submitted, setSubmitted] = useState(false);
    const [referenceId, setReferenceId] = useState('');

    const [studentName, setStudentName] = useState('');
    const [dob, setDob] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [locationId, setLocationId] = useState(locations[0]?.id ?? '');
    const [programId, setProgramId] = useState(programs[0]?.id ?? '');
    const [preferredCohortLabel, setPreferredCohortLabel] = useState('');
    const [kitOptIn, setKitOptIn] = useState(false);
    const [message, setMessage] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const id = `req_${Date.now()}`;
        const request: RegistrationRequest = {
            id,
            studentName, dob, guardianName, guardianPhone, guardianEmail,
            locationId, programId, preferredCohortLabel, kitOptIn, message,
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };
        addRequest(request);
        setReferenceId(id);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-surface rounded-xl border border-border shadow-sm p-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text">Registration Request Submitted</h1>
                        <p className="text-sm text-text-muted mt-2">
                            Thanks, {guardianName || 'there'}! We've received your registration request for{' '}
                            <strong>{studentName}</strong>. The academy will review it and follow up with you directly.
                        </p>
                    </div>
                    <div className="bg-surface-muted/30 rounded-md p-3 text-xs text-text-muted font-mono">
                        Reference: {referenceId}
                    </div>
                    <p className="text-xs text-text-muted">You can close this tab now.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-10">
            <div className="max-w-lg w-full">
                <div className="text-center mb-6">
                    <img src="/neomora-logo.png" alt="Neomora" className="h-8 w-auto mx-auto mb-3" />
                    <h1 className="text-xl font-bold text-text">Registration Request</h1>
                    <p className="text-sm text-text-muted mt-1">
                        Fill this out to request a spot - the academy will confirm and get you set up.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-4">
                    <div>
                        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Child's Details</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-text-muted">Full Name</label>
                                <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-muted">Date of Birth</label>
                                <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)}
                                    className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Guardian's Details</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-text-muted">Full Name</label>
                                <input type="text" required value={guardianName} onChange={(e) => setGuardianName(e.target.value)}
                                    className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-text-muted">Phone</label>
                                    <input type="tel" required value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)}
                                        placeholder="05X XXX XXXX"
                                        className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-text-muted">Email (optional)</label>
                                    <input type="email" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)}
                                        className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Programme</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-text-muted">Location</label>
                                <select value={locationId} onChange={(e) => setLocationId(e.target.value)} required
                                    className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-muted">Programme</label>
                                <select value={programId} onChange={(e) => setProgramId(e.target.value)} required
                                    className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-3">
                            <label className="text-xs font-medium text-text-muted">Preferred Age Group / Cohort</label>
                            <select value={preferredCohortLabel} onChange={(e) => setPreferredCohortLabel(e.target.value)}
                                className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                <option value="">Not sure - let the academy advise</option>
                                {cohorts.map((c) => <option key={c.id} value={c.label}>{c.label}</option>)}
                            </select>
                        </div>
                        <label className="flex items-center gap-2 mt-3 text-sm text-text">
                            <input type="checkbox" checked={kitOptIn} onChange={(e) => setKitOptIn(e.target.checked)} className="rounded border-border" />
                            I'd like to add a kit
                        </label>
                    </div>

                    <div className="border-t border-border pt-4">
                        <label className="text-xs font-medium text-text-muted flex items-center gap-1.5">
                            <MessageCircleQuestion className="w-3.5 h-3.5" /> Anything else we should know? (optional)
                        </label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2}
                            className="w-full mt-1 text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" />
                    </div>

                    <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                        Submit Registration Request
                    </button>
                </form>
            </div>
        </div>
    );
}
