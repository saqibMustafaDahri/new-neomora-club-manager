import { useMemo } from 'react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { selectCoachSessions } from '../../store/selectors';
import { EmptyState } from '../../components/ui/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Sessions() {
  const { cohorts, pitches, locations, sessionEnrollments } = useDataStore();
  const assignedSessions = selectCoachSessions();

  const sessionCards = useMemo(() => {
    return assignedSessions.map(session => {
      const cohort = cohorts.find(c => c.id === session.cohortId);
      const pitch = pitches.find(p => p.id === session.pitchId);
      const location = pitch ? locations.find(l => l.id === pitch.locationId) : null;
      const enrolledCount = sessionEnrollments.filter(e => e.sessionTemplateId === session.id).length;

      return {
        ...session,
        cohortLabel: cohort?.label || 'Unknown Cohort',
        pitchName: pitch?.name || 'Unknown Pitch',
        locationName: location?.name || 'Unknown Location',
        enrolledCount
      };
    }).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  }, [assignedSessions, cohorts, pitches, locations, sessionEnrollments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">My Sessions</h1>
        <p className="text-text-muted mt-1">Your assigned coaching sessions for this term.</p>
      </div>

      {sessionCards.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
          <EmptyState message="No sessions assigned to you yet." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessionCards.map(session => (
            <div
              key={session.id}
              className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all"
            >
              {/* Day pill */}
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {DAYS[session.dayOfWeek]}
              </div>

              {/* Cohort name */}
              <div>
                <h3 className="text-base font-bold text-text">{session.cohortLabel}</h3>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{session.startTime} – {session.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{session.pitchName} · {session.locationName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{session.enrolledCount} enrolled / {session.capacity} capacity</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
