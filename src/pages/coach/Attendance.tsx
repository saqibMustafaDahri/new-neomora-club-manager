import { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, MinusCircle, Save } from 'lucide-react';
import { useDataStore, AttendanceActions } from '../../store/dataStore';
import { selectCoachSessions } from '../../store/selectors';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Attendance } from '../../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
type AttendanceStatus = 'present' | 'absent' | 'excused';

export function AttendancePage() {
  const { cohorts, pitches, sessionEnrollments, registrations, students, attendances, terms } = useDataStore();
  const { success } = useToast();
  const assignedSessions = selectCoachSessions();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(assignedSessions[0]?.id ?? '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  // Local draft state: { [studentId]: status }
  const [draft, setDraft] = useState<Record<string, AttendanceStatus>>({});

  const selectedSession = useMemo(
    () => assignedSessions.find(s => s.id === selectedSessionId),
    [assignedSessions, selectedSessionId]
  );

  // Students enrolled in the selected session via sessionEnrollments → registrations → students
  const enrolledStudents = useMemo(() => {
    if (!selectedSession) return [];
    const enrollmentRegs = sessionEnrollments
      .filter(e => e.sessionTemplateId === selectedSession.id)
      .map(e => registrations.find(r => r.id === e.registrationId))
      .filter(Boolean);

    return enrollmentRegs.map(reg => {
      const student = students.find(s => s.id === reg!.studentId);
      return student || null;
    }).filter(Boolean) as typeof students;
  }, [selectedSession, sessionEnrollments, registrations, students]);

  // Seed draft from existing attendance records when session or date changes
  useEffect(() => {
    if (!selectedSession || enrolledStudents.length === 0) {
      setDraft({});
      return;
    }
    const newDraft: Record<string, AttendanceStatus> = {};
    enrolledStudents.forEach(student => {
      // Find enrollment for this student in this session
      const reg = registrations.find(r => r.studentId === student.id);
      if (!reg) return;
      const enrollment = sessionEnrollments.find(
        e => e.sessionTemplateId === selectedSession.id && e.registrationId === reg.id
      );
      if (!enrollment) return;
      const existing = attendances.find(
        a => a.sessionEnrollmentId === enrollment.id && a.sessionDate === selectedDate
      );
      newDraft[student.id] = existing?.status ?? 'present';
    });
    setDraft(newDraft);
  }, [selectedSession, selectedDate, enrolledStudents, attendances, registrations, sessionEnrollments]);

  function toggle(studentId: string, status: AttendanceStatus) {
    setDraft(prev => ({ ...prev, [studentId]: status }));
  }

  function handleSave() {
    if (!selectedSession) return;
    enrolledStudents.forEach(student => {
      const reg = registrations.find(r => r.studentId === student.id);
      if (!reg) return;
      const enrollment = sessionEnrollments.find(
        e => e.sessionTemplateId === selectedSession.id && e.registrationId === reg.id
      );
      if (!enrollment) return;

      const status = draft[student.id] ?? 'present';
      // Check if record already exists
      const existing = attendances.find(
        a => a.sessionEnrollmentId === enrollment.id && a.sessionDate === selectedDate
      );

      if (existing) {
        AttendanceActions.update(existing.id, { status });
      } else {
        AttendanceActions.add({
          id: `att_${enrollment.id}_${selectedDate}_${Date.now()}`,
          sessionEnrollmentId: enrollment.id,
          sessionDate: selectedDate,
          status
        } as Attendance);
      }
    });
    success('Attendance saved!');
  }

  // Attendance rollup: rate for this cohort across the current term
  const rollup = useMemo(() => {
    if (!selectedSession) return null;

    // Find current term for this session (via pitches → location → terms)
    const pitch = pitches.find(p => p.id === selectedSession.pitchId);
    if (!pitch) return null;
    const today = new Date().toISOString().split('T')[0];
    const currentTerm = terms.find(t => t.locationId === pitch.locationId && t.startDate <= today && t.endDate >= today);
    if (!currentTerm) return null;

    // All session enrollments for this session
    const sessionEnrollmentIds = sessionEnrollments
      .filter(e => e.sessionTemplateId === selectedSession.id)
      .map(e => e.id);

    // All attendance records for this session's enrollments within the current term date range
    const termAttendances = attendances.filter(
      a => sessionEnrollmentIds.includes(a.sessionEnrollmentId)
        && a.sessionDate >= currentTerm.startDate
        && a.sessionDate <= currentTerm.endDate
    );

    if (termAttendances.length === 0) return null;

    const presentCount = termAttendances.filter(a => a.status === 'present').length;
    const rate = Math.round((presentCount / termAttendances.length) * 100);
    return { rate, total: termAttendances.length, present: presentCount };
  }, [selectedSession, sessionEnrollments, attendances, pitches, terms]);

  // Decorators for the session select label
  const sessionLabel = (session: typeof assignedSessions[0]) => {
    const cohort = cohorts.find(c => c.id === session.cohortId);
    const pitch = pitches.find(p => p.id === session.pitchId);
    return `${DAYS[session.dayOfWeek]} ${session.startTime}–${session.endTime} · ${cohort?.label ?? ''} · ${pitch?.name ?? ''}`;
  };

  if (assignedSessions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Attendance</h1>
        </div>
        <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
          <EmptyState message="No sessions assigned to you." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Attendance</h1>
        <p className="text-text-muted mt-1">Mark attendance for your sessions.</p>
      </div>

      {/* Session + Date pickers */}
      <div className="bg-surface rounded-lg border border-border shadow-sm p-5 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Session</label>
          <select
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
            className="text-sm bg-red-400 border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {assignedSessions.map(s => (
              <option key={s.id} value={s.id}>{sessionLabel(s)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="text-sm bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Checklist */}
      {enrolledStudents.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
          <EmptyState message="No students enrolled in this session." />
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="bg-surface-muted/30 px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text">
              {enrolledStudents.length} Student{enrolledStudents.length !== 1 ? 's' : ''}
            </h2>
            <span className="text-xs text-text-muted">{selectedDate}</span>
          </div>

          <div className="divide-y divide-border">
            {enrolledStudents.map(student => {
              const status = draft[student.id] ?? 'present';
              return (
                <div key={student.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text">{student.name}</p>
                    <p className="text-xs text-text-muted">DOB: {student.dob}</p>
                  </div>
                  {/* Toggle buttons - Present / Excused / Absent */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggle(student.id, 'present')}
                      title="Present"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        status === 'present'
                          ? 'bg-success text-success-foreground shadow-sm'
                          : 'bg-surface-muted border border-border text-text-muted hover:border-success hover:text-success'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Present
                    </button>
                    <button
                      onClick={() => toggle(student.id, 'excused')}
                      title="Excused"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        status === 'excused'
                          ? 'bg-warning text-warning-foreground shadow-sm'
                          : 'bg-surface-muted border border-border text-text-muted hover:border-warning hover:text-warning'
                      }`}
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      Excused
                    </button>
                    <button
                      onClick={() => toggle(student.id, 'absent')}
                      title="Absent"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        status === 'absent'
                          ? 'bg-danger text-danger-foreground shadow-sm'
                          : 'bg-surface-muted border border-border text-text-muted hover:border-danger hover:text-danger'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save button */}
          <div className="px-5 py-4 border-t border-border bg-surface-muted/20 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Attendance
            </button>
          </div>
        </div>
      )}

      {/* Attendance rollup */}
      {rollup && (
        <div className="bg-surface rounded-lg border border-border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-text mb-3">Cohort Attendance – Current Term</h3>
          <div className="flex items-center gap-6">
            {/* Circular-ish progress */}
            <div className="flex flex-col items-center">
              <div className={`text-3xl font-bold ${rollup.rate >= 80 ? 'text-success' : rollup.rate >= 60 ? 'text-warning' : 'text-danger'}`}>
                {rollup.rate}%
              </div>
              <p className="text-xs text-text-muted mt-0.5">Attendance Rate</p>
            </div>
            <div className="flex-1 space-y-2 text-sm text-text-muted">
              <div className="flex justify-between">
                <span>Present sessions</span>
                <span className="font-medium text-text">{rollup.present}</span>
              </div>
              <div className="flex justify-between">
                <span>Total recorded</span>
                <span className="font-medium text-text">{rollup.total}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-surface-muted rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all ${rollup.rate >= 80 ? 'bg-success' : rollup.rate >= 60 ? 'bg-warning' : 'bg-danger'}`}
                  style={{ width: `${rollup.rate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
