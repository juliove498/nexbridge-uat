import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { CodeInput } from '../components/ui/CodeInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

export function MfaChallenge() {
  const navigate = useNavigate();
  const { confirmMfa } = useAuth();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await confirmMfa(code);
      navigate('/otc-uat/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MFA verification failed');
      setCode('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Two-factor authentication"
      subtitle="Enter the 6-digit code from your authenticator app"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <Alert>{error}</Alert>}

        <CodeInput value={code} onChange={setCode} />

        <Button type="submit" loading={loading} className="w-full">
          Verify
        </Button>
      </form>
    </AuthLayout>
  );
}
