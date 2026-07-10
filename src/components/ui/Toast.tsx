import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 5000);
  }, [remove]);

  const success = useCallback((message: string) => toast(message, 'success'), [toast]);
  const error = useCallback((message: string) => toast(message, 'error'), [toast]);
  const info = useCallback((message: string) => toast(message, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-danger" />,
    info: <Info className="w-5 h-5 text-primary" />,
  };

  const borders = {
    success: 'border-success/30',
    error: 'border-danger/30',
    info: 'border-primary/30',
  };

  return (
    <div className={clsx(
      "pointer-events-auto bg-surface border shadow-lg rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-8 duration-300",
      borders[toast.type]
    )}>
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-text">{toast.message}</p>
      <button
        onClick={onRemove}
        className="text-text-muted hover:text-text hover:bg-surface-muted rounded p-0.5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
