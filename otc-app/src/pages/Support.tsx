import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

export function Support() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // TODO: Submit to support Lambda endpoint
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch {
      setError('Failed to submit support request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[600px] flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">Support</h1>
      <p className="text-sm text-muted-foreground -mt-3">
        Need help? Send us a message and we'll get back to you.
      </p>

      {success && (
        <Alert variant="success">
          Support request submitted! We'll get back to you at {user?.email}.
        </Alert>
      )}

      <Card accent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert>{error}</Alert>}

          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-muted-foreground">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="w-full py-3 px-4 bg-secondary border border-border rounded-[var(--radius-md-compat)] text-foreground text-sm leading-relaxed outline-none resize-y min-h-[120px] transition-all duration-200 placeholder:text-[var(--text-tertiary)] focus:border-primary focus:bg-accent focus:shadow-[0_0_0_3px_var(--orange-subtle)]"
              rows={6}
            />
          </div>

          <Button type="submit" loading={loading}>
            Send Message
          </Button>
        </form>
      </Card>
    </div>
  );
}
