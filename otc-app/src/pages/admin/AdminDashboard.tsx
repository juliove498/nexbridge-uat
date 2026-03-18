import { useAdminSession } from '../../context/AdminSessionContext';
import { logout } from '../../lib/admin-auth';

export function AdminDashboard() {
  const { user } = useAdminSession();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/otc-uat/nexbridge-icon-white.png"
            alt="NexBridge"
            className="w-7 h-7 rounded-md object-contain"
          />
          <span className="font-mono text-base font-bold text-foreground">
            NexBridge <span className="text-primary">Admin</span>
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Session indicator */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary to-[var(--orange-light)] rounded-b-sm" />

            {/* Authenticated icon */}
            <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[#34D399] text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              Sesión activa
            </div>

            <h1 className="font-mono text-2xl font-bold text-foreground mb-2">
              Bienvenido{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Autenticación verificada correctamente. La sesión expira tras 2&nbsp;horas
              o 15&nbsp;minutos de inactividad.
            </p>

            {/* User metadata */}
            <div className="bg-secondary border border-border rounded-lg divide-y divide-border text-left">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-muted-foreground font-medium">Email</span>
                <span className="text-sm text-foreground font-mono">{user?.email ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-muted-foreground font-medium">Rol</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(232,100,44,0.12)] text-primary border border-[rgba(232,100,44,0.2)]">
                  {user?.role ?? '—'}
                </span>
              </div>
              {user?.name && (
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-xs text-muted-foreground font-medium">Nombre</span>
                  <span className="text-sm text-foreground">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
