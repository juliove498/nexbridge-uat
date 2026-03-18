import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { CodeInput } from '../components/ui/CodeInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'otc_verify_email';

export function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, resendCode } = useAuth();

  // Recover email from: navigation state > sessionStorage > empty
  const stateEmail = (location.state as { email?: string })?.email ?? '';
  const savedEmail = sessionStorage.getItem(STORAGE_KEY) ?? '';
  const initialEmail = stateEmail || savedEmail;

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Persist email so it survives page refreshes / 404 redirects
  useEffect(() => {
    if (email) sessionStorage.setItem(STORAGE_KEY, email);
  }, [email]);

  const submit = useCallback(
    async (verificationCode: string) => {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (verificationCode.length !== 6) {
        setError('Please enter the full 6-digit code');
        return;
      }

      setError('');
      setLoading(true);
      try {
        await confirmSignUp(email.trim(), verificationCode);
        sessionStorage.removeItem(STORAGE_KEY);
        navigate('/otc-uat/signin', {
          state: { verified: true, email: email.trim() },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    },
    [email, confirmSignUp, navigate],
  );

  // Auto-submit when all 6 digits are entered
  function handleCodeChange(value: string) {
    setCode(value);
    setError('');
    if (value.length === 6) {
      submit(value);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(code);
  }

  async function handleResend() {
    if (cooldown > 0 || !email.trim()) {
      if (!email.trim()) setError('Please enter your email address first');
      return;
    }
    setResending(true);
    setError('');
    try {
      await resendCode(email.trim());
      setSuccess('New code sent! Check your inbox and spam folder.');
      setCooldown(30);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a 6-digit verification code to ${email}`
          : 'Enter the email you signed up with and the code we sent you'
      }
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {error && <Alert>{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Show email field — pre-filled but editable if needed */}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          autoComplete="email"
          placeholder="you@example.com"
        />

        <CodeInput
          label="Verification code"
          value={code}
          onChange={handleCodeChange}
        />

        <Button type="submit" loading={loading} className="w-full">
          Verify email
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className={cn(
              "bg-transparent border-none text-[13px] font-medium",
              cooldown > 0
                ? "text-[var(--text-tertiary)] cursor-default"
                : "text-primary cursor-pointer"
            )}
          >
            {resending
              ? 'Sending…'
              : cooldown > 0
                ? `Resend code (${cooldown}s)`
                : "Didn't receive a code? Resend"}
          </button>
        </div>

        <p className="text-center text-[13px] text-[var(--text-tertiary)]">
          <Link
            to="/otc-uat/signin"
            className="text-primary font-medium"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
