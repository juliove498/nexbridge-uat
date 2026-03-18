import { Alert } from '../../../components/ui/Alert';
import type { Asset } from '../data';
import type { WalletAddress } from '../../../hooks/useApi';

interface Props {
  asset: Asset;
  side: 'buy' | 'sell';
  amount: number;
  payToken: string;
  receiveToken: string;
  receiveAmount: number;
  effectivePrice: number | null;
  feePercent: number;
  wallet: WalletAddress | undefined;
  error: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StepReview({
  asset, side, amount, payToken, receiveToken, receiveAmount,
  effectivePrice, feePercent, wallet, error, isPending, onConfirm, onCancel,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-base font-bold text-foreground">Review Your Order</h3>

      {error && <Alert>{error}</Alert>}

      <div className="flex flex-col border border-border rounded-[var(--radius-md-compat)] overflow-hidden">
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Direction</span>
          <span className={side === 'buy' ? 'text-[var(--success)]' : 'text-[var(--error)]'}>{side.toUpperCase()}</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Asset</span>
          <span>{asset.name} ({asset.ticker})</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>You Pay</span>
          <span>{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {payToken}</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>You Receive</span>
          <span>{receiveAmount > 0 ? receiveAmount.toFixed(6) : '--'} {receiveToken}</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Rate</span>
          <span>1 {asset.ticker} = {effectivePrice ? effectivePrice.toFixed(4) : '--'} USDT</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Fee</span>
          <span>{feePercent ? `${(feePercent * 100).toFixed(2)}%` : 'No fee'}</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] border-b border-border [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Network</span>
          <span>Ethereum (ERC-20)</span>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Wallet</span>
          <span>{wallet ? `${wallet.label} (${wallet.address.slice(0, 8)}...)` : '--'}</span>
        </div>
      </div>

      <div className="flex items-start gap-3 py-3 px-4 bg-[var(--warning-bg)] border border-[rgba(251,191,36,0.15)] rounded-[var(--radius-sm-compat)] text-[12px] text-foreground leading-relaxed [&_svg]:shrink-0 [&_svg]:text-[var(--warning)] [&_svg]:mt-px">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        <span>You will need to send exactly <strong>{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT</strong> to a deposit address on Ethereum.</span>
      </div>

      <div className="flex gap-3 mt-2">
        <button type="button" className="flex-1 py-3 px-4 rounded-[var(--radius-md-compat)] bg-secondary border border-border text-muted-foreground font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-accent hover:text-foreground" onClick={onCancel}>Cancel</button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-md-compat)] bg-gradient-to-r from-primary to-[var(--orange-light)] text-white font-semibold text-sm border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_var(--orange-glow)] [&_svg]:w-4 [&_svg]:h-4" onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Creating...' : 'Confirm & Get Deposit Address'}
          {!isPending && <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>}
        </button>
      </div>
    </div>
  );
}
