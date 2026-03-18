import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

// ----- Types -----

export interface OtcSettings {
  assets: Array<{
    id: string;
    name: string;
    ticker: string;
    networks: string[];
    minAmount: number;
    maxAmount: number;
  }>;
  fees: Record<string, number>;
}

export interface UserProfile {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  kycStatus: 'not_started' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface WalletAddress {
  id: string;
  label: string;
  address: string;
  network: string;
  createdAt: string;
}

export interface OtcRequest {
  id: string;
  asset: string;
  side: 'buy' | 'sell';
  amount: number;
  status: string;
  walletId: string;
  createdAt: string;
  updatedAt: string;
}

// ----- Hooks -----

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        return await api.get<OtcSettings>('/settings');
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      try {
        return await api.get<UserProfile>('/users/me');
      } catch (e) {
        // 404 = user exists in Cognito but not yet in OTC backend
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
    },
  });
}

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      try {
        return await api.get<OtcRequest[]>('/requests');
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return [];
        throw e;
      }
    },
  });
}

// LocalStorage fallback for wallets when API is not available
const WALLETS_STORAGE_KEY = 'otc_wallets';

function getLocalWallets(): WalletAddress[] {
  try {
    const stored = localStorage.getItem(WALLETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveLocalWallet(data: { label: string; address: string; network: string }): WalletAddress {
  const wallets = getLocalWallets();
  const newWallet: WalletAddress = {
    id: `local_${Date.now()}`,
    label: data.label,
    address: data.address,
    network: data.network,
    createdAt: new Date().toISOString(),
  };
  wallets.push(newWallet);
  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));
  return newWallet;
}

export function useWallets() {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      try {
        const apiWallets = await api.get<WalletAddress[]>('/addresses');
        return apiWallets;
      } catch (e) {
        if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
          // API not available, use localStorage fallback
          return getLocalWallets();
        }
        throw e;
      }
    },
  });
}

export function useCreateKycUrl(userId: string) {
  return useMutation({
    mutationFn: () =>
      api.post<{ url: string }>(`/users/${userId}/createKycUrl`),
  });
}

export function useAddWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { label: string; address: string; network: string }) => {
      try {
        return await api.post<WalletAddress>('/addresses', data);
      } catch (e) {
        if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
          // API not available, store locally
          return saveLocalWallet(data);
        }
        throw e;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: () => api.get<OtcRequest>(`/requests/${id}`),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      asset: string;
      side: 'buy' | 'sell';
      amount: number;
      walletId: string;
      notes?: string;
    }) => api.post<OtcRequest>('/requests', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  });
}

export function useDownloadPdf(requestId: string) {
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`/requests/${requestId}/pdf`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `otc-request-${requestId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
