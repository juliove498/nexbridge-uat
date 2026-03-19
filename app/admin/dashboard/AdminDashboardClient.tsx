"use client";

interface User {
  email: string;
  role: string;
  name: string | null;
  sessionId: number;
}

async function logout() {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
  window.location.href = "/admin/login";
}

export default function AdminDashboardClient({ user }: { user: User }) {
  const firstName = user.name?.split(" ")[0] ?? null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/issuance-logos/ustbl.svg"
            alt="NexBridge"
            className="w-7 h-7"
          />
          <span className="font-bold text-base tracking-tight">
            NexBridge <span className="text-primary">Admin</span>
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary to-transparent" />

            {/* Shield icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34D399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>

            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "#34D399",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              Sesión activa
            </div>

            <h1 className="text-2xl font-bold mb-2">
              Bienvenido{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
              Autenticación verificada. La sesión expira tras 2&nbsp;horas o
              15&nbsp;minutos de inactividad.
            </p>

            {/* User info */}
            <div className="bg-secondary border border-border rounded-xl divide-y divide-border text-left overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-muted-foreground font-medium">
                  Email
                </span>
                <span className="text-sm font-mono text-foreground">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-muted-foreground font-medium">
                  Rol
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(232,100,44,0.1)",
                    border: "1px solid rgba(232,100,44,0.2)",
                    color: "var(--color-primary)",
                  }}
                >
                  {user.role}
                </span>
              </div>
              {user.name && (
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    Nombre
                  </span>
                  <span className="text-sm text-foreground">{user.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-muted-foreground font-medium">
                  Session ID
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  #{user.sessionId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
