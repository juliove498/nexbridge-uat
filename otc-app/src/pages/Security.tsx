import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';

export function Security() {
  return (
    <div className="max-w-[600px] flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">Security</h1>

      <Alert variant="info">
        Security settings (TOTP setup, passkey management, MFA configuration) will be available in Phase 3.
      </Alert>

      <Card accent>
        <div className="flex flex-col gap-2">
          <h2 className="font-mono text-base font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Protect your account with TOTP-based two-factor authentication.
            This feature is coming soon.
          </p>
        </div>
      </Card>

      <Card accent>
        <div className="flex flex-col gap-2">
          <h2 className="font-mono text-base font-semibold">Passkeys</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Register hardware security keys or biometric authentication.
            This feature is coming soon.
          </p>
        </div>
      </Card>
    </div>
  );
}
