import type { Asset, DepositResponse, DepositStatusResponse } from '../data';

interface Props {
  deposit: DepositResponse;
  statusData: DepositStatusResponse | null;
  asset: Asset;
  side: 'buy' | 'sell';
  onViewRequest: () => void;
  onNewTrade: () => void;
}

export function StepComplete({ deposit, statusData, asset, side, onViewRequest, onNewTrade }: Props) {
  const outputAmount = statusData?.outputAmount ?? deposit.outputAmount;
  const outputTxId = statusData?.outputTxId;
  const depositTxId = statusData?.depositTxId;
  const receiveToken = side === 'buy' ? asset.ticker : 'USDT';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center text-[var(--success)]">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h3 className="font-mono text-lg font-bold text-center text-foreground">Trade Complete</h3>

      <div className="flex flex-col border border-border rounded-[var(--radius-md-compat)] overflow-hidden">
        <div className="flex justify-between py-3 px-4 text-[13px] [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Sent</span>
          <span>{deposit.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {deposit.token}</span>
        </div>
        <div className="flex justify-center py-1 text-[var(--text-tertiary)]">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
        </div>
        <div className="flex justify-between py-3 px-4 text-[13px] [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
          <span>Received</span>
          <span className="text-[var(--success)] font-bold">{outputAmount ? outputAmount.toFixed(6) : '--'} {receiveToken}</span>
        </div>

        {depositTxId && (
          <div className="flex justify-between py-3 px-4 text-[13px] [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
            <span>Deposit Tx</span>
            <a href={`https://etherscan.io/tx/${depositTxId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-primary font-medium no-underline hover:underline">
              {depositTxId.slice(0, 10)}...{depositTxId.slice(-6)}
            </a>
          </div>
        )}

        {outputTxId && (
          <div className="flex justify-between py-3 px-4 text-[13px] [&>span:first-child]:text-[var(--text-tertiary)] [&>span:last-child]:font-semibold">
            <span>Output Tx</span>
            <a href={`https://etherscan.io/tx/${outputTxId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-primary font-medium no-underline hover:underline">
              {outputTxId.slice(0, 10)}...{outputTxId.slice(-6)}
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <button type="button" className="flex-1 py-3 px-4 rounded-[var(--radius-md-compat)] bg-secondary border border-border text-muted-foreground font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-accent hover:text-foreground" onClick={onViewRequest}>View Request Details</button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-md-compat)] bg-gradient-to-r from-primary to-[var(--orange-light)] text-white font-semibold text-sm border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_var(--orange-glow)] [&_svg]:w-4 [&_svg]:h-4" onClick={onNewTrade}>
          New Trade
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>
    </div>
  );
}
