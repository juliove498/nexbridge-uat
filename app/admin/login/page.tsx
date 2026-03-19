"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function adminLogin(email: string, password: string) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = Object.assign(
      new Error(body.error ?? `Login failed (${res.status})`),
      {
        status: res.status,
        retryAfterSeconds: body.retryAfterSeconds as number | undefined,
      },
    );
    throw err;
  }
  return body as { email: string; role: string; name: string | null };
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRetryAfter(null);
    setLoading(true);
    try {
      await adminLogin(email, password);
      router.replace("/admin/dashboard");
    } catch (err) {
      const e = err as Error & { status?: number; retryAfterSeconds?: number };
      if (e.status === 429 && e.retryAfterSeconds) {
        const mins = Math.ceil(e.retryAfterSeconds / 60);
        setRetryAfter(mins);
        setError(
          `Demasiados intentos fallidos. Intentá de nuevo en ${mins} minuto${mins !== 1 ? "s" : ""}.`,
        );
      } else {
        setError(e.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-100">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 relative shadow-2xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary to-transparent rounded-b-sm" />

          {/* Logo + title */}
          <div className="flex items-center gap-2.5 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/issuance-logos/ustbl.svg"
              alt="NexBridge"
              className="w-8 h-8"
            />
            <span className="font-bold text-lg tracking-tight">
              NexBridge <span className="text-primary">Admin</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground mb-7">
            Acceso restringido al panel de administración.
          </p>

          {/* Error alert */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed">
              {error}
              {retryAfter !== null && (
                <span className="block mt-1 text-xs opacity-75">
                  Los intentos se registran por cuenta e IP.
                </span>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@nexbridge.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-3 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground outline-none transition-all
                  placeholder:text-muted-foreground/50
                  focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,100,44,0.15)]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-muted-foreground"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 px-4 pr-11 bg-secondary border border-border rounded-lg text-sm text-foreground outline-none transition-all
                    placeholder:text-muted-foreground/50
                    focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,100,44,0.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  aria-label={
                    showPw ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-1"
                >
                  {showPw ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!retryAfter}
              className="mt-2 w-full py-3 px-6 rounded-lg font-semibold text-sm text-white
                bg-linear-to-br from-primary to-orange-400
                shadow-[0_0_20px_rgba(232,100,44,0.2)]
                transition-all duration-200
                hover:not-disabled:shadow-[0_0_30px_rgba(232,100,44,0.35)] hover:not-disabled:-translate-y-px
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
              )}
              {loading ? "Verificando…" : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-6">
          Acceso restringido · NexBridge
        </p>
      </div>
    </div>
  );
}
