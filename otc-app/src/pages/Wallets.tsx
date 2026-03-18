import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useWallets, useAddWallet } from '../hooks/useApi';

const SUPPORTED_NETWORKS = [
  { id: 'solana', label: 'Solana', placeholder: 'e.g. 7xK...abc', hint: 'Base58 address (32-44 chars)' },
  { id: 'ethereum', label: 'Ethereum', placeholder: 'e.g. 0x71C...f3E', hint: 'Starts with 0x (42 chars)' },
  { id: 'blockstream-amp', label: 'Blockstream AMP', placeholder: 'e.g. VJL...xyz', hint: 'Liquid Network address' },
];

function getNetworkColor(network: string) {
  const n = network.toLowerCase();
  if (n.includes('solana')) return '#9945FF';
  if (n.includes('ethereum')) return '#627EEA';
  if (n.includes('blockstream') || n.includes('amp') || n.includes('liquid')) return '#00B4E6';
  return 'var(--orange)';
}

export function Wallets() {
  const { data: wallets, isLoading, error } = useWallets();
  const addWallet = useAddWallet();

  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [formError, setFormError] = useState('');

  const selectedNet = SUPPORTED_NETWORKS.find((n) => n.id === network);

  function validateAddress(addr: string, net: string): string | null {
    if (!addr.trim()) return 'Wallet address is required';
    if (net === 'ethereum') {
      if (!/^0x[a-fA-F0-9]{40}$/.test(addr.trim())) return 'Invalid Ethereum address (must start with 0x, 42 characters)';
    } else if (net === 'solana') {
      if (addr.trim().length < 32 || addr.trim().length > 44) return 'Invalid Solana address (32-44 characters)';
      if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(addr.trim())) return 'Invalid Solana address (Base58 characters only)';
    } else if (net === 'blockstream-amp') {
      if (addr.trim().length < 20) return 'Invalid Blockstream AMP address';
    }
    return null;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!label.trim()) { setFormError('Label is required'); return; }
    if (!network) { setFormError('Select a network'); return; }

    const addrError = validateAddress(address, network);
    if (addrError) { setFormError(addrError); return; }

    try {
      await addWallet.mutateAsync({
        label: label.trim(),
        address: address.trim(),
        network: selectedNet?.label ?? network,
      });
      setLabel('');
      setAddress('');
      setNetwork('');
      setShowForm(false);
    } catch {
      // error handled by mutation state
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 max-sm:flex-col">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground">Wallet Whitelisting</h1>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-1 leading-relaxed">
            Whitelist wallet addresses for receiving OTC settlements. Only Solana, Ethereum, and Blockstream AMP networks are supported.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Whitelist Wallet'}
        </Button>
      </div>

      {error && <Alert>Failed to load wallets: {error.message}</Alert>}
      {addWallet.isError && <Alert>Failed to whitelist wallet: {addWallet.error.message}</Alert>}

      {showForm && (
        <Card accent>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <Input
              label="Label"
              placeholder="e.g. My Primary Wallet"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-muted-foreground">Network</label>
              <div className="grid grid-cols-3 gap-2.5 max-sm:grid-cols-1">
                {SUPPORTED_NETWORKS.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`flex items-center gap-2.5 py-3.5 px-4 bg-secondary border border-border rounded-[var(--radius-md-compat)] cursor-pointer transition-all duration-150 text-foreground hover:border-[var(--border-hover)] hover:bg-accent ${network === n.id ? 'bg-accent' : ''}`}
                    onClick={() => { setNetwork(n.id); setAddress(''); }}
                    style={network === n.id ? { borderColor: getNetworkColor(n.label), boxShadow: `0 0 0 1px ${getNetworkColor(n.label)}22` } : undefined}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: getNetworkColor(n.label) }} />
                    <span className="text-[13px] font-semibold">{n.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {network && (
              <div className="flex flex-col gap-2">
                <Input
                  label="Wallet Address"
                  placeholder={selectedNet?.placeholder ?? ''}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {selectedNet?.hint && (
                  <span className="text-[11px] text-[var(--text-tertiary)] -mt-1">{selectedNet.hint}</span>
                )}
              </div>
            )}

            {formError && <Alert>{formError}</Alert>}

            <Button type="submit" loading={addWallet.isPending} disabled={!network}>
              Whitelist Wallet
            </Button>
          </form>
        </Card>
      )}

      {wallets && wallets.length > 0 ? (
        <Card>
          <div className="flex flex-col">
            <div className="grid grid-cols-[1.2fr_2fr_1fr_0.8fr] py-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] border-b border-border max-sm:grid-cols-[1fr_1.5fr_1fr] max-sm:[&>span:last-child]:hidden">
              <span>Label</span>
              <span>Address</span>
              <span>Network</span>
              <span>Status</span>
            </div>
            {wallets.map((w) => (
              <div key={w.id} className="grid grid-cols-[1.2fr_2fr_1fr_0.8fr] py-3 px-3 text-[13px] text-muted-foreground border-b border-border items-center last:border-b-0 max-sm:grid-cols-[1fr_1.5fr_1fr] max-sm:[&>span:last-child]:hidden">
                <span className="font-medium text-foreground">{w.label}</span>
                <span className="font-mono text-xs text-[var(--text-tertiary)]" title={w.address}>
                  {w.address.slice(0, 8)}...{w.address.slice(-6)}
                </span>
                <span>
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 border rounded-full text-[11px] font-semibold" style={{ borderColor: `${getNetworkColor(w.network)}44`, background: `${getNetworkColor(w.network)}11`, color: getNetworkColor(w.network) }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: getNetworkColor(w.network) }} />
                    {w.network}
                  </span>
                </span>
                <span className="inline-flex items-center py-0.5 px-2.5 bg-[var(--success-bg)] text-[var(--success)] rounded-full text-[11px] font-semibold w-fit">Whitelisted</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        !showForm && (
          <Card>
            <div className="flex flex-col items-center gap-3 py-12 px-8 text-center">
              <div className="text-[var(--text-tertiary)] opacity-50 mb-1">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
              </div>
              <p className="font-mono text-base font-semibold text-foreground m-0">No wallets whitelisted yet</p>
              <p className="text-[13px] text-[var(--text-tertiary)] max-w-[360px] leading-relaxed m-0">
                Add a Solana, Ethereum, or Blockstream AMP wallet to start receiving OTC settlements.
              </p>
              <Button size="sm" onClick={() => setShowForm(true)}>
                Whitelist your first wallet
              </Button>
            </div>
          </Card>
        )
      )}
    </div>
  );
}
