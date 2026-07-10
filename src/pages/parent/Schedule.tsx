import { useState, useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { selectFamilyStudents, selectFamilyRegistrations } from '../../store/selectors';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 14); // 14:00–22:00

export function ParentSchedule() {
  const { cohorts, pitches, locations, sessionEnrollments, sessionTemplates, attendances } = useDataStore();
  const familyStudents = selectFamilyStudents();
  const familyRegistrations = selectFamilyRegistrations();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(familyStudents[0]?.id ?? '');

  const selectedStudent = familyStudents.find(s => s.id === selectedStudentId);

  // All session templates for the selected student
  const studentSessions = useMemo(() => {
    if (!selectedStudentId) return [];
    const studentRegs = familyRegistrations.filter(r => r.studentId === selectedStudentId && r.status === 'active');
    const regIds = new Set(studentRegs.map(r => r.id));
    const studentEnrollments = sessionEnrollments.filter(e => regIds.has(e.registrationId));
    const templateIds = new Set(studentEnrollments.map(e => e.sessionTemplateId));

    return sessionTemplates.filter(t => templateIds.has(t.id)).map(t => {
      const cohort = cohorts.find(c => c.id === t.cohortId);
      const pitch = pitches.find(p => p.id === t.pitchId);
      const location = pitch ? locations.find(l => l.id === pitch.locationId) : null;

      // Attendance history for this enrollment
      const enrollment = studentEnrollments.find(e => e.sessionTemplateId === t.id);
      const history = enrollment
        ? attendances.filter(a => a.sessionEnrollmentId === enrollment.id)
            .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
        : [];

      return { ...t, cohortLabel: cohort?.label, pitchName: pitch?.name, locationName: location?.name, history, enrollmentId: enrollment?.id };
    });
  }, [selectedStudentId, familyRegistrations, sessionEnrollments, sessionTemplates, cohorts, pitches, locations, attendances]);

  // Build grid: map day+hour → sessions
  const grid = useMemo(() => {
    const map = new Map<string, typeof studentSessions[0][]>();
    studentSessions.forEach(s => {
      const hour = parseInt(s.startTime.split(':')[0], 10);
      const key = `${s.dayOfWeek}-${hour}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [studentSessions]);

  // All attendance history across all sessions for the selected student
  const allHistory = useMemo(() => {
    return studentSessions
      .flatMap(s => s.history.map(h => ({ ...h, sessionLabel: `${DAYS[s.dayOfWeek]} ${s.startTime}` })))
      .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
      .slice(0, 20);
  }, [studentSessions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Schedule</h1>
        <p className="text-text-muted mt-1">Your child's weekly schedule and attendance history.</p>
      </div>

      {/* Student selector tabs */}
      {familyStudents.length > 1 && (
        <div className="flex gap-2">
          {familyStudents.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStudentId === s.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {studentSessions.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
          <EmptyState message="No sessions enrolled for this student." />
        </div>
      ) : (
        <>
          {/* Weekly grid */}
          <div className="bg-surface rounded-lg border border-border shadow-sm overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-8 border-b border-border bg-surface-muted/30">
                <div className="p-3 border-r border-border" />
                {DAYS.map(d => (
                  <div key={d} className="p-3 text-center text-xs font-semibold text-text-muted border-r border-border last:border-0">{d}</div>
                ))}
              </div>
              {HOURS.map(hour => (
                <div key={hour} className="grid grid-cols-8 border-b border-border last:border-0 min-h-[70px]">
                  <div className="p-2 border-r border-border bg-surface-muted/10 text-xs font-medium text-text-muted text-center flex items-center justify-center">
                    {hour}:00
                  </div>
                  {DAYS.map((_, dayIdx) => {
                    const cells = grid.get(`${dayIdx}-${hour}`) || [];
                    return (
                      <div key={dayIdx} className="border-r border-border last:border-0 p-1.5 flex flex-col gap-1">
                        {cells.map(s => (
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

          {/* Attendance history */}
          <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="bg-surface-muted/30 px-5 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text">
                Recent Attendance — {selectedStudent?.name}
              </h3>
            </div>
            {allHistory.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-text-muted">No attendance records yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {allHistory.map(h => (
                  <div key={h.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-text">{h.sessionLabel}</p>
                      <p className="text-xs text-text-muted">{h.sessionDate}</p>
                    </div>
                    <Badge
                      variant={h.status === 'present' ? 'success' : h.status === 'excused' ? 'warning' : 'danger'}
                    >
                      {h.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
