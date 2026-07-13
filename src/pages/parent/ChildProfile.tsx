import { useMemo, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Upload, FileText, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { selectFamilyStudents, selectFamilyRegistrations } from '../../store/selectors';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 14); // 14:00–22:00

interface DocSlot {
  key: 'idCopy' | 'medicalForm';
  label: string;
  hint: string;
}

const DOC_SLOTS: DocSlot[] = [
  { key: 'idCopy', label: 'ID Copy', hint: 'National ID, Iqama, or passport photo page' },
  { key: 'medicalForm', label: 'Medical Form', hint: 'Signed medical/consent form, photographed or scanned' },
];

export function ChildProfile() {
  const { studentId } = useParams<{ studentId: string }>();
  const { cohorts, locations, invoices, payments, sessionEnrollments, sessionTemplates, pitches, attendances } = useDataStore();
  const familyStudents = selectFamilyStudents();
  const familyRegistrations = selectFamilyRegistrations();

  // Document upload state - client-side only for this demo, not persisted to the store
  // (there's no Document entity in the current schema; wiring this to a real backend
  // would need a new type + storage layer, not just a UI change).
  const [docs, setDocs] = useState<Record<string, { fileName: string; previewUrl: string | null }>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const student = familyStudents.find((s) => s.id === studentId);

  const activeReg = useMemo(
    () => familyRegistrations.find((r) => r.studentId === studentId && r.status === 'active'),
    [familyRegistrations, studentId]
  );
  const cohort = activeReg ? cohorts.find((c) => c.id === activeReg.cohortId) : null;
  const location = student ? locations.find((l) => l.id === student.locationId) : null;

  const paymentStatus = useMemo(() => {
    if (!activeReg) return 'No Invoice';
    const invoice = invoices.find((i) => i.registrationId === activeReg.id);
    if (!invoice) return 'No Invoice';
    const paid = payments.filter((p) => p.invoiceId === invoice.id).reduce((s, p) => s + p.amount, 0);
    if (paid >= invoice.total) return 'Paid';
    if (paid > 0) return 'Partial';
    return 'Unpaid';
  }, [activeReg, invoices, payments]);

  // This student's session templates (schedule)
  const studentSessions = useMemo(() => {
    if (!studentId) return [];
    const studentRegs = familyRegistrations.filter((r) => r.studentId === studentId && r.status === 'active');
    const regIds = new Set(studentRegs.map((r) => r.id));
    const studentEnrollments = sessionEnrollments.filter((e) => regIds.has(e.registrationId));
    const templateIds = new Set(studentEnrollments.map((e) => e.sessionTemplateId));

    return sessionTemplates.filter((t) => templateIds.has(t.id)).map((t) => {
      const c = cohorts.find((c) => c.id === t.cohortId);
      const pitch = pitches.find((p) => p.id === t.pitchId);
      const loc = pitch ? locations.find((l) => l.id === pitch.locationId) : null;
      const enrollment = studentEnrollments.find((e) => e.sessionTemplateId === t.id);
      const history = enrollment
        ? attendances.filter((a) => a.sessionEnrollmentId === enrollment.id).sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
        : [];
      return { ...t, cohortLabel: c?.label, pitchName: pitch?.name, locationName: loc?.name, history };
    });
  }, [studentId, familyRegistrations, sessionEnrollments, sessionTemplates, cohorts, pitches, locations, attendances]);

  const grid = useMemo(() => {
    const map = new Map<string, typeof studentSessions[0][]>();
    studentSessions.forEach((s) => {
      const hour = parseInt(s.startTime.split(':')[0], 10);
      const key = `${s.dayOfWeek}-${hour}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [studentSessions]);

  const allHistory = useMemo(() => {
    return studentSessions
      .flatMap((s) => s.history.map((h) => ({ ...h, sessionLabel: `${DAYS[s.dayOfWeek]} ${s.startTime}` })))
      .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
      .slice(0, 20);
  }, [studentSessions]);

  function handleFileSelect(key: string, file: File | undefined) {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(file) : null;
    setDocs((prev) => ({ ...prev, [key]: { fileName: file.name, previewUrl } }));
  }

  function removeDoc(key: string) {
    setDocs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const input = fileInputRefs.current[key];
    if (input) input.value = '';
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Link to="/parent/dashboard" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
          <EmptyState message="Student not found." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/parent/dashboard" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Child header */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-text">{student.name}</h1>
            <Badge variant={paymentStatus === 'Paid' ? 'success' : paymentStatus === 'Partial' ? 'warning' : paymentStatus === 'Unpaid' ? 'danger' : 'neutral'}>
              {paymentStatus}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-text-muted">
            <span>DOB: {student.dob || 'Unknown'}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{location?.name || 'No location'} · {cohort?.label || 'No cohort'}</span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="bg-surface-muted/30 px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text">Weekly Schedule</h3>
        </div>
        {studentSessions.length === 0 ? (
          <div className="p-8">
            <EmptyState message="No sessions enrolled for this student." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-8 border-b border-border bg-surface-muted/30">
                <div className="p-3 border-r border-border" />
                {DAYS.map((d) => (
                  <div key={d} className="p-3 text-center text-xs font-semibold text-text-muted border-r border-border last:border-0">{d}</div>
                ))}
              </div>
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-border last:border-0 min-h-[70px]">
                  <div className="p-2 border-r border-border bg-surface-muted/10 text-xs font-medium text-text-muted text-center flex items-center justify-center">
                    {hour}:00
                  </div>
                  {DAYS.map((_, dayIdx) => {
                    const cells = grid.get(`${dayIdx}-${hour}`) || [];
                    return (
                      <div key={dayIdx} className="border-r border-border last:border-0 p-1.5 flex flex-col gap-1">
                        {cells.map((s) => (
                          <div key={s.id} className="bg-primary/10 border border-primary/20 rounded p-1.5 text-xs">
                            <p className="font-semibold text-primary truncate">{s.cohortLabel}</p>
                            <p className="text-text-muted">{s.startTime}–{s.endTime}</p>
                            <p className="text-text-muted truncate">{s.pitchName}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attendance history */}
      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="bg-surface-muted/30 px-5 py-3 border-b border-border flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Attendance History</h3>
        </div>
        {allHistory.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-muted">No attendance records yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {allHistory.map((h) => (
              <div key={h.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text">{h.sessionLabel}</p>
                  <p className="text-xs text-text-muted">{h.sessionDate}</p>
                </div>
                <Badge variant={h.status === 'present' ? 'success' : h.status === 'excused' ? 'warning' : 'danger'}>
                  {h.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="bg-surface-muted/30 px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text">Documents</h3>
          <p className="text-xs text-text-muted mt-0.5">Upload a photo or scan for each document. Stored for this session only in this demo.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOC_SLOTS.map((slot) => {
            const doc = docs[slot.key];
            return (
              <div key={slot.key} className="border border-dashed border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-text">{slot.label}</p>
                    <p className="text-xs text-text-muted">{slot.hint}</p>
                  </div>
                  {doc && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                </div>

                {doc ? (
                  <div className="flex items-center gap-3 bg-surface-muted/20 rounded-md p-3">
                    {doc.previewUrl ? (
                      <img src={doc.previewUrl} alt={slot.label} className="w-14 h-14 rounded-md object-cover border border-border shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-surface-muted flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text truncate">{doc.fileName}</p>
                      <p className="text-xs text-success">Uploaded</p>
                    </div>
                    <button
                      onClick={() => removeDoc(slot.key)}
                      className="p-1.5 text-text-muted hover:text-danger transition-colors shrink-0"
                      aria-label={`Remove ${slot.label}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRefs.current[slot.key]?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-md bg-surface-muted/10 hover:bg-surface-muted/30 transition-colors text-text-muted"
                  >
                    <div className="flex gap-2">
                      <Upload className="w-5 h-5" />
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">Click to upload</span>
                  </button>
                )}

                <input
                  ref={(el) => { fileInputRefs.current[slot.key] = el; }}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelect(slot.key, e.target.files?.[0])}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
