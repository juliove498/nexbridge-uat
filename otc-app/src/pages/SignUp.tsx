import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { signUpSchema, type SignUpForm } from '../lib/validation';

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState<SignUpForm>({
    givenName: '',
    familyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false as unknown as true,
    acceptPrivacy: false as unknown as true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpForm, string>>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function update<K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');

    const result = signUpSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { isComplete } = await signUp({
        email: form.email,
        password: form.password,
        givenName: form.givenName,
        familyName: form.familyName,
      });
      if (isComplete) {
        // Account auto-confirmed — go straight to sign-in
        navigate('/otc-uat/signin', {
          state: { verified: true, email: form.email },
        });
      } else {
        // Needs verification code
        sessionStorage.setItem('otc_verify_email', form.email);
        navigate('/otc-uat/verify', { state: { email: form.email } });
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to access the NexBridge OTC Desk"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {apiError && <Alert>{apiError}</Alert>}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            value={form.givenName}
            onChange={(e) => update('givenName', e.target.value)}
            error={errors.givenName}
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            value={form.familyName}
            onChange={(e) => update('familyName', e.target.value)}
            error={errors.familyName}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
          showStrength
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm password"
          value={form.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <label className="flex items-start gap-2.5 text-[13px] text-muted-foreground cursor-pointer flex-wrap">
          <input
            type="checkbox"
            checked={form.acceptTerms as boolean}
            onChange={(e) => update('acceptTerms', e.target.checked as unknown as true)}
            className="w-4 h-4 mt-0.5 accent-primary shrink-0"
          />
          <span>
            I accept the <a href="https://nexbridge.finance/legal-framework" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms of Service</a>
          </span>
          {errors.acceptTerms && <span className="w-full text-xs text-[var(--error)]">{errors.acceptTerms}</span>}
        </label>

        <label className="flex items-start gap-2.5 text-[13px] text-muted-foreground cursor-pointer flex-wrap">
          <input
            type="checkbox"
            checked={form.acceptPrivacy as boolean}
            onChange={(e) => update('acceptPrivacy', e.target.checked as unknown as true)}
            className="w-4 h-4 mt-0.5 accent-primary shrink-0"
          />
          <span>
            I accept the <a href="https://nexbridge.finance/legal-framework" target="_blank" rel="noopener noreferrer" className="text-primary underline">Privacy Policy</a>
          </span>
          {errors.acceptPrivacy && <span className="w-full text-xs text-[var(--error)]">{errors.acceptPrivacy}</span>}
        </label>

        <Button type="submit" loading={loading} className="w-full mt-1">
          Create account
        </Button>

        <p className="text-center text-[13px] text-[var(--text-tertiary)]">
          Already have an account?{' '}
          <Link to="/otc-uat/signin" className="text-primary font-medium">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
