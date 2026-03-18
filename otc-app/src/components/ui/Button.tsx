import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const variantStyles = {
  primary: 'bg-gradient-to-br from-primary to-[var(--orange-light)] text-white shadow-[0_0_20px_var(--orange-glow)] hover:not-disabled:shadow-[0_0_30px_var(--orange-glow)] hover:not-disabled:-translate-y-px',
  secondary: 'bg-secondary text-foreground border border-border hover:not-disabled:bg-accent hover:not-disabled:border-[var(--border-hover)]',
  ghost: 'bg-transparent text-muted-foreground px-2! hover:not-disabled:text-foreground hover:not-disabled:bg-secondary',
  danger: 'bg-[var(--error-bg)] text-[var(--error)] border border-[var(--error-bg)] hover:not-disabled:border-[var(--error)]',
};

const sizeStyles = {
  sm: 'py-2 px-4 text-[13px]',
  md: 'py-3 px-6 text-sm',
  lg: 'py-3.5 px-8 text-[15px]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold border-0 rounded-[var(--radius-md-compat)] cursor-pointer transition-all duration-250 whitespace-nowrap relative disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />}
      {children}
    </button>
  );
}
