import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import type { DepositResponse, DepositStatusResponse } from '../pages/create-request/data';

// Demo mode: simulates the full deposit lifecycle when the backend
// /deposits endpoint is not yet deployed (returns 404).

const DEMO_ADDRESS = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97';
const DEMO_TX_DEPOSIT = '0xa1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890';
const DEMO_TX_OUTPUT = '0xf0e1d2c3b4a596870fedcba0987654321fedcba0987654321fedcba09876543';

function makeDemoDeposit(data: {
  asset: string;
  side: 'buy' | 'sell';
  amount: number;
}): DepositResponse {
  const rate = 1.0475; // mock USTBL/USDT rate
  return {
    id: `demo_${Date.now()}`,
    depositAddress: DEMO_ADDRESS,
    amount: data.amount,
    network: 'ethereum',
    token: 'USDT',
    status: 'pending_deposit',
    rate,
    outputAmount: data.side === 'buy' ? data.amount / rate : data.amount * rate,
    outputAsset: data.side === 'buy' ? data.asset : 'USDT',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(), // 30 min
  };
}

// ---- Hooks ----

export function useCreateDeposit() {
  return useMutation({
    mutationFn: async (data: {
      asset: string;
      side: 'buy' | 'sell';
      amount: number;
      walletId: string;
      notes?: string;
    }) => {
      try {
        return await api.post<DepositResponse>('/deposits', data);
      } catch (e) {
        // If endpoint not deployed yet, fall back to demo mode
        if (e instanceof ApiError && e.status === 404) {
          // Simulate network delay
          await new Promise(r => setTimeout(r, 800));
          return makeDemoDeposit(data);
        }
        throw e;
      }
    },
  });
}

export function useDepositStatus(depositId: string | null) {
  const isDemo = depositId?.startsWith('demo_') ?? false;

  // Real API polling (non-demo)
  const realQuery = useQuery({
    queryKey: ['deposits', depositId],
    queryFn: () => api.get<DepositStatusResponse>(`/deposits/${depositId}`),
    enabled: !!depositId && !isDemo,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 10_000;
      if (['complete', 'expired', 'failed'].includes(status)) return false;
      if (status === 'confirming') return 8_000;
      return 10_000;
    },
    refetchIntervalInBackground: true,
  });

  // Demo simulation
  const [demoData, setDemoData] = useState<DepositStatusResponse | null>(null);
  const tickRef = useRef(0);

  const advanceDemo = useCallback(() => {
    if (!depositId || !isDemo) return;

    tickRef.current += 1;
    const tick = tickRef.current;

    setDemoData(prev => {
      const base: DepositStatusResponse = prev ?? {
        id: depositId,
        status: 'pending_deposit',
        depositAddress: DEMO_ADDRESS,
        amount: 0,
        network: 'ethereum',
        token: 'USDT',
        confirmations: 0,
        requiredConfirmations: 12,
        rate: 1.0475,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Timeline: tick 1-2 = pending, 3 = detected, 4+ = confirming, 16 = complete
      if (tick <= 2) {
        return { ...base, status: 'pending_deposit', updatedAt: new Date().toISOString() };
      }
      if (tick === 3) {
        return {
          ...base,
          status: 'detected',
          depositTxId: DEMO_TX_DEPOSIT,
          confirmations: 0,
          updatedAt: new Date().toISOString(),
        };
      }
      const confirmations = Math.min(tick - 3, 12);
      if (confirmations < 12) {
        return {
          ...base,
          status: 'confirming',
          depositTxId: DEMO_TX_DEPOSIT,
          confirmations,
          updatedAt: new Date().toISOString(),
        };
      }
      return {
        ...base,
        status: 'complete',
        depositTxId: DEMO_TX_DEPOSIT,
        outputTxId: DEMO_TX_OUTPUT,
        confirmations: 12,
        outputAmount: base.amount / base.rate,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [depositId, isDemo]);

  useEffect(() => {
    if (!isDemo || !depositId) return;
    // Start with initial state
    tickRef.current = 0;
    advanceDemo();
    // Advance every 3 seconds for demo
    const id = setInterval(advanceDemo, 3_000);
    return () => clearInterval(id);
  }, [isDemo, depositId, advanceDemo]);

  // Return the right data depending on mode
  if (isDemo) {
    return { data: demoData ?? undefined, isLoading: false, error: null } as unknown as typeof realQuery;
  }
  return realQuery;
}
