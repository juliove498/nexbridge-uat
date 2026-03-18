import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import type { Asset } from './data';
import type { WalletAddress } from '../../hooks/useApi';

// Network filtering: which wallet networks are valid for each receive token
const NETWORK_MAP: Record<string, { networks: string[]; label: string }> = {
  USTBL:  { networks: ['blockstream amp', 'liquid'], label: 'Liquid Network' },
  USYLD:  { networks: ['blockstream amp', 'liquid'], label: 'Liquid Network' },
  USDT:   { networks: ['ethereum', 'solana'],        label: 'Ethereum or Solana' },
};

// Default for future backed tokens (nMSTR, nTSLA, etc.) — Liquid
const DEFAULT_RECEIVE_NETWORKS = { networks: ['blockstream amp', 'liquid'], label: 'Liquid Network' };

function getReceiveNetworkInfo(receiveToken: string) {
  return NETWORK_MAP[receiveToken] ?? DEFAULT_RECEIVE_NETWORKS;
}

interface Props {
  asset: Asset;
  isLive: boolean;
  currentPrice: number | null;
  bidPrice: number | null;
  askPrice: number | null;
  wallets: WalletAddress[] | undefined;
  onStartDeposit: (data: { side: 'buy' | 'sell'; amount: number; walletId: string; notes?: string }) => void;
  error: string;
}

