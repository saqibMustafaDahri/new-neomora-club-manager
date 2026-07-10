import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No Data Found',
  message = 'There are no records to display.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border rounded-lg min-h-[200px]">
      <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-text-muted" />
      </div>
      <h3 className="text-sm font-semibold text-text">{title}</h3>
      <p className="text-xs text-text-muted mt-1 max-w-sm">{message}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
