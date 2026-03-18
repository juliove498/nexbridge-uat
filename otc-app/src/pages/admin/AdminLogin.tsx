import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { adminLogin } from '../../lib/admin-auth';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setRetryAfter(null);
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const e = err as Error & { status?: number; retryAfterSeconds?: number };
      if (e.status === 429 && e.retryAfterSeconds) {
        const mins = Math.ceil(e.retryAfterSeconds / 60);
        setRetryAfter(mins);
        setError(`Demasiados intentos fallidos. Intentá de nuevo en ${mins} minuto${mins !== 1 ? 's' : ''}.`);
      } else {
        setError(e.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Admin" subtitle="Acceso restringido al panel de administración.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <Alert variant="error">
            {error}
            {retryAfter !== null && (
              <span className="block mt-1 text-xs opacity-80">
                Por seguridad, los intentos se registran por IP y por cuenta.
              </span>
            )}
          </Alert>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="Contraseña"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={loading || !!retryAfter}
          className="w-full mt-2"
        >
          {loading ? 'Verificando…' : 'Ingresar'}
        </Button>
      </form>
    </AuthLayout>
  );
}
