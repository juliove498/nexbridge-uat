"use client";

import { useState, useCallback, useEffect } from "react";
import type { ArticleFormData } from "./ArticleEditor";

interface ArticleRow {
  id: string;
  slug: string;
  badge_type: string;
  hero_image_url: string;
  hero_image_alt: string;
  display_order: number;
  published_at: string;
  translations: {
    locale: string;
    title: string;
    excerpt: string;
    badge_label: string;
    date_label: string;
    body_html: string;
  }[];
}

const BADGE_STYLES: Record<string, string> = {
  update:
    "bg-[rgba(232,100,44,0.15)] text-[#E8642C] border-[rgba(232,100,44,0.2)]",
  info: "bg-[rgba(59,130,246,0.12)] text-[#60A5FA] border-[rgba(59,130,246,0.2)]",
  pressRelease:
    "bg-[rgba(139,92,246,0.12)] text-[#A78BFA] border-[rgba(139,92,246,0.2)]",
};

interface ArticlesListProps {
  onEdit: (article: ArticleRow) => void;
  onCreate: () => void;
  refreshKey: number;
}

export default function ArticlesList({
  onEdit,
  onCreate,
  refreshKey,
}: ArticlesListProps) {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/articles", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load articles");
      setArticles(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, refreshKey]);

  const handleDelete = useCallback(async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis action cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete article");
    } finally {
      setDeleting(null);
    }
  }, []);

  const moveArticle = useCallback(
    async (index: number, direction: -1 | 1) => {
      const newArticles = [...articles];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newArticles.length) return;
      [newArticles[index], newArticles[targetIndex]] = [
        newArticles[targetIndex],
        newArticles[index],
      ];
      setArticles(newArticles);

      try {
        await fetch("/api/admin/articles/reorder", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds: newArticles.map((a) => a.id) }),
        });
      } catch {
        fetchArticles(); // revert on error
      }
    },
    [articles, fetchArticles],
  );

  const getEnTitle = (article: ArticleRow) =>
    article.translations.find((t) => t.locale === "en")?.title ?? article.slug;

  const translationCount = (article: ArticleRow) =>
    article.translations.filter((t) => t.title && t.body_html).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive text-sm mb-3">{error}</p>
        <button
          onClick={fetchArticles}
          className="text-sm text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Insights</h2>
          <p className="text-sm text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Article
        </button>
      </div>

      {/* Articles list */}
      {articles.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No articles yet</p>
          <button
            onClick={onCreate}
            className="text-sm text-primary hover:underline"
          >
            Create your first article
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
            >
              {/* Reorder arrows */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveArticle(index, -1)}
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors p-0.5"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <button
                  onClick={() => moveArticle(index, 1)}
                  disabled={index === articles.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors p-0.5"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail */}
              <div className="w-20 aspect-video rounded overflow-hidden bg-secondary flex-shrink-0">
                {article.hero_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.hero_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">
                  {getEnTitle(article)}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${BADGE_STYLES[article.badge_type] ?? BADGE_STYLES.info}`}
                  >
                    {article.badge_type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    /{article.slug}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {translationCount(article)}/5 langs
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(article)}
                  className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id, getEnTitle(article))}
                  disabled={deleting === article.id}
                  className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors disabled:opacity-50"
                >
                  {deleting === article.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { ArticleRow, ArticleFormData };
