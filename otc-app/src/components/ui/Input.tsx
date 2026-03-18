import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full py-3 px-4 bg-secondary border border-border rounded-[var(--radius-md-compat)] text-foreground text-sm outline-none transition-all duration-200',
            'placeholder:text-[var(--text-tertiary)]',
            'focus:border-primary focus:bg-accent focus:shadow-[0_0_0_3px_var(--orange-subtle)]',
            error && 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_var(--error-bg)]'
          )}
          {...props}
        />
        {error && <span className="text-xs text-[var(--error)]">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
