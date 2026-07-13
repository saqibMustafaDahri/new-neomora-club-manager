import { useState, useMemo } from 'react';
import { useDataStore, WaitlistEntryActions, RegistrationActions, SessionEnrollmentActions } from '../../store/dataStore';
import { selectScopedStudents, selectScopedSessionTemplates } from '../../store/selectors';
import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { FormField } from '../../components/ui/FormField';
import type { WaitlistEntry, SessionTemplate } from '../../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Waitlist() {
  const { waitlistEntries, cohorts, sessionEnrollments, registrations } = useDataStore();
  const { success } = useToast();
  
  const students = selectScopedStudents();
  const scopedSessionTemplates = selectScopedSessionTemplates();
  
  const [promotingEntry, setPromotingEntry] = useState<WaitlistEntry | null>(null);

  // Filter waitlist entries to only those belonging to students in our scoped locations
  const scopedWaitlist = useMemo(() => {
    const studentIds = new Set(students.map(s => s.id));
    return waitlistEntries.filter(w => studentIds.has(w.studentId));
  }, [waitlistEntries, students]);

  const tableData = useMemo(() => {
    return scopedWaitlist.map(entry => {
      const student = students.find(s => s.id === entry.studentId);
      const cohort = cohorts.find(c => c.id === entry.cohortId);

      // Check if ANY session template for this cohort has capacity
      const cohortSessions = scopedSessionTemplates.filter(t => t.cohortId === entry.cohortId);
      const availableSessions = cohortSessions.filter(session => {
        const currentEnrolled = sessionEnrollments.filter(e => e.sessionTemplateId === session.id).length;
        return currentEnrolled < session.capacity;
      });

      return {
        ...entry,
        studentName: student?.name || 'Unknown',
        cohortName: cohort?.label || 'Unknown',
        canPromote: entry.status === 'pending' && availableSessions.length > 0,
        availableSessions
      };
    });
  }, [scopedWaitlist, students, cohorts, scopedSessionTemplates, sessionEnrollments]);

  function handlePromoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!promotingEntry) return;


    const selectedSessionIds = Array.from(e.currentTarget.querySelectorAll('input[name="sessionIds"]:checked'))
        .map(input => (input as HTMLInputElement).value);
    
    if (selectedSessionIds.length === 0) {
      alert('Please select at least one session.');
      return;
    }

    // 1. Update WaitlistEntry status to admitted
    WaitlistEntryActions.update(promotingEntry.id, { status: 'admitted' });

    // 2. Find the registration (usually waitlisted status) and update to active
    // We assume the registration exists and is tied to this student & cohort
    const reg = registrations.find(r => r.studentId === promotingEntry.studentId && r.cohortId === promotingEntry.cohortId);
    if (reg) {
      RegistrationActions.update(reg.id, { status: 'active' });

      // 3. Create SessionEnrollments
      selectedSessionIds.forEach(sessionId => {
        SessionEnrollmentActions.add({
          id: `enroll_${Date.now()}_${Math.random()}`,
          registrationId: reg.id,
          sessionTemplateId: sessionId
        });
      });
      success('Student promoted and enrolled successfully!');
    } else {
      alert('Could not find corresponding registration for this waitlist entry.');
    }
    
    setPromotingEntry(null);
  }

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'position', label: 'Pos', width: '60px' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'cohortName', label: 'Cohort' },
    { key: 'requestedDate', label: 'Requested' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'pending' ? 'warning' : val === 'admitted' ? 'success' : 'neutral'}>
          {String(val)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (_, row) => {
        if (row.status !== 'pending') return null;

        if (row.canPromote) {
          return (
            <button
              onClick={() => setPromotingEntry(row)}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
            >
              Promote to Active
            </button>
          );
        }

        return (
          <div className="group relative inline-block">
            <button disabled className="px-3 py-1 bg-surface-muted text-text-muted text-xs font-medium rounded cursor-not-allowed">
              Promote to Active
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-text text-background text-xs rounded shadow-lg z-10 text-center">
              No sessions for this cohort have available capacity.
            </div>
          </div>
        );
      }
    }
  ];

  const filters: FilterConfig[] = useMemo(() => [
    {
      key: 'cohortName',
      label: 'cohorts',
      options: cohorts.map((cohort) => ({ value: cohort.label, label: cohort.label })),
    },
    {
      key: 'status',
      label: 'statuses',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'admitted', label: 'Admitted' },
      ],
    },
  ], [cohorts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Waitlist</h1>
        <p className="text-text-muted mt-1">Manage pending students and promote them when capacity allows.</p>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={tableData}
          searchPlaceholder="Search waitlist by name..."
          searchKeys={['studentName', 'cohortName']}
          filters={filters}
          pageSize={20}
        />
      </div>

      <Modal
        isOpen={!!promotingEntry}
        onClose={() => setPromotingEntry(null)}
        title="Promote Waitlisted Student"
      >
        {promotingEntry && (
          <form id="promote-form" onSubmit={handlePromoteSubmit} className="space-y-4 py-2">
            <p className="text-sm text-text-muted mb-4">
              Select which available sessions <strong>{tableData.find(d => d.id === promotingEntry.id)?.studentName}</strong> should be enrolled in.
            </p>
            
            <FormField label="Available Sessions" required>
              {() => (
                <div className="space-y-2 border border-border rounded-md p-3 max-h-48 overflow-y-auto">
                  {tableData.find(d => d.id === promotingEntry.id)?.availableSessions.map((session: SessionTemplate) => {
                    const enrolled = sessionEnrollments.filter(e => e.sessionTemplateId === session.id).length;
                    return (
                      <label key={session.id} className="flex items-center justify-between gap-2 p-2 hover:bg-surface-muted/30 rounded cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" name="sessionIds" value={session.id} className="rounded border-border text-primary focus:ring-primary" />
                          <span className="text-sm text-text font-medium">{DAYS[session.dayOfWeek]} {session.startTime}-{session.endTime}</span>
                        </div>
                        <Badge variant="info" size="sm">{enrolled} / {session.capacity} Full</Badge>
                      </label>
                    );
                  })}
                </div>
              )}
            </FormField>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => setPromotingEntry(null)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="promote-form"
                className="px-4 py-2 bg-success text-success-foreground rounded-md text-sm font-medium hover:bg-success/90 transition-colors shadow-sm"
              >
                Confirm Promotion
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
