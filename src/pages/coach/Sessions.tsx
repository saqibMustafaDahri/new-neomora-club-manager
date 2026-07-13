// import { useMemo } from 'react';
// import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
// import { useDataStore } from '../../store/dataStore';
// import { selectCoachSessions } from '../../store/selectors';
// import { EmptyState } from '../../components/ui/EmptyState';

// const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// export function Sessions() {
//   const { cohorts, pitches, locations, sessionEnrollments } = useDataStore();
//   const assignedSessions = selectCoachSessions();

//   const sessionCards = useMemo(() => {
//     return assignedSessions.map(session => {
//       const cohort = cohorts.find(c => c.id === session.cohortId);
//       const pitch = pitches.find(p => p.id === session.pitchId);
//       const location = pitch ? locations.find(l => l.id === pitch.locationId) : null;
//       const enrolledCount = sessionEnrollments.filter(e => e.sessionTemplateId === session.id).length;

//       return {
//         ...session,
//         cohortLabel: cohort?.label || 'Unknown Cohort',
//         pitchName: pitch?.name || 'Unknown Pitch',
//         locationName: location?.name || 'Unknown Location',
//         enrolledCount
//       };
//     }).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
//   }, [assignedSessions, cohorts, pitches, locations, sessionEnrollments]);

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-text">My Sessions</h1>
//         <p className="text-text-muted mt-1">Your assigned coaching sessions for this term.</p>
//       </div>

//       {sessionCards.length === 0 ? (
//         <div className="bg-surface rounded-lg border border-border shadow-sm p-12">
//           <EmptyState message="No sessions assigned to you yet." />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {sessionCards.map(session => (
//             <div
//               key={session.id}
//               className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all"
//             >
//               {/* Day pill */}
//               <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1">
//                 <CalendarDays className="w-3.5 h-3.5" />
//                 {DAYS[session.dayOfWeek]}
//               </div>

//               {/* Cohort name */}
//               <div>
//                 <h3 className="text-base font-bold text-text">{session.cohortLabel}</h3>
//               </div>

//               {/* Details */}
//               <div className="space-y-2 text-sm text-text-muted">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4 shrink-0" />
//                   <span>{session.startTime} – {session.endTime}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPin className="w-4 h-4 shrink-0" />
//                   <span>{session.pitchName} · {session.locationName}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4 shrink-0" />
//                   <span>{session.enrolledCount} enrolled / {session.capacity} capacity</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




import { useMemo } from 'react';
import { CalendarDays, Clock, MapPin, Users, LayoutGrid } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { selectCoachSessions } from '../../store/selectors';
import { EmptyState } from '../../components/ui/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Sessions() {
  const { cohorts, pitches, locations, sessionEnrollments } = useDataStore();
  const assignedSessions = selectCoachSessions();

  const todayDayOfWeek = new Date().getDay();

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

  // Group by day of week for a structured, agenda-style layout instead of one flat grid
  const sessionsByDay = useMemo(() => {
    const map = new Map<number, typeof sessionCards>();
    for (const s of sessionCards) {
      if (!map.has(s.dayOfWeek)) map.set(s.dayOfWeek, []);
      map.get(s.dayOfWeek)!.push(s);
    }
    return map;
  }, [sessionCards]);

  const stats = useMemo(() => {
    // enrolledCount is a count, not a set of IDs, so this is "enrollment slots" (a student in 2
    // sessions counts twice), not distinct students - flagged here rather than mislabeled.
    const totalSlots = sessionCards.reduce((sum, s) => sum + s.enrolledCount, 0);
    const locationsCovered = new Set(sessionCards.map((s) => s.locationName)).size;
    const todayCount = sessionCards.filter((s) => s.dayOfWeek === todayDayOfWeek).length;
    return { totalSessions: sessionCards.length, totalSlots, locationsCovered, todayCount };
  }, [sessionCards, todayDayOfWeek]);

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
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><LayoutGrid className="w-3.5 h-3.5" />Total Sessions</p>
              <p className="text-2xl font-bold text-text mt-1.5">{stats.totalSessions}</p>
            </div>
            <div className="bg-surface rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Enrollment Slots</p>
              <p className="text-2xl font-bold text-text mt-1.5">{stats.totalSlots}</p>
            </div>
            <div className="bg-surface rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Locations</p>
              <p className="text-2xl font-bold text-text mt-1.5">{stats.locationsCovered}</p>
            </div>
            <div className={`rounded-lg border p-4 ${stats.todayCount > 0 ? 'bg-primary/5 border-primary/30' : 'bg-surface border-border'}`}>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />Today ({DAYS[todayDayOfWeek]})</p>
              <p className={`text-2xl font-bold mt-1.5 ${stats.todayCount > 0 ? 'text-primary' : 'text-text'}`}>{stats.todayCount}</p>
            </div>
          </div>

          {/* Agenda grouped by day */}
          <div className="space-y-5">
            {DAYS.map((dayName, dayIdx) => {
              const daySessions = sessionsByDay.get(dayIdx);
              if (!daySessions || daySessions.length === 0) return null;
              const isToday = dayIdx === todayDayOfWeek;
              return (
                <div key={dayIdx} className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
                  <div className={`px-5 py-3 border-b border-border flex items-center gap-2 ${isToday ? 'bg-primary/10' : 'bg-surface-muted/30'}`}>
                    <CalendarDays className={`w-4 h-4 ${isToday ? 'text-primary' : 'text-text-muted'}`} />
                    <h3 className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-text'}`}>{dayName}</h3>
                    {isToday && <span className="text-xs font-medium text-primary bg-primary/15 px-2 py-0.5 rounded-full">Today</span>}
                    <span className="text-xs text-text-muted ml-auto">{daySessions.length} session{daySessions.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                    {daySessions.map(session => {
                      const utilization = session.capacity > 0 ? session.enrolledCount / session.capacity : 0;
                      return (
                        <div
                          key={session.id}
                          className="bg-surface-muted/10 rounded-lg border border-border p-4 space-y-3 hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <h4 className="text-base font-bold text-text">{session.cohortLabel}</h4>
                          <div className="space-y-1.5 text-sm text-text-muted">
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
                          <div className="w-full bg-surface-muted rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${utilization >= 1 ? 'bg-danger' : utilization >= 0.8 ? 'bg-warning' : 'bg-success'}`}
                              style={{ width: `${Math.min(100, utilization * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
