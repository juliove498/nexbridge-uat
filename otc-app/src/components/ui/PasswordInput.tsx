import { useState, type InputHTMLAttributes, forwardRef } from 'react';
import { checkPasswordRules } from '../../lib/validation';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showStrength = false, value = '', className = '', id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const rules = showStrength ? checkPasswordRules(String(value)) : [];

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full py-3 px-4 pr-11 bg-secondary border border-border rounded-[var(--radius-md-compat)] text-foreground text-sm outline-none transition-all duration-200',
              'placeholder:text-[var(--text-tertiary)]',
              'focus:border-primary focus:bg-accent focus:shadow-[0_0_0_3px_var(--orange-subtle)]',
              error && 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_var(--error-bg)]'
            )}
            value={value}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[var(--text-tertiary)] cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-muted-foreground"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {showStrength && String(value).length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
            {rules.map((r) => (
              <span key={r.label} className={cn('text-[11px]', r.met ? 'text-[var(--success)]' : 'text-[var(--text-tertiary)]')}>
                {r.met ? '✓' : '○'} {r.label}
              </span>
            ))}
          </div>
        )}
        {error && <span className="text-xs text-[var(--error)]">{error}</span>}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
