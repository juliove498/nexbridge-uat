import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { signInSchema } from '../lib/validation';

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const verified = (location.state as { verified?: boolean })?.verified;
  const prefillEmail = (location.state as { email?: string })?.email ?? '';

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const output = await signIn(email, password);

      if (output.isSignedIn) {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
        navigate(from ?? '/otc-uat/dashboard', { replace: true });
      } else if (
        output.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' ||
        output.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE'
      ) {
        navigate('/otc-uat/mfa');
      } else if (output.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        navigate('/otc-uat/verify', { state: { email } });
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to the NexBridge OTC Desk"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {verified && (
          <Alert variant="success">
            Email verified! You can now sign in.
          </Alert>
        )}
        {apiError && <Alert>{apiError}</Alert>}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
          error={errors['email']}
          autoComplete="email"
          autoFocus={!prefillEmail}
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
          error={errors['password']}
          autoComplete="current-password"
        />

        <Button type="submit" loading={loading} className="w-full mt-1">
          Sign in
        </Button>

        <p className="text-center text-[13px] text-[var(--text-tertiary)]">
          Don't have an account?{' '}
          <Link to="/otc-uat/signup" className="text-primary font-medium">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
