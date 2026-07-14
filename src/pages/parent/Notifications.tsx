import { Megaphone, Calendar, CreditCard, Info } from 'lucide-react';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 'n1',
    icon: Calendar,
    tone: 'primary' as const,
    title: 'Term 3 schedule confirmed',
    body: 'Sessions for Term 3 are now live on your child\u2019s schedule. Please check timings, as a few slots moved by 15 minutes.',
    date: '2 days ago',
  },
  {
    id: 'n2',
    icon: CreditCard,
    tone: 'warning' as const,
    title: 'Payment reminder',
    body: 'A friendly reminder that outstanding balances for Term 3 are due by the end of this month.',
    date: '4 days ago',
  },
  {
    id: 'n3',
    icon: Megaphone,
    tone: 'primary' as const,
    title: 'Kit collection now open',
    body: 'Kits for students who opted in are ready for collection at the front desk during regular session hours.',
    date: '1 week ago',
  },
  {
    id: 'n4',
    icon: Info,
    tone: 'neutral' as const,
    title: 'Public holiday - no sessions',
    body: 'There will be no sessions at either location on the upcoming public holiday. All sessions resume the following week as normal.',
    date: '2 weeks ago',
  },
];

const TONE_STYLES: Record<'primary' | 'warning' | 'neutral', string> = {
  primary: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning',
  neutral: 'bg-surface-muted text-text-muted',
};

export function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Notifications</h1>
        <p className="text-text-muted mt-1">Announcements from your academy.</p>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm divide-y divide-border overflow-hidden">
        {SAMPLE_NOTIFICATIONS.map((n) => (
          <div key={n.id} className="px-5 py-4 flex items-start gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TONE_STYLES[n.tone]}`}>
              <n.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-text">{n.title}</p>
                <span className="text-xs text-text-muted shrink-0">{n.date}</span>
              </div>
              <p className="text-sm text-text-muted mt-1">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
