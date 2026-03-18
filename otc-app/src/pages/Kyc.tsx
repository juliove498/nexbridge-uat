import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useUserProfile, useCreateKycUrl } from '../hooks/useApi';

export function Kyc() {
  const { data: user, isLoading } = useUserProfile();
  const kycMutation = useCreateKycUrl(user?.id ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  async function handleStartKyc() {
    try {
      const result = await kycMutation.mutateAsync();
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch {
      // error handled by mutation state
    }
  }

  const status = user?.kycStatus ?? 'not_started';

  return (
    <div className="max-w-[600px] flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">KYC Verification</h1>

      <Card accent>
        <div className="flex flex-col items-center text-center gap-4 py-6">
          {status === 'approved' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--success-bg)] text-[var(--success)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="font-mono text-xl font-bold">Verification Complete</h2>
              <p className="text-muted-foreground text-sm max-w-[400px] leading-relaxed">Your identity has been verified. You can now use the OTC Desk.</p>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--warning-bg)] text-[var(--warning)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h2 className="font-mono text-xl font-bold">Verification In Progress</h2>
              <p className="text-muted-foreground text-sm max-w-[400px] leading-relaxed">Your documents are being reviewed. This usually takes 1-2 business days.</p>
            </>
          )}

          {status === 'rejected' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--error-bg)] text-[var(--error)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h2 className="font-mono text-xl font-bold">Verification Failed</h2>
              <p className="text-muted-foreground text-sm max-w-[400px] leading-relaxed">Your verification was not approved. Please try again with valid documents.</p>
              <Button onClick={handleStartKyc} loading={kycMutation.isPending}>
                Retry Verification
              </Button>
            </>
          )}

          {status === 'not_started' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--orange-subtle)] text-primary">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h2 className="font-mono text-xl font-bold">Verify Your Identity</h2>
              {user ? (
                <>
                  <p className="text-muted-foreground text-sm max-w-[400px] leading-relaxed">
                    Complete KYC verification to access OTC trading. You'll need a government-issued ID and proof of address.
                  </p>
                  <Button onClick={handleStartKyc} loading={kycMutation.isPending}>
                    Start Verification
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground text-sm max-w-[400px] leading-relaxed">
                  Your account is being activated. KYC verification will be available once your account is fully set up. We'll notify you by email when it's ready.
                </p>
              )}
            </>
          )}

          {kycMutation.isError && (
            <Alert>Failed to start KYC: {kycMutation.error.message}</Alert>
          )}
        </div>
      </Card>
    </div>
  );
}
