import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useUserProfile, useSettings, useRequests } from '../hooks/useApi';

function badgeClass(status: string) {
  const map: Record<string, string> = {
    approved: 'bg-[var(--success-bg)] text-[var(--success)]',
    completed: 'bg-[var(--success-bg)] text-[var(--success)]',
    pending: 'bg-[var(--warning-bg)] text-[var(--warning)]',
    not_started: 'bg-[var(--warning-bg)] text-[var(--warning)]',
    rejected: 'bg-[var(--error-bg)] text-[var(--error)]',
    cancelled: 'bg-[var(--error-bg)] text-[var(--error)]',
    processing: 'bg-[var(--info-bg)] text-[var(--info)]',
  };
  return map[status] ?? '';
}

export function Dashboard() {
  const profile = useUserProfile();
  const settings = useSettings();
  const requests = useRequests();

  const isLoading = profile.isLoading || settings.isLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  const user = profile.data;
  const recentRequests = requests.data?.slice(0, 5) ?? [];

  return (
    <div className="max-w-[900px] flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="font-mono text-[28px] font-bold text-foreground">
          Welcome back{user ? `, ${user.givenName}` : ''}
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">OTC Desk Dashboard</p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {/* KYC Status */}
        <Card accent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground [&_svg]:text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>KYC Status</span>
          </div>
          <div className="font-mono text-[28px] font-bold">
            <span className={`inline-block py-1 px-2.5 rounded-full text-xs font-semibold capitalize ${badgeClass(user?.kycStatus ?? 'not_started')}`}>
              {formatKycStatus(user?.kycStatus)}
            </span>
          </div>
          {user?.kycStatus !== 'approved' && (
            <Link to="/otc-uat/kyc" className="text-[13px] text-primary font-medium no-underline mt-auto hover:underline">
              Complete KYC →
            </Link>
          )}
        </Card>

        {/* Available Assets */}
        <Card accent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground [&_svg]:text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Available Assets</span>
          </div>
          <div className="font-mono text-[28px] font-bold">
            {settings.data?.assets.length ?? '—'}
          </div>
          <Link to="/otc-uat/requests/new" className="text-[13px] text-primary font-medium no-underline mt-auto hover:underline">
            New OTC request →
          </Link>
        </Card>

        {/* Total Requests */}
        <Card accent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground [&_svg]:text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Total Requests</span>
          </div>
          <div className="font-mono text-[28px] font-bold">
            {requests.data?.length ?? '—'}
          </div>
          <Link to="/otc-uat/requests" className="text-[13px] text-primary font-medium no-underline mt-auto hover:underline">
            View all →
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="flex flex-col gap-4">
        <h2 className="font-mono text-base font-semibold">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap max-md:flex-col">
          <Link to="/otc-uat/requests/new" className="inline-flex items-center gap-2 py-2.5 px-[18px] bg-secondary border border-border rounded-[var(--radius-md-compat)] text-muted-foreground text-[13px] font-medium no-underline transition-all duration-200 hover:bg-accent hover:border-[var(--border-hover)] hover:text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New OTC Request
          </Link>
          <Link to="/otc-uat/wallets" className="inline-flex items-center gap-2 py-2.5 px-[18px] bg-secondary border border-border rounded-[var(--radius-md-compat)] text-muted-foreground text-[13px] font-medium no-underline transition-all duration-200 hover:bg-accent hover:border-[var(--border-hover)] hover:text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            Manage Wallets
          </Link>
          <Link to="/otc-uat/profile" className="inline-flex items-center gap-2 py-2.5 px-[18px] bg-secondary border border-border rounded-[var(--radius-md-compat)] text-muted-foreground text-[13px] font-medium no-underline transition-all duration-200 hover:bg-accent hover:border-[var(--border-hover)] hover:text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Edit Profile
          </Link>
        </div>
      </Card>

      {/* Recent Requests */}
      {recentRequests.length > 0 && (
        <Card className="flex flex-col gap-4">
          <h2 className="font-mono text-base font-semibold">Recent Requests</h2>
          <div className="flex flex-col">
            <div className="grid grid-cols-[1fr_0.6fr_1fr_1fr_1fr] py-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] border-b border-border max-md:grid-cols-[1fr_0.5fr_1fr_1fr] max-md:[&>span:last-child]:hidden">
              <span>Asset</span>
              <span>Side</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recentRequests.map((req) => (
              <Link key={req.id} to={`/otc-uat/requests/${req.id}`} className="grid grid-cols-[1fr_0.6fr_1fr_1fr_1fr] py-3 px-3 text-[13px] text-muted-foreground no-underline border-b border-border transition-colors duration-200 hover:bg-secondary last:border-b-0 max-md:grid-cols-[1fr_0.5fr_1fr_1fr] max-md:[&>span:last-child]:hidden">
                <span>{req.asset}</span>
                <span className={req.side === 'buy' ? 'text-[var(--success)] font-semibold' : 'text-[var(--error)] font-semibold'}>
                  {req.side.toUpperCase()}
                </span>
                <span>{req.amount.toLocaleString()}</span>
                <span className={`inline-block py-1 px-2.5 rounded-full text-xs font-semibold capitalize ${badgeClass(req.status)}`}>
                  {req.status}
                </span>
                <span className="text-[var(--text-tertiary)]">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function formatKycStatus(status?: string) {
  switch (status) {
    case 'approved': return 'Approved';
    case 'pending': return 'Pending Review';
    case 'rejected': return 'Rejected';
    default: return 'Not Started';
  }
}
