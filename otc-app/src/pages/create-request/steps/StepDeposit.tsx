import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { Alert } from '../../../components/ui/Alert';
import type { DepositResponse } from '../data';

interface Props {
  deposit: DepositResponse;
  error: string;
  onSent: () => void;
  onCancel: () => void;
}

export function StepDeposit({ deposit, error, onSent, onCancel }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Generate QR code
  useEffect(() => {
    QRCode.toDataURL(deposit.depositAddress, {
      width: 180,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {});
  }, [deposit.depositAddress]);

  // Expiry timer
  useEffect(() => {
    if (!deposit.expiresAt) return;
    const target = new Date(deposit.expiresAt).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deposit.expiresAt]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(deposit.depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }, [deposit.depositAddress]);

  const etherscanUrl = `https://etherscan.io/address/${deposit.depositAddress}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-base font-bold text-foreground">Deposit USDT</h3>

      {error && <Alert>{error}</Alert>}

      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold py-1 px-3 rounded-full bg-accent border border-border text-muted-foreground w-fit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
        Ethereum ERC-20
      </div>

      <div className="flex flex-col gap-4 p-4 bg-[rgba(255,255,255,0.02)] border border-border rounded-[var(--radius-md-compat)]">
        {/* QR Code */}
        <div className="flex justify-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Deposit address QR code" className="rounded-lg" />
          ) : (
            <div className="w-[180px] h-[180px] flex items-center justify-center bg-secondary rounded-lg text-[var(--text-tertiary)] text-xs">Generating QR...</div>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Deposit Address</span>
          <code className="font-mono text-[11px] text-foreground bg-secondary py-2 px-3 rounded break-all">{deposit.depositAddress}</code>
          <div className="flex gap-2">
            <button type="button" className="flex items-center gap-1.5 py-1.5 px-3 rounded-md bg-secondary border border-border text-muted-foreground text-[11px] font-medium cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary" onClick={handleCopy}>
              {copied ? (
                <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Copied!</>
              ) : (
                <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg> Copy Address</>
              )}
            </button>
            <a href={etherscanUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] no-underline hover:text-primary transition-colors duration-200">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              View on Etherscan
            </a>
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Amount to Send</span>
          <span className="font-mono text-lg font-bold text-foreground">{deposit.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT</span>
        </div>

        {/* Timer */}
        {deposit.expiresAt && timeLeft && (
          <div className={`flex items-center gap-2 py-2 px-3 bg-[var(--warning-bg)] rounded-md text-[12px] text-[var(--warning)] font-semibold ${timeLeft === 'Expired' ? 'bg-[var(--error-bg)] text-[var(--error)]' : ''}`}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {timeLeft === 'Expired' ? 'Deposit window expired' : `Time remaining: ${timeLeft}`}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 py-3 px-4 bg-[var(--warning-bg)] border border-[rgba(251,191,36,0.15)] rounded-[var(--radius-sm-compat)] text-[12px] text-foreground leading-relaxed [&_svg]:shrink-0 [&_svg]:text-[var(--warning)] [&_svg]:mt-px">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        <span>Send <strong>ONLY USDT (ERC-20)</strong> to this address. Sending wrong tokens will result in <strong>permanent loss</strong>.</span>
      </div>

      <div className="flex gap-3 mt-2">
        <button type="button" className="flex-1 py-3 px-4 rounded-[var(--radius-md-compat)] bg-secondary border border-border text-muted-foreground font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-accent hover:text-foreground" onClick={onCancel}>Cancel</button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-md-compat)] bg-gradient-to-r from-primary to-[var(--orange-light)] text-white font-semibold text-sm border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_var(--orange-glow)] [&_svg]:w-4 [&_svg]:h-4" onClick={onSent} disabled={timeLeft === 'Expired'}>
          I've Sent the USDT
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>
    </div>
  );
}
