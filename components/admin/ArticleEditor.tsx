"use client";

import { useState, useCallback, useRef } from "react";
import TiptapEditor from "./TiptapEditor";

const LOCALES = ["en", "es", "it", "pt", "fr"] as const;
const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  fr: "Français",
};
const BADGE_TYPES = [
  { value: "update", label: "Update" },
  { value: "info", label: "Info" },
  { value: "pressRelease", label: "Press Release" },
];

export interface TranslationData {
  locale: string;
  title: string;
  excerpt: string;
  badge_label: string;
  date_label: string;
  body_html: string;
}

export interface ArticleFormData {
  slug: string;
  badge_type: string;
  hero_image_url: string;
  hero_image_alt: string;
  display_order: number;
  translations: TranslationData[];
}

interface ArticleEditorProps {
  initial?: ArticleFormData & { id?: string };
  onSave: (data: ArticleFormData) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

export default function ArticleEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: ArticleEditorProps) {
  const isEdit = !!initial?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global fields
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [badgeType, setBadgeType] = useState(initial?.badge_type ?? "info");
  const [heroImageUrl, setHeroImageUrl] = useState(
    initial?.hero_image_url ?? "",
  );
  const [heroImageAlt, setHeroImageAlt] = useState(
    initial?.hero_image_alt ?? "",
  );
  const [displayOrder, setDisplayOrder] = useState(initial?.display_order ?? 0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Per-locale translations
  const initTranslations = (): Record<string, TranslationData> => {
    const result: Record<string, TranslationData> = {};
    for (const loc of LOCALES) {
      const existing = initial?.translations.find((t) => t.locale === loc);
      result[loc] = existing ?? {
        locale: loc,
        title: "",
        excerpt: "",
        badge_label: "",
        date_label: "",
        body_html: "",
      };
    }
    return result;
  };
  const [translations, setTranslations] = useState(initTranslations);
  const [activeLocale, setActiveLocale] = useState<string>("en");

  // Auto-slug from EN title
  const updateTranslation = useCallback(
    (locale: string, field: keyof TranslationData, value: string) => {
      setTranslations((prev) => ({
        ...prev,
        [locale]: { ...prev[locale], [field]: value },
      }));
      if (locale === "en" && field === "title" && !isEdit) {
        setSlug(slugify(value));
      }
    },
    [isEdit],
  );

  // Image upload
  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setHeroImageUrl(data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      slug,
      badge_type: badgeType,
      hero_image_url: heroImageUrl,
      hero_image_alt: heroImageAlt,
      display_order: displayOrder,
      translations: LOCALES.map((loc) => translations[loc]),
    });
  };

  const currentTranslation = translations[activeLocale];
  const hasContent = (loc: string) => {
    const t = translations[loc];
    return !!(t.title && t.body_html && t.body_html !== "<p></p>");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Article" : "New Article"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              saving ||
              uploading ||
              !slug ||
              !heroImageUrl ||
              !translations.en.title
            }
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : isEdit ? "Update Article" : "Create Article"}
          </button>
        </div>
      </div>

      {/* Global fields */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          General
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              pattern="[a-z0-9-]+"
              required
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Badge Type
            </label>
            <select
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            >
              {BADGE_TYPES.map((bt) => (
                <option key={bt.value} value={bt.value}>
                  {bt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Image Alt Text
            </label>
            <input
              type="text"
              value={heroImageAlt}
              onChange={(e) => setHeroImageAlt(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Hero image upload */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Hero Image
          </label>
          <div className="flex items-start gap-4">
            {heroImageUrl ? (
              <div className="relative w-48 aspect-video rounded-lg overflow-hidden border border-border bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageUrl}
                  alt={heroImageAlt || "Hero preview"}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setHeroImageUrl("");
                    setHeroImageAlt("");
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black/90"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-48 aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1 transition-colors"
              >
                {uploading ? (
                  <span className="animate-pulse">Uploading…</span>
                ) : (
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload image</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
            />
          </div>
          {uploadError && (
            <p className="text-xs text-destructive mt-1">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Locale tabs + translation fields */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLocale(loc)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeLocale === loc
                  ? "text-primary bg-secondary/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {LOCALE_LABELS[loc]}
              {hasContent(loc) && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
              {activeLocale === loc && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={currentTranslation.title}
                onChange={(e) =>
                  updateTranslation(activeLocale, "title", e.target.value)
                }
                required={activeLocale === "en"}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={currentTranslation.badge_label}
                onChange={(e) =>
                  updateTranslation(activeLocale, "badge_label", e.target.value)
                }
                placeholder="e.g. Press Release, Info, Update…"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Date Label
              </label>
              <input
                type="text"
                value={currentTranslation.date_label}
                onChange={(e) =>
                  updateTranslation(activeLocale, "date_label", e.target.value)
                }
                placeholder="e.g. November 18, 2024"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Excerpt
            </label>
            <textarea
              value={currentTranslation.excerpt}
              onChange={(e) =>
                updateTranslation(activeLocale, "excerpt", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Body Content
            </label>
            <TiptapEditor
              key={activeLocale}
              content={currentTranslation.body_html}
              onChange={(html) =>
                updateTranslation(activeLocale, "body_html", html)
              }
              placeholder={`Write article content in ${LOCALE_LABELS[activeLocale]}…`}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
