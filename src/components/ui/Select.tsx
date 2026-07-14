import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{ className, containerClassName, children, ...props },
	ref,
) {
	return (
		<div className={clsx('relative inline-flex', containerClassName)}>
			<select
				ref={ref}
				className={clsx(
					'w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-text shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60',
					className,
				)}
				{...props}
			>
				{children}
			</select>

			<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
		</div>
	);
});

