import { useReducer, useEffect } from 'react';
import { useCreateDeposit, useDepositStatus } from '../../hooks/useDeposit';
import type { Asset, DepositResponse, DepositStatusResponse } from './data';
import type { WalletAddress, OtcSettings } from '../../hooks/useApi';
import { StepReview } from './steps/StepReview';
import { StepDeposit } from './steps/StepDeposit';
import { StepAwaiting } from './steps/StepAwaiting';
import { StepComplete } from './steps/StepComplete';

// --- State machine ---

type Step = 'review' | 'deposit' | 'awaiting' | 'complete';

interface State {
  step: Step;
  deposit: DepositResponse | null;
  error: string;
}

type Action =
  | { type: 'DEPOSIT_CREATED'; deposit: DepositResponse }
  | { type: 'DEPOSIT_ERROR'; error: string }
  | { type: 'USER_SENT' }
  | { type: 'STATUS_UPDATE'; data: DepositStatusResponse }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DEPOSIT_CREATED':
      return { ...state, step: 'deposit', deposit: action.deposit, error: '' };
    case 'DEPOSIT_ERROR':
      return { ...state, error: action.error };
    case 'USER_SENT':
      return { ...state, step: 'awaiting' };
    case 'STATUS_UPDATE': {
      const s = action.data.status;
      if (s === 'detected' || s === 'confirming' || s === 'confirmed') {
        // Auto-advance to awaiting if still on deposit step
        const nextStep = state.step === 'deposit' ? 'awaiting' : state.step;
        return { ...state, step: nextStep };
      }
      if (s === 'complete') return { ...state, step: 'complete' };
      if (s === 'expired') return { ...state, step: 'deposit', error: 'Deposit window expired. Please start a new trade.' };
      if (s === 'failed') return { ...state, step: 'awaiting', error: 'Deposit failed. Please contact support.' };
      return state;
    }
    case 'RESET':
      return { step: 'review', deposit: null, error: '' };
    default:
      return state;
  }
}

const STEP_INDEX: Record<Step, number> = { review: 0, deposit: 1, awaiting: 2, complete: 3 };
const STEP_LABELS = ['Review', 'Deposit', 'Confirming', 'Complete'];

// --- Props ---

export interface DepositStepperProps {
  asset: Asset;
  side: 'buy' | 'sell';
  amount: number;
  walletId: string;
  notes?: string;
  currentPrice: number | null;
  bidPrice: number | null;
  askPrice: number | null;
  wallets: WalletAddress[] | undefined;
  settings: OtcSettings | null | undefined;
  onCancel: () => void;
  onComplete: (id: string) => void;
}

export function DepositStepper({
  asset, side, amount, walletId, notes, currentPrice, bidPrice, askPrice,
  wallets, settings, onCancel, onComplete,
}: DepositStepperProps) {
  const [state, dispatch] = useReducer(reducer, { step: 'review', deposit: null, error: '' });
  const createDeposit = useCreateDeposit();
  const { data: statusData } = useDepositStatus(state.deposit?.id ?? null);

  // React to polling status updates
  useEffect(() => {
    if (statusData) dispatch({ type: 'STATUS_UPDATE', data: statusData });
  }, [statusData]);

  const apiAssets = settings?.assets ?? [];
  const apiAsset = apiAssets.find(a => a.ticker === asset.ticker);
  const fees = settings?.fees ?? {};
  const feePercent = apiAsset ? fees[apiAsset.id] : 0;

  async function handleConfirm() {
    try {
      const result = await createDeposit.mutateAsync({
        asset: apiAsset?.id ?? asset.ticker,
        side,
        amount,
        walletId,
        notes: notes || undefined,
      });
      dispatch({ type: 'DEPOSIT_CREATED', deposit: result });
    } catch (err) {
      dispatch({ type: 'DEPOSIT_ERROR', error: err instanceof Error ? err.message : 'Failed to create deposit' });
    }
  }

  function handleSent() {
    dispatch({ type: 'USER_SENT' });
  }

  function handleNewTrade() {
    onCancel();
  }

  const effectivePrice = side === 'buy' ? (askPrice || currentPrice) : (bidPrice || currentPrice);
  const receiveAmount = effectivePrice && amount
    ? (side === 'buy' ? amount / effectivePrice : amount * effectivePrice)
    : 0;
  const receiveToken = side === 'buy' ? asset.ticker : 'USDT';
  const payToken = side === 'buy' ? 'USDT' : asset.ticker;
  const wallet = wallets?.find(w => w.id === walletId);
  const activeIndex = STEP_INDEX[state.step];

  return (
    <div className="w-[380px] shrink-0 border-l border-border flex flex-col p-6 gap-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-4">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full border-2 border-border flex items-center justify-center text-[11px] font-bold text-[var(--text-tertiary)] shrink-0 transition-all duration-300 ${i < activeIndex ? 'border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]' : ''} ${i === activeIndex ? 'border-primary text-primary bg-[var(--orange-subtle)]' : ''}`}>
              {i < activeIndex ? (
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className={`text-[10px] text-[var(--text-tertiary)] font-medium hidden sm:block ${i === activeIndex ? 'text-foreground' : ''}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 bg-border mx-1 ${i < activeIndex ? 'bg-[var(--success)]' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Active step */}
      {state.step === 'review' && (
        <StepReview
          asset={asset}
          side={side}
          amount={amount}
          payToken={payToken}
          receiveToken={receiveToken}
          receiveAmount={receiveAmount}
          effectivePrice={effectivePrice}
          feePercent={feePercent ?? 0}
          wallet={wallet}
          error={state.error}
          isPending={createDeposit.isPending}
          onConfirm={handleConfirm}
          onCancel={onCancel}
        />
      )}
      {state.step === 'deposit' && state.deposit && (
        <StepDeposit
          deposit={state.deposit}
          error={state.error}
          onSent={handleSent}
          onCancel={onCancel}
        />
      )}
      {state.step === 'awaiting' && (
        <StepAwaiting
          deposit={state.deposit!}
          statusData={statusData ?? null}
          error={state.error}
        />
      )}
      {state.step === 'complete' && (
        <StepComplete
          deposit={state.deposit!}
          statusData={statusData ?? null}
          asset={asset}
          side={side}
          onViewRequest={() => onComplete(state.deposit!.id)}
          onNewTrade={handleNewTrade}
        />
      )}
    </div>
  );
}
