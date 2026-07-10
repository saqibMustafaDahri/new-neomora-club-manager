import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface Trend {
  value: number; // e.g. 12.5 for 12.5%
  direction: 'up' | 'down';
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: Trend;
  /** Highlight the icon with a tinted background. Defaults to 'primary'. */
  accent?: 'primary' | 'success' | 'warning' | 'danger';
}

const accentClasses: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function StatCard({ icon: Icon, label, value, trend, accent = 'primary' }: StatCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', accentClasses[accent])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold tracking-tight text-text leading-none">{value}</span>
        {trend && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 text-xs font-medium pb-0.5',
              trend.direction === 'up' ? 'text-success' : 'text-danger',
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
