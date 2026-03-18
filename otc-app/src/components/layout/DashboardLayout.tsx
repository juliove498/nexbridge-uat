import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '@/lib/utils';

const navItems: Array<{ to: string; label: string; icon: string; end?: boolean }> = [
  { to: '/otc-uat/dashboard', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/otc-uat/profile', label: 'Profile', icon: 'user' },
  { to: '/otc-uat/kyc', label: 'KYC', icon: 'shield' },
  { to: '/otc-uat/wallets', label: 'Wallets', icon: 'wallet' },
  { to: '/otc-uat/requests', label: 'Requests', icon: 'list', end: true },
  { to: '/otc-uat/requests/new', label: 'New Request', icon: 'plus' },
  { to: '/otc-uat/governance', label: 'Governance', icon: 'vote' },
  { to: '/otc-uat/api-docs', label: 'API Docs', icon: 'code' },
  { to: '/otc-uat/security', label: 'Security', icon: 'lock' },
  { to: '/otc-uat/support', label: 'Support', icon: 'help' },
];

const icons: Record<string, JSX.Element> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  code: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  vote: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V5H4v7"/><path d="m2 15 10 6 10-6"/><path d="m2 12 10 6 10-6"/>
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/otc-uat/signin');
  };

  return (
    <div className="flex min-h-screen max-md:flex-col">
      <aside className="w-[260px] bg-card border-r border-border flex flex-col py-6 px-4 fixed top-0 left-0 bottom-0 z-[100] max-md:w-full max-md:relative max-md:border-r-0 max-md:border-b max-md:border-border max-md:flex-row max-md:py-3 max-md:px-4 max-md:overflow-x-auto max-md:gap-2">
        <div className="flex items-center gap-3 px-2 pb-6 border-b border-border mb-4 max-md:hidden">
          <img
            src="/otc-uat/nexbridge-icon-white.png"
            alt="NexBridge"
            className="w-7 h-7 rounded-md object-contain"
          />
          <div>
            <div className="font-mono text-base font-bold text-foreground">NexBridge</div>
            <div className="text-[11px] text-primary font-semibold tracking-wide">OTC Desk</div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1 max-md:flex-row max-md:gap-1 max-md:flex-none">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 py-2.5 px-3 rounded-[var(--radius-md-compat)] text-muted-foreground text-[13px] font-medium no-underline transition-all duration-200 hover:text-foreground hover:bg-secondary max-md:whitespace-nowrap max-md:py-2 max-md:px-3 max-md:text-xs max-md:[&_svg]:hidden',
                  isActive && 'text-foreground! bg-[var(--orange-subtle)]! [&_svg]:text-primary'
                )
              }
            >
              {icons[item.icon]}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border pt-4 flex flex-col gap-3 max-md:hidden">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[var(--orange-light)] flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs text-[var(--text-tertiary)] overflow-hidden text-ellipsis whitespace-nowrap">{user?.email}</div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm-compat)] bg-transparent border border-border text-muted-foreground cursor-pointer transition-all duration-200 shrink-0 hover:text-primary hover:border-[var(--orange-subtle)] hover:bg-[var(--orange-subtle)]"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button
              className="flex-1 bg-transparent border border-border text-muted-foreground py-2 rounded-[var(--radius-sm-compat)] text-xs font-medium cursor-pointer transition-all duration-200 hover:text-destructive hover:border-[var(--error-bg)] hover:bg-[var(--error-bg)]"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-[260px] py-8 px-10 min-h-screen max-md:ml-0 max-md:py-6 max-md:px-5">
        <Outlet />
      </main>
    </div>
  );
}
