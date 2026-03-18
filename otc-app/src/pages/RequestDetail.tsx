import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useRequest, useDownloadPdf } from '../hooks/useApi';
import { cn } from '../lib/utils';

const badgeClasses: Record<string, string> = {
  completed: 'bg-[var(--success-bg)] text-[var(--success)]',
  pending: 'bg-[var(--warning-bg)] text-[var(--warning)]',
  processing: 'bg-[var(--info-bg)] text-[var(--info)]',
  cancelled: 'bg-[var(--error-bg)] text-[var(--error)]',
};

export function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: req, isLoading, error } = useRequest(id ?? '');
  const downloadPdf = useDownloadPdf(id ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !req) {
    return <Alert>Failed to load request: {error?.message ?? 'Not found'}</Alert>;
  }

  return (
    <div className="max-w-[700px] flex flex-col gap-6">
      <Link to="/otc-uat/requests" className="text-[13px] text-[var(--text-tertiary)] no-underline hover:text-primary">
        ← Back to Requests
      </Link>

      <h1 className="font-mono text-2xl font-bold">Request #{req.id.slice(0, 8)}</h1>

      <Card accent>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Asset</span>
            <span className="text-[15px] text-foreground">{req.asset}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Side</span>
            <span className={cn(
              'text-[15px] text-foreground',
              req.side === 'buy' ? 'text-[var(--success)]! font-semibold' : 'text-[var(--error)]! font-semibold',
            )}>
              {req.side.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Amount</span>
            <span className="text-[15px] text-foreground">{req.amount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Status</span>
            <span className={cn(
              'inline-block w-fit py-1 px-3 rounded-full text-xs font-semibold capitalize',
              badgeClasses[req.status],
            )}>
              {req.status}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Created</span>
            <span className="text-[15px] text-foreground">
              {new Date(req.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Updated</span>
            <span className="text-[15px] text-foreground">
              {new Date(req.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => downloadPdf.mutate()}
          loading={downloadPdf.isPending}
        >
          Download PDF
        </Button>
      </div>

      {downloadPdf.isError && (
        <Alert>Failed to download PDF: {downloadPdf.error.message}</Alert>
      )}
    </div>
  );
}
