import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useUserProfile } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

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

export function Profile() {
  const { data: user, isLoading } = useUserProfile();
  const { user: authUser } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-[600px] flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">Profile</h1>

      <Card accent>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">First Name</span>
            <span className="text-[15px] text-foreground">{user?.givenName ?? '—'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Last Name</span>
            <span className="text-[15px] text-foreground">{user?.familyName ?? '—'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Email</span>
            <span className="text-[15px] text-foreground">{user?.email ?? authUser?.email ?? '—'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">KYC Status</span>
            <span className={`inline-block py-1 px-2.5 rounded-full text-xs font-semibold capitalize ${badgeClass(user?.kycStatus ?? 'not_started')}`}>
              {user?.kycStatus?.replace('_', ' ') ?? 'Not started'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Member Since</span>
            <span className="text-[15px] text-foreground">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
