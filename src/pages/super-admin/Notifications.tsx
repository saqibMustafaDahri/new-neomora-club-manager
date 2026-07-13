import { useMemo, useState } from 'react';
import { AlertTriangle, ListOrdered, MessageCircle, UserPlus, Banknote, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { Badge } from '../../components/ui/Badge';

type NotificationTone = 'warning' | 'danger' | 'info' | 'success';

interface NotificationItem {
  id: string;
  tone: NotificationTone;
  icon: typeof AlertTriangle;
  title: string;
  body: string;
  date: string | null;
  linkTo?: string;
  linkLabel?: string;
}

const TONE_STYLES: Record<NotificationTone, string> = {
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
};

export function Notifications() {
  const { registrations, invoices, payments, students, waitlistEntries, enquiries, cohorts } = useDataStore();
  const [tab, setTab] = useState<'alerts' | 'activity'>('alerts');

  const data = useMemo(() => {
    const studentById = new Map(students.map((s) => [s.id, s]));
    const invoiceByRegId = new Map(invoices.map((i) => [i.registrationId, i]));
    const paymentsByInvoiceId = new Map<string, number>();
    for (const p of payments) paymentsByInvoiceId.set(p.invoiceId, (paymentsByInvoiceId.get(p.invoiceId) ?? 0) + p.amount);

    // Real alert: invoices with an outstanding balance
    const outstandingRegs = registrations.filter((r) => {
      const inv = invoiceByRegId.get(r.id);
      if (!inv) return false;
      const paid = paymentsByInvoiceId.get(inv.id) ?? 0;
      return paid < inv.total - 0.01;
    });
    const outstandingTotal = outstandingRegs.reduce((sum, r) => {
      const inv = invoiceByRegId.get(r.id)!;
      const paid = paymentsByInvoiceId.get(inv.id) ?? 0;
      return sum + (inv.total - paid);
    }, 0);

    // Real alert: payments with no bank reference (unverified)
    const unverifiedPayments = payments.filter((p) => !p.bankRef);

    // Real alert: pending waitlist backlog
    const pendingWaitlist = waitlistEntries.filter((w) => w.status === 'pending');
    const cohortById = new Map(cohorts.map((c) => [c.id, c]));
    const waitlistByCohort = new Map<string, number>();
    for (const w of pendingWaitlist) {
      const label = w.cohortId ? cohortById.get(w.cohortId)?.label ?? 'Unknown' : 'Unknown';
      waitlistByCohort.set(label, (waitlistByCohort.get(label) ?? 0) + 1);
    }
    const biggestWaitlistCohort = Array.from(waitlistByCohort.entries()).sort((a, b) => b[1] - a[1])[0];

    // Real alert: new (uncontacted) WhatsApp/email enquiries
    const newEnquiries = enquiries.filter((e) => e.status === 'new');

    const alerts: NotificationItem[] = [];

    if (outstandingRegs.length > 0) {
      alerts.push({
        id: 'alert-outstanding',
        tone: 'danger',
        icon: AlertTriangle,
        title: `${outstandingRegs.length} invoice${outstandingRegs.length !== 1 ? 's' : ''} with an outstanding balance`,
        body: `SAR ${outstandingTotal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} owed across ${outstandingRegs.length} registration${outstandingRegs.length !== 1 ? 's' : ''}.`,
        date: null,
        linkTo: '/finance/invoices',
        linkLabel: 'Review invoices',
      });
    }

    if (unverifiedPayments.length > 0) {
      alerts.push({
        id: 'alert-unverified',
        tone: 'warning',
        icon: Banknote,
        title: `${unverifiedPayments.length} payments have no bank reference`,
        body: `These can't be reconciled against a bank statement until a reference is added.`,
        date: null,
        linkTo: '/finance/invoices',
        linkLabel: 'Review payments',
      });
    }

    if (pendingWaitlist.length > 0) {
      alerts.push({
        id: 'alert-waitlist',
        tone: 'warning',
        icon: ListOrdered,
        title: `${pendingWaitlist.length} students on the waitlist`,
        body: biggestWaitlistCohort
          ? `${biggestWaitlistCohort[1]} of them are waiting for a ${biggestWaitlistCohort[0]} spot.`
          : `Waiting for capacity to open up.`,
        date: null,
        linkTo: '/location-manager/waitlist',
        linkLabel: 'View waitlist',
      });
    }

    if (newEnquiries.length > 0) {
      alerts.push({
        id: 'alert-enquiries',
        tone: 'info',
        icon: MessageCircle,
        title: `${newEnquiries.length} enquiries not yet followed up`,
        body: `Received via WhatsApp, waiting on a first response.`,
        date: null,
        linkTo: '/super-admin/enquiries',
        linkLabel: 'View enquiries',
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 'alert-none',
        tone: 'success',
        icon: CheckCircle2,
        title: 'All clear',
        body: 'No outstanding balances, unverified payments, waitlist backlog, or unanswered enquiries.',
        date: null,
      });
    }

    // Real activity feed: most recent registrations and payments by date
    const activity: NotificationItem[] = [];
    const recentRegs = [...registrations]
      .filter((r) => r.joinDate)
      .sort((a, b) => b.joinDate.localeCompare(a.joinDate))
      .slice(0, 8);
    for (const r of recentRegs) {
      const student = studentById.get(r.studentId);
      activity.push({
        id: `reg-${r.id}`,
        tone: 'info',
        icon: UserPlus,
        title: `New registration: ${student?.name ?? 'Unknown'}`,
        body: `Joined on ${r.joinDate}`,
        date: r.joinDate,
      });
    }
    const recentPayments = [...payments]
      .filter((p) => p.paidDate)
      .sort((a, b) => b.paidDate.localeCompare(a.paidDate))
      .slice(0, 8);
    for (const p of recentPayments) {
      const inv = invoices.find((i) => i.id === p.invoiceId);
      const reg = inv ? registrations.find((r) => r.id === inv.registrationId) : undefined;
      const student = reg ? studentById.get(reg.studentId) : undefined;
      activity.push({
        id: `pay-${p.id}`,
        tone: 'success',
        icon: Banknote,
        title: `Payment received: SAR ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`,
        body: student ? `${student.name} · ${p.method.replace('_', ' ')}` : p.method.replace('_', ' '),
        date: p.paidDate,
      });
    }
    activity.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

    return { alerts, activity: activity.slice(0, 15) };
  }, [registrations, invoices, payments, students, waitlistEntries, enquiries, cohorts]);

  const items = tab === 'alerts' ? data.alerts : data.activity;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Notifications</h1>
        <p className="text-text-muted mt-1">Real-time alerts and recent activity across the academy.</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab('alerts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'alerts' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
        >
          Alerts {data.alerts[0]?.id !== 'alert-none' && <Badge variant="danger" size="sm">{data.alerts.length}</Badge>}
        </button>
        <button
          onClick={() => setTab('activity')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
        >
          Recent Activity
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm divide-y divide-border overflow-hidden">
        {items.map((n) => (
          <div key={n.id} className="px-5 py-4 flex items-start gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TONE_STYLES[n.tone]}`}>
              <n.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-text">{n.title}</p>
                {n.date && <span className="text-xs text-text-muted shrink-0">{n.date}</span>}
              </div>
              <p className="text-sm text-text-muted mt-1">{n.body}</p>
              {n.linkTo && (
                <Link to={n.linkTo} className="text-xs font-medium text-primary hover:underline mt-1.5 inline-block">
                  {n.linkLabel} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
