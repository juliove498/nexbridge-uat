import { useState, useEffect } from 'react';
import { Alert } from '../../../components/ui/Alert';
import { Spinner } from '../../../components/ui/Spinner';
import type { DepositResponse, DepositStatusResponse } from '../data';

interface Props {
  deposit: DepositResponse;
  statusData: DepositStatusResponse | null;
  error: string;
}

export function StepAwaiting({ deposit, statusData, error }: Props) {
  const [lastChecked, setLastChecked] = useState(0);

  useEffect(() => {
    setLastChecked(0);
    const id = setInterval(() => setLastChecked(prev => prev + 1), 1000);
    return () => clearInterval(id);
  }, [statusData?.updatedAt]);

  const status = statusData?.status ?? deposit.status;
  const confirmations = statusData?.confirmations ?? 0;
  const required = statusData?.requiredConfirmations ?? 12;
  const pct = Math.min((confirmations / required) * 100, 100);
  const txId = statusData?.depositTxId;
  const isDetected = status === 'detected' || status === 'confirming' || status === 'confirmed';
  const isFailed = status === 'failed';

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-base font-bold text-foreground">Awaiting Confirmation</h3>

      {error && <Alert>{error}</Alert>}

      <div className="flex flex-col items-center gap-3 py-4">
        <div>
          {isDetected ? (
            <div className="text-[var(--success)]">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          ) : isFailed ? (
            <div className="text-[var(--error)]">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          ) : (
            <Spinner size={32} />
          )}
        </div>

        <div className="text-base font-semibold text-foreground">
          {isFailed ? 'Transaction Failed' :
           isDetected ? 'Transaction Detected' :
           'Waiting for Transaction...'}
        </div>

        {txId && (
          <a
            href={`https://etherscan.io/tx/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-primary font-medium no-underline hover:underline"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            TxID: {txId.slice(0, 10)}...{txId.slice(-6)}
          </a>
        )}
      </div>

      {/* Progress bar */}
      {isDetected && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
            <span>Confirmations</span>
            <span>{confirmations} / {required}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--orange-light)] transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <span className="text-[11px] text-[var(--text-tertiary)]">
          Last checked: {lastChecked}s ago
        </span>
      </div>

      {!isFailed && (
        <div className="flex items-start gap-2 py-2.5 px-3 bg-[var(--info-bg)] border border-[rgba(59,130,246,0.15)] rounded-[var(--radius-sm-compat)] text-[11px] text-foreground leading-relaxed [&_svg]:shrink-0 [&_svg]:text-[var(--info)] [&_svg]:mt-px">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          Do not close this page. We are monitoring the blockchain for your transaction.
        </div>
      )}

      {isFailed && (
        <div className="flex gap-3 mt-2">
          <a href="mailto:support@nexbridge.io" className="flex-1 py-3 px-4 rounded-[var(--radius-md-compat)] bg-secondary border border-border text-muted-foreground font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-accent hover:text-foreground" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Contact Support
          </a>
        </div>
      )}
    </div>
  );
}
