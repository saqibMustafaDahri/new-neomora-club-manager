import { useState, useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { selectScopedStudents, selectScopedRegistrations } from '../../store/selectors';
import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import type { Student } from '../../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TERM_BADGE_STYLE: Record<string, string> = {
  Paid: 'bg-success/10 text-success border-success/30',
  Partial: 'bg-warning/10 text-warning border-warning/30',
  Unpaid: 'bg-danger/10 text-danger border-danger/30',
};

export function Roster() {
  const { families, cohorts, invoices, payments, sessionEnrollments, sessionTemplates, pitches, terms } = useDataStore();
  const students = selectScopedStudents();
  const scopedRegistrations = selectScopedRegistrations();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Combine the student with ALL of their registrations (not just one arbitrary "active" one -
  // a student can have up to 3, one per term, and all of them carry status 'active' in this data,
  // so picking just the first match silently hid the other terms' cohort/payment info).
  const tableData = useMemo(() => {
    return students.map(student => {
      const studentRegs = scopedRegistrations.filter(r => r.studentId === student.id && r.status === 'active');
      const family = families.find(f => f.id === student.familyId);

      const termBadges = studentRegs.map(reg => {
        const term = terms.find(t => t.id === reg.termId);
        const invoice = invoices.find(i => i.registrationId === reg.id);
        const paidTotal = invoice ? payments.filter(p => p.invoiceId === invoice.id).reduce((sum, p) => sum + p.amount, 0) : 0;
        const total = invoice?.total ?? 0;
        let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
        if (invoice) {
          if (paidTotal >= total - 0.01) status = 'Paid';
          else if (paidTotal > 0) status = 'Partial';
        }
        return { registrationId: reg.id, termNo: term?.termNo ?? 0, status, total, paid: paidTotal };
      }).sort((a, b) => a.termNo - b.termNo);

      const distinctCohorts = Array.from(new Set(studentRegs.map(reg => cohorts.find(c => c.id === reg.cohortId)?.label).filter(Boolean)));
      const totalAll = termBadges.reduce((s, t) => s + t.total, 0);
      const paidAll = termBadges.reduce((s, t) => s + t.paid, 0);
      let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'No Invoice' = 'No Invoice';
      if (termBadges.length > 0) {
        if (paidAll >= totalAll - 0.01) paymentStatus = 'Paid';
        else if (paidAll > 0) paymentStatus = 'Partial';
        else paymentStatus = 'Unpaid';
      }

      return {
        ...student,
        family,
        studentRegs,
        termBadges,
        cohortName: distinctCohorts.join(', ') || 'None',
        contact: family ? `${family.guardianName} (${family.phonePrimary})` : 'Unknown',
        paymentStatus
      };
    });
  }, [students, scopedRegistrations, families, cohorts, invoices, payments, terms]);

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'name', label: 'Name' },
    { key: 'dob', label: 'DOB' },
    { key: 'cohortName', label: 'Cohort' },
    { key: 'contact', label: 'Contact' },
    {
      key: 'termBadges', label: 'Terms', sortable: false,
      render: (_, row) => (
        <div className="flex gap-1">
          {row.termBadges.length === 0 ? (
            <span className="text-xs text-text-muted">—</span>
          ) : row.termBadges.map(t => (
            <span
              key={t.registrationId}
              title={`Term ${t.termNo}: ${t.status} - SAR ${t.total.toFixed(2)}`}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TERM_BADGE_STYLE[t.status]}`}
            >
              T{t.termNo}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (val) => {
        let variant: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';
        if (val === 'Paid') variant = 'success';
        if (val === 'Partial') variant = 'warning';
        if (val === 'Unpaid') variant = 'danger';
        return <Badge variant={variant}>{String(val)}</Badge>;
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
      key: 'paymentStatus',
      label: 'payment statuses',
      options: [
        { value: 'Paid', label: 'Paid' },
        { value: 'Partial', label: 'Partial' },
        { value: 'Unpaid', label: 'Unpaid' },
        { value: 'No Invoice', label: 'No Invoice' },
      ],
    },
  ], [cohorts]);

  // Derive enrollments across ALL of the selected student's registrations, not just one term
  const selectedStudentSessions = useMemo(() => {
    if (!selectedStudent) return [];
    const studentRegs = scopedRegistrations.filter(r => r.studentId === selectedStudent.id && r.status === 'active');
    const regIds = new Set(studentRegs.map(r => r.id));
    const enrollments = sessionEnrollments.filter(e => regIds.has(e.registrationId));
    const seenTemplateIds = new Set<string>();
    return enrollments.map(e => {
      if (seenTemplateIds.has(e.sessionTemplateId)) return null; // same weekly slot across terms - show once
      seenTemplateIds.add(e.sessionTemplateId);
      const template = sessionTemplates.find(t => t.id === e.sessionTemplateId);
      if (!template) return null;
      const pitch = pitches.find(p => p.id === template.pitchId);
      return {
        ...template,
        pitchName: pitch?.name || 'Unknown Pitch'
      };
    }).filter(Boolean) as (typeof sessionTemplates[0] & { pitchName: string })[];
  }, [selectedStudent, scopedRegistrations, sessionEnrollments, sessionTemplates, pitches]);

  const selectedRow = tableData.find(t => t.id === selectedStudent?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Roster</h1>
        <p className="text-text-muted mt-1">View student roster and enrollments.</p>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={tableData}
          onRowClick={(row) => setSelectedStudent(row)}
          searchPlaceholder="Search students or guardians..."
          searchKeys={['name', 'contact', 'cohortName']}
          filters={filters}
          pageSize={20}
        />
      </div>

      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-6 py-2">
            <div>
              <h3 className="text-lg font-semibold text-text">{selectedStudent.name}</h3>
              <p className="text-sm text-text-muted">DOB: {selectedStudent.dob}</p>
            </div>

            {selectedRow && selectedRow.termBadges.length > 0 && (
              <div className="space-y-2 border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-text uppercase tracking-wider">Terms</h4>
                <div className="space-y-1.5">
                  {selectedRow.termBadges.map(t => (
                    <div key={t.registrationId} className="flex items-center justify-between text-sm">
                      <span className="text-text">Term {t.termNo}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-text-muted">SAR {t.total.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${TERM_BADGE_STYLE[t.status]}`}>{t.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-text uppercase tracking-wider">Weekly Sessions</h4>

              {selectedStudentSessions.length > 0 ? (
                <div className="space-y-2">
                  {selectedStudentSessions.map(session => (
                    <div key={session.id} className="p-3 rounded-lg border border-border bg-surface-muted/30 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-text">{DAYS[session.dayOfWeek]}</p>
                        <p className="text-xs text-text-muted">{session.startTime} - {session.endTime}</p>
                      </div>
                      <Badge variant="neutral">{session.pitchName}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">This student is not enrolled in any sessions.</p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-surface-muted border border-border rounded-md text-sm font-medium hover:bg-border/50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
