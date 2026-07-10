import { useState, useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { selectScopedStudents, selectScopedRegistrations } from '../../store/selectors';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import type { Student, Registration } from '../../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Roster() {
  const { families, cohorts, invoices, payments, sessionEnrollments, sessionTemplates, pitches } = useDataStore();
  const students = selectScopedStudents();
  const scopedRegistrations = selectScopedRegistrations();
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // We want to combine the student with their active registration info for the table
  const tableData = useMemo(() => {
    return students.map(student => {
      const activeReg = scopedRegistrations.find(r => r.studentId === student.id && r.status === 'active');
      const family = families.find(f => f.id === student.familyId);
      const cohort = activeReg ? cohorts.find(c => c.id === activeReg.cohortId) : null;
      
      let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'No Invoice' = 'No Invoice';
      if (activeReg) {
        const invoice = invoices.find(i => i.registrationId === activeReg.id);
        if (invoice) {
          const paidTotal = payments.filter(p => p.invoiceId === invoice.id).reduce((sum, p) => sum + p.amount, 0);
          if (paidTotal >= invoice.total) paymentStatus = 'Paid';
          else if (paidTotal > 0) paymentStatus = 'Partial';
          else paymentStatus = 'Unpaid';
        }
      }

      return {
        ...student,
        family,
        activeReg,
        cohortName: cohort?.label || 'None',
        contact: family ? `${family.guardianName} (${family.phonePrimary})` : 'Unknown',
        paymentStatus
      };
    });
  }, [students, scopedRegistrations, families, cohorts, invoices, payments]);

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'name', label: 'Name' },
    { key: 'dob', label: 'DOB' },
    { key: 'cohortName', label: 'Cohort' },
    { key: 'contact', label: 'Contact' },
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

  // Derive the active enrollments for the selected student
  const selectedStudentSessions = useMemo(() => {
    if (!selectedStudent) return [];
    const activeReg = scopedRegistrations.find(r => r.studentId === selectedStudent.id && r.status === 'active');
    if (!activeReg) return [];

    const enrollments = sessionEnrollments.filter(e => e.registrationId === activeReg.id);
    return enrollments.map(e => {
      const template = sessionTemplates.find(t => t.id === e.sessionTemplateId);
      if (!template) return null;
      const pitch = pitches.find(p => p.id === template.pitchId);
      return {
        ...template,
        pitchName: pitch?.name || 'Unknown Pitch'
      };
    }).filter(Boolean) as (typeof sessionTemplates[0] & { pitchName: string })[];
  }, [selectedStudent, scopedRegistrations, sessionEnrollments, sessionTemplates, pitches]);

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

            <div className="space-y-3 border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-text uppercase tracking-wider">Active Sessions</h4>
              
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
