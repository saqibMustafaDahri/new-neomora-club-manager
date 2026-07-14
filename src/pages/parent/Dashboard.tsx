import { useMemo } from 'react';
import { Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { selectFamilyStudents, selectFamilyRegistrations } from '../../store/selectors';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function daysUntilNext(dayOfWeek: number): number {
  const today = new Date().getDay();
  const diff = (dayOfWeek - today + 7) % 7;
  return diff === 0 ? 7 : diff; // if today, show next week's occurrence
}

export function ParentDashboard() {
  const { cohorts, locations, invoices, payments, sessionEnrollments, sessionTemplates, pitches } = useDataStore();
  const familyStudents = selectFamilyStudents();
  const familyRegistrations = selectFamilyRegistrations();

  const studentCards = useMemo(() => {
    return familyStudents.map(student => {
      const activeReg = familyRegistrations.find(r => r.studentId === student.id && r.status === 'active');
      const cohort = activeReg ? cohorts.find(c => c.id === activeReg.cohortId) : null;
      const location = locations.find(l => l.id === student.locationId);

      // Compute payment status
      let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'No Invoice' = 'No Invoice';
      if (activeReg) {
        const invoice = invoices.find(i => i.registrationId === activeReg.id);
        if (invoice) {
          const paid = payments.filter(p => p.invoiceId === invoice.id).reduce((s, p) => s + p.amount, 0);
          if (paid >= invoice.total) paymentStatus = 'Paid';
          else if (paid > 0) paymentStatus = 'Partial';
          else paymentStatus = 'Unpaid';
        }
      }

      // Find next upcoming session
      let nextSession: { day: string; time: string; pitch: string } | null = null;
      if (activeReg) {
        const enrollments = sessionEnrollments.filter(e => {
          const reg = familyRegistrations.find(r => r.id === e.registrationId);
          return reg?.studentId === student.id;
        });
        const templates = enrollments
          .map(e => sessionTemplates.find(t => t.id === e.sessionTemplateId))
          .filter(Boolean) as typeof sessionTemplates;

        if (templates.length > 0) {
          const sorted = [...templates].sort((a, b) => daysUntilNext(a.dayOfWeek) - daysUntilNext(b.dayOfWeek));
          const next = sorted[0];
          const pitch = pitches.find(p => p.id === next.pitchId);
          nextSession = {
            day: DAYS[next.dayOfWeek],
            time: `${next.startTime} – ${next.endTime}`,
            pitch: pitch?.name || 'Unknown Pitch'
          };
        }
      }

      return { student, cohort, location, paymentStatus, nextSession };
    });
  }, [familyStudents, familyRegistrations, cohorts, locations, invoices, payments, sessionEnrollments, sessionTemplates, pitches]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Family Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of your children's programmes.</p>
      </div>

      {studentCards.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
          <EmptyState message="No students registered in your family." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studentCards.map(({ student, cohort, location, paymentStatus, nextSession }) => (
            <Link
              to={`/parent/child/${student.id}`}
              key={student.id}
              className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-4 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer block"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{student.name}</h3>
                    <p className="text-xs text-text-muted">DOB: {student.dob}</p>
                  </div>
                </div>
                <Badge
                  variant={paymentStatus === 'Paid' ? 'success' : paymentStatus === 'Partial' ? 'warning' : paymentStatus === 'Unpaid' ? 'danger' : 'neutral'}
                >
                  {paymentStatus}
                </Badge>
              </div>

              {/* Info */}
              <div className="space-y-1.5 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{location?.name || 'No location'} · {cohort?.label || 'No cohort'}</span>
                </div>
                {nextSession ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Next: {nextSession.day} {nextSession.time} · {nextSession.pitch}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>No sessions enrolled</span>
                  </div>
                )}
              </div>

              {/* View profile affordance */}
              <div className="flex items-center justify-end gap-1 text-xs font-medium text-primary pt-1 border-t border-border">
                View profile
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
