"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const LOCALES = ["en", "es", "it", "pt", "fr"] as const;
const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
  it: "IT",
  pt: "PT",
  fr: "FR",
};

// Keys that contain HTML markup — warn the user
const HTML_HINT_RE = /<[a-z]/i;

interface TranslationRow {
  id: number;
  namespace: string;
  key_path: string;
  en: string;
  es: string;
  it: string;
  pt: string;
  fr: string;
  updated_at: string;
  updated_by: string | null;
}

interface NamespaceInfo {
  namespace: string;
  count: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

// Per-cell save state key: `${namespace}::${key_path}::${locale}`
type CellKey = string;

function cellKey(namespace: string, key_path: string, locale: string): CellKey {
  return `${namespace}::${key_path}::${locale}`;
}

// ── Auto-resize textarea ──────────────────────────────────────────────────────

function AutoTextarea({
  value,
  onChange,
  onBlur,
  saveState,
  hasHtml,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  saveState: SaveState;
  hasHtml: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const borderClass =
    saveState === "saving"
      ? "border-blue-500/50"
      : saveState === "saved"
        ? "border-emerald-500/50"
        : saveState === "error"
          ? "border-destructive/60"
          : "border-border";

  return (
    <div className="relative">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={1}
        className={`w-full resize-none overflow-hidden bg-transparent text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40 border rounded px-2 py-1.5 outline-none transition-colors duration-150 focus:border-primary/50 ${borderClass}`}
        style={{ minHeight: "2rem" }}
      />
      {hasHtml && (
        <span
          title="This value contains HTML markup"
          className="absolute top-1 right-1 text-[9px] text-amber-400/70 font-mono pointer-events-none select-none"
        >
          HTML
        </span>
      )}
      {saveState === "saving" && (
        <span className="absolute bottom-1 right-1.5 text-[9px] text-blue-400 animate-pulse">
          saving…
        </span>
      )}
      {saveState === "saved" && (
        <span className="absolute bottom-1 right-1.5 text-[9px] text-emerald-400">
          ✓
        </span>
      )}
      {saveState === "error" && (
        <span className="absolute bottom-1 right-1.5 text-[9px] text-destructive">
          ✕
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TranslationsEditor() {
  const [namespaces, setNamespaces] = useState<NamespaceInfo[]>([]);
  const [activeNs, setActiveNs] = useState<string | null>(null);
  const [rows, setRows] = useState<TranslationRow[]>([]);
  const [loadingNs, setLoadingNs] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [nsError, setNsError] = useState("");
  const [rowsError, setRowsError] = useState("");
  const [search, setSearch] = useState("");
  const [cellStates, setCellStates] = useState<Record<CellKey, SaveState>>({});
  // Local edits buffer: cellKey → current value (before/after save)
  const [edits, setEdits] = useState<Record<CellKey, string>>({});
  // Track which cells have been touched since last save
  const dirtyRef = useRef<Set<CellKey>>(new Set());

  // Load namespaces on mount
  useEffect(() => {
    setLoadingNs(true);
    setNsError("");
    fetch("/api/admin/translations", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load namespaces");
        return r.json();
      })
      .then((data: NamespaceInfo[]) => {
        setNamespaces(data);
        if (data.length > 0) setActiveNs(data[0].namespace);
      })
      .catch((e) => setNsError(e.message))
      .finally(() => setLoadingNs(false));
  }, []);

  // Load rows when active namespace changes
  useEffect(() => {
    if (!activeNs) return;
    setLoadingRows(true);
    setRowsError("");
    setEdits({});
    dirtyRef.current.clear();
    fetch(`/api/admin/translations?namespace=${encodeURIComponent(activeNs)}`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load rows");
        return r.json();
      })
      .then((data: TranslationRow[]) => setRows(data))
      .catch((e) => setRowsError(e.message))
      .finally(() => setLoadingRows(false));
  }, [activeNs]);

  const getValue = useCallback(
    (row: TranslationRow, locale: string): string => {
      const key = cellKey(row.namespace, row.key_path, locale);
      return key in edits ? edits[key] : row[locale as keyof TranslationRow] as string;
    },
    [edits],
  );

  const handleChange = useCallback(
    (row: TranslationRow, locale: string, value: string) => {
      const key = cellKey(row.namespace, row.key_path, locale);
      setEdits((prev) => ({ ...prev, [key]: value }));
      dirtyRef.current.add(key);
    },
    [],
  );

  const handleBlur = useCallback(
    async (row: TranslationRow, locale: string) => {
      const key = cellKey(row.namespace, row.key_path, locale);
      if (!dirtyRef.current.has(key)) return;
      dirtyRef.current.delete(key);

      const value = edits[key] ?? row[locale as keyof TranslationRow] as string;

      setCellStates((prev) => ({ ...prev, [key]: "saving" }));
      try {
        const res = await fetch("/api/admin/translations", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namespace: row.namespace,
            key_path: row.key_path,
            locale,
            value,
          }),
        });
        if (!res.ok) throw new Error("Save failed");
        // Update the row in state so it reflects the saved value
        setRows((prev) =>
          prev.map((r) =>
            r.namespace === row.namespace && r.key_path === row.key_path
              ? { ...r, [locale]: value }
              : r,
          ),
        );
        setCellStates((prev) => ({ ...prev, [key]: "saved" }));
        // Clear the "saved" indicator after 2s
        setTimeout(() => {
          setCellStates((prev) => {
            const next = { ...prev };
            if (next[key] === "saved") delete next[key];
            return next;
          });
        }, 2000);
      } catch {
        setCellStates((prev) => ({ ...prev, [key]: "error" }));
      }
    },
    [edits],
  );

  const filteredRows = search.trim()
    ? rows.filter(
        (r) =>
          r.key_path.toLowerCase().includes(search.toLowerCase()) ||
          LOCALES.some((l) =>
            (r[l] as string).toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : rows;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full min-h-0 gap-0">
      {/* Namespace sidebar */}
      <aside className="w-48 shrink-0 border-r border-border overflow-y-auto">
        <div className="px-3 pt-3 pb-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Sections
          </p>
        </div>
        {loadingNs && (
          <p className="px-3 text-xs text-muted-foreground animate-pulse">
            Loading…
          </p>
        )}
        {nsError && (
          <p className="px-3 text-xs text-destructive">{nsError}</p>
        )}
        {namespaces.map((ns) => (
          <button
            key={ns.namespace}
            onClick={() => {
              setActiveNs(ns.namespace);
              setSearch("");
            }}
            className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm transition-colors ${
              activeNs === ns.namespace
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <span className="truncate">{ns.namespace}</span>
            <span className="text-[10px] opacity-50 ml-1 shrink-0">
              {ns.count}
            </span>
          </button>
        ))}
      </aside>

      {/* Main table area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          <h2 className="font-semibold text-sm shrink-0">
            {activeNs ?? "Select a section"}
          </h2>
          {activeNs && (
            <>
              <div className="flex-1" />
              <input
                type="search"
                placeholder="Search keys or text…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 text-xs bg-secondary border border-border rounded px-2.5 py-1.5 outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
              />
              <span className="text-[11px] text-muted-foreground shrink-0">
                {filteredRows.length} keys
              </span>
            </>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loadingRows && (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground animate-pulse">
              Loading translations…
            </div>
          )}
          {rowsError && (
            <div className="flex items-center justify-center h-32 text-sm text-destructive">
              {rowsError}
            </div>
          )}
          {!loadingRows && !rowsError && activeNs && (
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-card">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground border-b border-border w-[22%]">
                    Key
                  </th>
                  {LOCALES.map((l) => (
                    <th
                      key={l}
                      className="text-left px-2 py-2 font-medium text-muted-foreground border-b border-border"
                    >
                      {LOCALE_LABELS[l]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr
                    key={row.key_path}
                    className={idx % 2 === 0 ? "bg-background" : "bg-card/40"}
                  >
                    <td className="px-3 py-1.5 align-top border-b border-border/50">
                      <span className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed break-all">
                        {row.key_path}
                      </span>
                      {row.updated_by && (
                        <span
                          title={`Last edited by ${row.updated_by} on ${new Date(row.updated_at).toLocaleString()}`}
                          className="block text-[9px] text-muted-foreground/40 mt-0.5 truncate"
                        >
                          {row.updated_by}
                        </span>
                      )}
                    </td>
                    {LOCALES.map((l) => {
                      const val = getValue(row, l);
                      const key = cellKey(row.namespace, row.key_path, l);
                      return (
                        <td
                          key={l}
                          className="px-2 py-1.5 align-top border-b border-border/50"
                        >
                          <AutoTextarea
                            value={val}
                            onChange={(v) => handleChange(row, l, v)}
                            onBlur={() => handleBlur(row, l)}
                            saveState={cellStates[key] ?? "idle"}
                            hasHtml={HTML_HINT_RE.test(val)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-muted-foreground text-xs"
                    >
                      No keys found
                      {search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
