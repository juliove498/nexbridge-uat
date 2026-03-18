import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: boolean;
}

export function Card({ children, accent = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-[var(--radius-lg-compat)] p-8 relative shadow-sm',
        accent && "before:content-[''] before:absolute before:top-0 before:left-6 before:right-6 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-[var(--orange-light)] before:rounded-b-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
