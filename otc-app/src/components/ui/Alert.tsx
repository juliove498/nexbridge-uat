import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const variantStyles = {
  error: 'bg-[var(--error-bg)] text-[var(--error)] border-[rgba(248,113,113,0.2)]',
  success: 'bg-[var(--success-bg)] text-[var(--success)] border-[rgba(16,185,129,0.2)]',
  warning: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[rgba(251,191,36,0.2)]',
  info: 'bg-[var(--info-bg)] text-[var(--info)] border-[rgba(59,130,246,0.2)]',
};

interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'error', children, className = '' }: AlertProps) {
  return (
    <div className={cn('py-3 px-4 rounded-[var(--radius-md-compat)] text-[13px] leading-relaxed border animate-fade-in', variantStyles[variant], className)}>
      {children}
    </div>
  );
}
