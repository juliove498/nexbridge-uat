import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { verifySession, type AdminUser } from '../lib/admin-auth';

interface AdminSessionState {
  user: AdminUser | null;
  /** true while the initial session check is in progress */
  loading: boolean;
}

const AdminSessionContext = createContext<AdminSessionState>({ user: null, loading: true });

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminSessionState>({ user: null, loading: true });

  useEffect(() => {
    verifySession()
      .then(user => setState({ user, loading: false }))
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  return (
    <AdminSessionContext.Provider value={state}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession(): AdminSessionState {
  return useContext(AdminSessionContext);
}