export function SwapWidget({ asset, isLive, currentPrice, bidPrice, askPrice, wallets, onStartDeposit, error }: Props) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [payFocused, setPayFocused] = useState(false);

  const numAmount = parseFloat(amount);
  const payToken = side === 'buy' ? 'USDT' : asset.ticker;
  const receiveToken = side === 'buy' ? asset.ticker : 'USDT';

  // Filter wallets by the receive token's network
  const networkInfo = getReceiveNetworkInfo(receiveToken);
  const filteredWallets = useMemo(() => {
    if (!wallets) return [];
    return wallets.filter(w =>
      networkInfo.networks.some(n => w.network.toLowerCase().includes(n))
    );
  }, [wallets, networkInfo]);

  const isReady = isLive && numAmount > 0 && walletId;

  // Clear wallet selection when side changes (different network required)
  useEffect(() => { setWalletId(''); }, [side]);

  function handleSwapDirection() { setSide(s => s === 'buy' ? 'sell' : 'buy'); }

  function handleCta() {
    onStartDeposit({ side, amount: numAmount, walletId, notes: notes || undefined });
  }

  function getCtaText() {
    if (!isLive) return 'Coming Soon';
    if (!numAmount || numAmount <= 0) return 'Enter an amount';
    if (!walletId) return 'Select a wallet';
    return `${side === 'buy' ? 'Buy' : 'Sell'} ${asset.ticker}`;
  }

  return (
    <div className="w-[380px] shrink-0 border-l border-border flex flex-col p-6 gap-4">
      <div className="flex items-center justify-between mb-2"><div className="font-mono text-sm font-bold text-foreground">Swap</div><div className="text-[10px] py-0.5 px-2 rounded-full bg-primary/10 text-primary font-semibold">OTC</div></div>
      {error && <Alert>{error}</Alert>}

      <div className={`rounded-[var(--radius-md-compat)] border border-border p-4 transition-all duration-200 bg-secondary ${payFocused ? 'border-primary shadow-[0_0_0_2px_var(--orange-subtle)]' : ''}`}>
        <div className="flex justify-between text-[11px] text-[var(--text-tertiary)] mb-2"><span className="font-semibold uppercase tracking-wider">{side === 'buy' ? 'You Pay' : 'You Sell'}</span><span>Balance: —</span></div>
        <div className="flex items-center gap-3">
          <input type="text" inputMode="decimal" autoComplete="off" placeholder="0" className="flex-1 bg-transparent border-none outline-none text-2xl font-bold text-foreground font-mono min-w-0 placeholder:text-[var(--text-tertiary)]" value={amount} disabled={!isLive} onFocus={() => setPayFocused(true)} onBlur={() => setPayFocused(false)} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setAmount(v); }} />
          {side === 'buy' ? (
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-accent border border-border text-sm font-semibold shrink-0"><div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[10px] font-bold">$</div><span>USDT</span></div>
          ) : (
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-accent border border-border text-sm font-semibold shrink-0"><img src={asset.logo} alt={asset.ticker} className="w-5 h-5 rounded-full object-contain" /><span>{payToken}</span></div>
          )}
        </div>
        {numAmount > 0 && <div className="text-[11px] text-[var(--text-tertiary)] mt-2">&asymp; ${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>}
      </div>

      <div className="flex justify-center -my-2 relative z-10">
        <div className={`w-9 h-9 rounded-full bg-card border-2 border-border flex items-center justify-center cursor-pointer transition-all duration-200 text-[var(--text-tertiary)] hover:text-primary hover:border-primary [&_svg]:w-4 [&_svg]:h-4 ${side === 'sell' ? 'rotate-180' : ''}`} onClick={handleSwapDirection}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
        </div>
      </div>

      <div className="rounded-[var(--radius-md-compat)] border border-border p-4 transition-all duration-200 bg-[rgba(255,255,255,0.02)]">
        <div className="flex justify-between text-[11px] text-[var(--text-tertiary)] mb-2"><span className="font-semibold uppercase tracking-wider">{side === 'buy' ? 'You Receive' : 'You Get'}</span><span>Balance: —</span></div>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="0" className="flex-1 bg-transparent border-none outline-none text-2xl font-bold text-foreground font-mono min-w-0 placeholder:text-[var(--text-tertiary)]" value={numAmount > 0 && currentPrice ? (side === 'buy' ? (numAmount / (askPrice || currentPrice)).toFixed(6) : (numAmount * (bidPrice || currentPrice)).toFixed(2)) : ''} readOnly tabIndex={-1} />
          {side === 'sell' ? (
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-accent border border-border text-sm font-semibold shrink-0"><div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[10px] font-bold">$</div><span>USDT</span></div>
          ) : (
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-accent border border-border text-sm font-semibold shrink-0"><img src={asset.logo} alt={asset.ticker} className="w-5 h-5 rounded-full object-contain" /><span>{receiveToken}</span></div>
          )}
        </div>
        {numAmount > 0 && currentPrice && <div className="text-[11px] text-[var(--text-tertiary)] mt-2">&asymp; ${(side === 'buy' ? numAmount : numAmount * (bidPrice || currentPrice)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>}
      </div>

      <div className="flex flex-col gap-2 py-3 px-1">
        <div className="flex justify-between text-[12px] text-[var(--text-tertiary)]"><span>Rate</span><span className="text-foreground font-semibold">1 {asset.ticker} &asymp; {currentPrice ? (currentPrice >= 100 ? currentPrice.toFixed(2) : currentPrice.toFixed(3)) : '--'} USDT</span></div>
        <div className="flex justify-between text-[12px] text-[var(--text-tertiary)]"><span>Price Impact</span><span style={{ color: 'var(--success)' }}>&lt; 0.01%</span></div>
        <div className="flex justify-between text-[12px] text-[var(--text-tertiary)]"><span>Network</span><span>{asset.network}</span></div>
      </div>

      {isLive && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-muted-foreground">Receive {receiveToken} to</span>
            <span className="text-[10px] py-0.5 px-2 rounded-full bg-accent border border-border text-[var(--text-tertiary)]">{networkInfo.label}</span>
          </div>
          <select value={walletId} onChange={e => setWalletId(e.target.value)} className="w-full py-2.5 px-3 bg-secondary border border-border rounded-[var(--radius-md-compat)] text-foreground text-[13px] outline-none cursor-pointer transition-all duration-200 focus:border-primary">
            <option value="">Select a {networkInfo.label} wallet</option>
            {filteredWallets.map(w => <option key={w.id} value={w.id}>{w.label} ({w.address.slice(0, 6)}...{w.address.slice(-4)})</option>)}
          </select>
          {walletId && (() => {
            const sel = filteredWallets.find(w => w.id === walletId);
            return sel ? (
              <div className="flex items-center justify-between py-2 px-3 bg-[rgba(255,255,255,0.02)] rounded-[var(--radius-sm-compat)] border border-border">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)] overflow-hidden text-ellipsis whitespace-nowrap">{sel.address}</span>
                <span className="text-[10px] text-primary font-semibold shrink-0">{sel.network}</span>
              </div>
            ) : null;
          })()}
          {filteredWallets.length === 0 && wallets && wallets.length > 0 && (
            <div className="text-xs text-[var(--text-tertiary)]">
              No {networkInfo.label} wallets found.{' '}
              <Link to="/otc-uat/wallets" className="text-primary text-xs font-medium no-underline hover:underline">Add one</Link>
            </div>
          )}
          {(!wallets || wallets.length === 0) && <Link to="/otc-uat/wallets" className="text-primary text-xs font-medium no-underline hover:underline">+ Whitelist a wallet first</Link>}
        </div>
      )}

      {isLive && (
        <div className="flex flex-col">
          {!showNotes ? (
            <button type="button" className="bg-transparent border-none text-primary text-xs font-medium cursor-pointer p-0 text-left hover:underline" onClick={() => setShowNotes(true)}>+ Add notes</button>
          ) : (
            <textarea className="w-full py-2 px-3 bg-secondary border border-border rounded-[var(--radius-sm-compat)] text-foreground text-[13px] outline-none resize-none transition-all duration-200 focus:border-primary placeholder:text-[var(--text-tertiary)]" rows={2} placeholder="Additional instructions&hellip;" value={notes} onChange={e => setNotes(e.target.value)} autoFocus />
          )}
        </div>
      )}

      <button type="button" className={`py-3.5 px-6 rounded-[var(--radius-md-compat)] text-sm font-bold border-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 bg-secondary text-[var(--text-tertiary)] [&_svg]:w-4 [&_svg]:h-4 ${isReady ? 'bg-gradient-to-r from-primary to-[var(--orange-light)] text-white shadow-[0_0_24px_var(--orange-glow)] hover:-translate-y-px hover:shadow-[0_0_32px_var(--orange-glow)]' : ''} ${!isLive ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => { if (isReady) handleCta(); }} style={{ marginTop: 'auto' }}>
        {getCtaText()}
        {isReady && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>}
      </button>
    </div>
  );
}
