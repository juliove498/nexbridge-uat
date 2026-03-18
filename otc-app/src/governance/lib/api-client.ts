// ============================================================================
// Governance API Client
// Wraps fetch() with a configurable base URL so API calls point to the correct
// backend (Vercel serverless functions or local dev proxy).
// ============================================================================

const API_BASE = import.meta.env.VITE_GOVERNANCE_API_BASE ?? "";

function buildUrl(path: string): string {
  // If path already starts with http, use as-is
  if (path.startsWith("http")) return path;
  // Ensure path starts with /
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
  return res.json();
}

export async function apiGet<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "GET",
    ...options,
  });
  return res.json();
}

export { API_BASE };
