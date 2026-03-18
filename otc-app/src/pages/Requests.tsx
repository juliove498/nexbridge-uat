import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useRequests } from '../hooks/useApi';
import { cn } from '../lib/utils';

const STATUS_FILTERS = ['all', 'pending', 'processing', 'completed', 'cancelled'] as const;

const badgeClasses: Record<string, string> = {
  completed: 'bg-[var(--success-bg)] text-[var(--success)]',
  pending: 'bg-[var(--warning-bg)] text-[var(--warning)]',
  processing: 'bg-[var(--info-bg)] text-[var(--info)]',
  cancelled: 'bg-[var(--error-bg)] text-[var(--error)]',
};

export function Requests() {
  const { data: requests, isLoading, error } = useRequests();
  const [filter, setFilter] = useState<string>('all');

  const filtered = requests?.filter(
    (r) => filter === 'all' || r.status === filter,
  ) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold">OTC Requests</h1>
        <Link to="/otc-uat/requests/new">
          <Button size="sm">+ New Request</Button>
        </Link>
      </div>

      {error && <Alert>Failed to load requests: {error.message}</Alert>}

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={cn(
              'py-1.5 px-3.5 rounded-full bg-secondary border border-border text-muted-foreground text-xs font-medium cursor-pointer transition-all duration-200 hover:border-[var(--border-hover)] hover:text-foreground',
              filter === s && 'bg-[var(--orange-subtle)] border-[rgba(232,100,44,0.3)] text-primary',
            )}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <Card>
          <div className="flex flex-col">
            <div className="grid grid-cols-[1fr_0.6fr_1fr_1fr_1fr] py-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] border-b border-border">
              <span>Asset</span>
              <span>Side</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {filtered.map((req) => (
              <Link
                key={req.id}
                to={`/otc-uat/requests/${req.id}`}
                className="grid grid-cols-[1fr_0.6fr_1fr_1fr_1fr] py-3 px-3 text-[13px] text-muted-foreground no-underline border-b border-border transition-colors duration-200 hover:bg-secondary last:border-b-0"
              >
                <span className="font-medium text-foreground">{req.asset}</span>
                <span className={req.side === 'buy' ? 'text-[var(--success)] font-semibold' : 'text-[var(--error)] font-semibold'}>
                  {req.side.toUpperCase()}
                </span>
                <span>{req.amount.toLocaleString()}</span>
                <span className={cn(
                  'inline-block w-fit py-0.5 px-2.5 rounded-full text-[11px] font-semibold capitalize',
                  badgeClasses[req.status],
                )}>
                  {req.status}
                </span>
                <span className="text-[var(--text-tertiary)]">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-col items-center gap-3 p-8 text-center text-[var(--text-tertiary)]">
            <p>No requests {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
            <Link to="/otc-uat/requests/new">
              <Button size="sm">Create your first request</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
