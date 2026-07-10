// Generic placeholder page used for all "coming soon" routes
interface PlaceholderProps {
  title: string;
  description?: string;
}

export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h1 className="text-lg font-semibold text-text">{title}</h1>
        </div>
        <div className="px-6 py-12 flex flex-col items-center gap-3 text-center bg-surface-muted/20">
          <p className="text-text-muted text-sm">
            {description ?? 'This screen is coming soon. Routing and navigation are confirmed working.'}
          </p>
        </div>
      </div>
    </div>
  );
}
