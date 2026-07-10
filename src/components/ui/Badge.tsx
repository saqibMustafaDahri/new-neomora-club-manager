import clsx from 'clsx';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger:  'bg-danger/10  text-danger  border-danger/20',
  neutral: 'bg-text/10   text-text-muted border-text/10',
  info:    'bg-primary/10 text-primary  border-primary/20',
};

export function Badge({ variant, children, size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium border rounded-full whitespace-nowrap',
        variantClasses[variant],
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
      )}
    >
      {children}
    </span>
  );
}
