import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { DataTable, type Column, type FilterConfig } from '../../components/ui/DataTable';

const mockStudents = [
    {
        id: 1,
        studentName: 'Mariam Khan',
        gender: 'female',
        guardianName: 'Fahad Khan',
        guardianPhone: '+966 56 731 1184',
        program: 'Swimming Academy',
        branch: 'Jeddah',
        term: 'Jeddah Summer 2026',
        joinDate: '05 Jul 2026',
        total: 2132.10,
        paid: 1000.00,
        balance: 1132.10,
        status: 'Partial'
    },
    {
        id: 2,
        studentName: 'Yousef Al Salem',
        gender: 'male',
        guardianName: 'Noura Al Salem',
        guardianPhone: '+966 54 212 8702',
        program: 'Basketball Academy',
        branch: 'Riyadh',
        term: 'Riyadh Summer 2026',
        joinDate: '21 Jun 2026',
        total: 5089.33,
        paid: 0.00,
        balance: 5089.33,
        status: 'Unpaid'
    },
    {
        id: 3,
        studentName: 'Lina Al Harbi',
        gender: 'female',
        guardianName: 'Khalid Al Harbi',
        guardianPhone: '+966 55 410 2291',
        program: 'Swimming Academy',
        branch: 'Jeddah',
        term: 'Jeddah Summer 2026',
        joinDate: '14 Jun 2026',
        total: 2528.85,
        paid: 1400.00,
        balance: 1128.85,
        status: 'Partial'
    },
    {
        id: 4,
        studentName: 'Omar Al Harbi',
        gender: 'male',
        guardianName: 'Khalid Al Harbi',
        guardianPhone: '+966 55 410 2291',
        program: 'Football Academy',
        branch: 'Jeddah',
        term: 'Jeddah Summer 2026',
        joinDate: '07 Jun 2026',
        total: 3316.60,
        paid: 3316.60,
        balance: 0.00,
        status: 'Paid'
    }

];

import { Link } from 'react-router-dom';

export function Register() {
    // Compute metric totals
    const totalInvoiced = mockStudents.reduce((sum, s) => sum + s.total, 0);
    const totalCollected = mockStudents.reduce((sum, s) => sum + s.paid, 0);
    const totalOutstanding = mockStudents.reduce((sum, s) => sum + s.balance, 0);

    const filters: FilterConfig[] = useMemo(() => [
        {
            key: 'branch',
            label: 'locations',
            options: [
                { value: 'Jeddah', label: 'Jeddah' },
                { value: 'Riyadh', label: 'Riyadh' }
            ]
        },
        {
            key: 'program',
            label: 'programs',
            options: [
                { value: 'Swimming Academy', label: 'Swimming Academy' },
                { value: 'Basketball Academy', label: 'Basketball Academy' },
                { value: 'Football Academy', label: 'Football Academy' }
            ]
        },
        {
            key: 'status',
            label: 'payment statuses',
            options: [
                { value: 'Partial', label: 'Partial' },
                { value: 'Unpaid', label: 'Unpaid' },
                { value: 'Paid', label: 'Paid' }
            ]
        }
    ], []);

    const columns: Column<typeof mockStudents[0]>[] = useMemo(() => [
        {
            key: 'studentName',
            label: 'STUDENT',
            render: (_, row) => (
                <div>
                    <div className="font-semibold text-text">{row.studentName}</div>
                    <div className="text-xs text-text-muted mt-0.5">{row.gender}</div>
                </div>
            )
        },
        {
            key: 'guardianName',
            label: 'GUARDIAN',
            render: (_, row) => (
                <div>
                    <div className="text-text">{row.guardianName}</div>
                    <div className="text-xs text-text-muted mt-0.5">{row.guardianPhone}</div>
                </div>
            )
        },
        {
            key: 'program',
            label: 'PROGRAM',
            render: (val) => <span className="font-semibold text-text">{String(val)}</span>
        },
        {
            key: 'branch',
            label: 'BRANCH / TERM',
            render: (_, row) => (
                <div>
                    <div className="text-text">{row.branch}</div>
                    <div className="text-xs text-text-muted mt-0.5">{row.term}</div>
                </div>
            )
        },
        { key: 'joinDate', label: 'JOIN DATE' },
        {
            key: 'total',
            label: 'TOTAL',
            render: (val) => <span className="font-bold text-text">SAR {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'paid',
            label: 'PAID',
            render: (val) => <span className="font-bold text-success">SAR {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'balance',
            label: 'BALANCE',
            render: (val) => <span className="font-bold text-danger">SAR {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'status',
            label: 'STATUS',
            render: (val) => {
                const s = String(val);
                let colorClass = '';
                if (s === 'Partial') colorClass = 'bg-warning/10 text-warning border-warning/20';
                else if (s === 'Unpaid') colorClass = 'bg-danger/10 text-danger border-danger/20';
                else if (s === 'Paid') colorClass = 'bg-success/10 text-success border-success/20';

                return (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
                        {s}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => {
                if (row.status === 'Paid') {
                    return <div className="text-right"><span className="text-xs text-text-muted font-medium">Settled</span></div>;
                }
                return (
                    <div className="text-right">
                        <button className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                            Record payment
                        </button>
                    </div>
                );
            }
        }
    ], []);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text">Participants List</h1>
                    <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">
                        Search registrations across both branches, review invoice status and record preset payments without manually typing any fee or payment amount.
                    </p>
                </div>
                <Link to="/super-admin/register-form" className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    Register Student
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Registrations</p>
                    <p className="text-2xl font-bold text-text mt-2">{mockStudents.length}</p>
                    <p className="text-xs text-text-muted mt-1">Matching current filters</p>
                </div>
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Invoiced</p>
                    <p className="text-2xl font-bold text-text mt-2">SAR {totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-text-muted mt-1">Total calculated charges</p>
                </div>
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Collected</p>
                    <p className="text-2xl font-bold text-text mt-2">SAR {totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-text-muted mt-1">Recorded payments</p>
                </div>
                <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Outstanding</p>
                    <p className="text-2xl font-bold text-text mt-2">SAR {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-text-muted mt-1">Remaining balance</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
                <DataTable
                    columns={columns}
                    rows={mockStudents}
                    searchPlaceholder="Search student, guardian, phone or program"
                    searchKeys={['studentName', 'guardianName', 'guardianPhone', 'program']}
                    filters={filters}
                />
            </div>
        </div>
    );
}
