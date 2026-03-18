import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-10 max-sm:p-5">
      <div className="w-full max-w-[420px] bg-card border border-border rounded-[var(--radius-xl-compat)] p-10 relative animate-fade-up shadow-lg max-sm:p-8">
        <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary to-[var(--orange-light)] rounded-b-sm" />
        <div className="flex items-center gap-2.5 mb-7">
          <img
            src="/otc-uat/nexbridge-icon-white.png"
            alt="NexBridge"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="font-mono text-lg font-bold text-foreground">NexBridge</span>
        </div>
        <h1 className="font-mono text-2xl font-bold text-foreground mb-1.5">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mb-1 leading-relaxed">{subtitle}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
