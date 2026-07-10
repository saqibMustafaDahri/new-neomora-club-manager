import { useId } from 'react';
import clsx from 'clsx';

interface FormFieldProps {
  label: string;
  error?: string;
  children: (id: string) => React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required }: FormFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      
      <div className={clsx(
        "[&_input]:w-full [&_input]:bg-background [&_input]:border [&_input]:rounded-md [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-text [&_input]:transition-all [&_input]:focus:outline-none [&_input]:focus:ring-1",
        "[&_select]:w-full [&_select]:bg-background [&_select]:border [&_select]:rounded-md [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_select]:text-text [&_select]:transition-all [&_select]:focus:outline-none [&_select]:focus:ring-1",
        "[&_textarea]:w-full [&_textarea]:bg-background [&_textarea]:border [&_textarea]:rounded-md [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:text-text [&_textarea]:transition-all [&_textarea]:focus:outline-none [&_textarea]:focus:ring-1",
        error 
          ? "[&_input]:border-danger [&_input]:focus:border-danger [&_input]:focus:ring-danger [&_select]:border-danger [&_select]:focus:border-danger [&_select]:focus:ring-danger [&_textarea]:border-danger [&_textarea]:focus:border-danger [&_textarea]:focus:ring-danger" 
          : "[&_input]:border-border [&_input]:focus:border-primary [&_input]:focus:ring-primary [&_select]:border-border [&_select]:focus:border-primary [&_select]:focus:ring-primary [&_textarea]:border-border [&_textarea]:focus:border-primary [&_textarea]:focus:ring-primary"
      )}>
        {children(id)}
      </div>

      {error && (
        <p className="text-xs text-danger font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
}
