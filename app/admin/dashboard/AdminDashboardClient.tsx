"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const ArticlesList = dynamic(() => import("@/components/admin/ArticlesList"), {
  ssr: false,
});
const ArticleEditor = dynamic(
  () => import("@/components/admin/ArticleEditor"),
  { ssr: false },
);
const TranslationsEditor = dynamic(
  () => import("@/components/admin/TranslationsEditor"),
  { ssr: false },
);

interface User {
  email: string;
  role: string;
  name: string | null;
  sessionId: number;
}

type Section = "overview" | "insights" | "content";
type InsightsView = "list" | "create" | "edit";

interface EditingArticle {
  id: string;
  slug: string;
  badge_type: string;
  hero_image_url: string;
  hero_image_alt: string;
  display_order: number;
  translations: {
    locale: string;
    title: string;
    excerpt: string;
    badge_label: string;
    date_label: string;
    body_html: string;
  }[];
}

async function logout() {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
  window.location.href = "/admin/login";
}

const NAV_ITEMS: { key: Section; label: string; icon: React.ReactNode }[] = [
  {
    key: "overview",
    label: "Overview",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    key: "insights",
    label: "Insights",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    key: "content",
    label: "Content",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function AdminDashboardClient({ user }: { user: User }) {
  const firstName = user.name?.split(" ")[0] ?? null;
  const [section, setSection] = useState<Section>("insights");
  const [insightsView, setInsightsView] = useState<InsightsView>("list");
  const [editingArticle, setEditingArticle] = useState<EditingArticle | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = useCallback((article: EditingArticle) => {
    setEditingArticle(article);
    setInsightsView("edit");
  }, []);

  const handleCreate = useCallback(() => {
    setEditingArticle(null);
    setInsightsView("create");
  }, []);

  const handleCancel = useCallback(() => {
    setEditingArticle(null);
    setInsightsView("list");
  }, []);

  const handleSave = useCallback(
    async (
      data: Parameters<
        typeof import("@/components/admin/ArticleEditor").default extends (
          props: infer P,
        ) => unknown
          ? P extends { onSave: (d: infer D) => unknown }
            ? (d: D) => void
            : never
          : never
      >[0],
    ) => {
      setSaving(true);
      try {
        const isEdit = insightsView === "edit" && editingArticle;
        const url = isEdit
          ? `/api/admin/articles/${encodeURIComponent(editingArticle.id)}`
          : "/api/admin/articles";
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to save");
        }

        setInsightsView("list");
        setEditingArticle(null);
        setRefreshKey((k) => k + 1);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to save article");
      } finally {
        setSaving(false);
      }
    },
    [insightsView, editingArticle],
  );

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
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">{user.email}</span>
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
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-border bg-card p-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSection(item.key);
                if (item.key === "insights") setInsightsView("list");
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                section === item.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto ${section === "content" ? "p-0 flex flex-col" : "p-6"}`}>
          {section === "overview" && (
            <div className="max-w-md mx-auto">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
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
                      <span className="text-sm text-foreground">
                        {user.name}
                      </span>
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
          )}

          {section === "insights" && insightsView === "list" && (
            <ArticlesList
              onEdit={handleEdit}
              onCreate={handleCreate}
              refreshKey={refreshKey}
            />
          )}

          {section === "insights" &&
            (insightsView === "create" || insightsView === "edit") && (
              <ArticleEditor
                initial={editingArticle ? { ...editingArticle } : undefined}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
            )}

          {section === "content" && (
            <div className="flex-1 flex min-h-0 overflow-hidden">
              <TranslationsEditor />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
