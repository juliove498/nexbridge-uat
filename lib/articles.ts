/**
 * Data-access layer for articles (Insights CMS).
 * Uses the existing postgres.js singleton from api/lib/db.
 */

import { getDb } from '@/api/lib/db'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ArticleTranslation {
  locale: string
  title: string
  excerpt: string
  badge_label: string
  date_label: string
  body_html: string
}

export interface Article {
  id: string
  slug: string
  badge_type: string
  hero_image_url: string
  hero_image_alt: string
  display_order: number
  published_at: string
  created_at: string
  updated_at: string
}

export interface ArticleWithTranslations extends Article {
  translations: ArticleTranslation[]
}

export interface PublicArticle {
  id: string
  slug: string
  badge_type: string
  hero_image_url: string
  hero_image_alt: string
  title: string
  excerpt: string
  badge_label: string
  date_label: string
  body_html: string
}

// ── Queries ──────────────────────────────────────────────────────────────────

/** List all articles with all translations (admin). Ordered by display_order. */
export async function getArticles(): Promise<ArticleWithTranslations[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      a.id, a.slug, a.badge_type, a.hero_image_url, a.hero_image_alt,
      a.display_order, a.published_at, a.created_at, a.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'locale', t.locale,
            'title', t.title,
            'excerpt', t.excerpt,
            'badge_label', t.badge_label,
            'date_label', t.date_label,
            'body_html', t.body_html
          )
        ) FILTER (WHERE t.locale IS NOT NULL),
        '[]'
      ) AS translations
    FROM articles a
    LEFT JOIN article_translations t ON t.article_id = a.id
    GROUP BY a.id
    ORDER BY a.display_order ASC, a.published_at DESC
  `
  return rows.map(r => ({
    ...r,
    translations: typeof r.translations === 'string' ? JSON.parse(r.translations) : r.translations,
  })) as ArticleWithTranslations[]
}

/** Single article by id with all translations (admin). */
export async function getArticleById(id: string): Promise<ArticleWithTranslations | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      a.id, a.slug, a.badge_type, a.hero_image_url, a.hero_image_alt,
      a.display_order, a.published_at, a.created_at, a.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'locale', t.locale,
            'title', t.title,
            'excerpt', t.excerpt,
            'badge_label', t.badge_label,
            'date_label', t.date_label,
            'body_html', t.body_html
          )
        ) FILTER (WHERE t.locale IS NOT NULL),
        '[]'
      ) AS translations
    FROM articles a
    LEFT JOIN article_translations t ON t.article_id = a.id
    WHERE a.id = ${id}
    GROUP BY a.id
  `
  if (!rows.length) return null
  const r = rows[0]
  return {
    ...r,
    translations: typeof r.translations === 'string' ? JSON.parse(r.translations) : r.translations,
  } as ArticleWithTranslations
}

/** Public: single article by slug + locale (with EN fallback). */
export async function getArticleBySlug(slug: string, locale: string): Promise<PublicArticle | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      a.id, a.slug, a.badge_type, a.hero_image_url, a.hero_image_alt,
      COALESCE(t.title, ten.title) AS title,
      COALESCE(t.excerpt, ten.excerpt) AS excerpt,
      COALESCE(t.badge_label, ten.badge_label) AS badge_label,
      COALESCE(t.date_label, ten.date_label) AS date_label,
      COALESCE(t.body_html, ten.body_html) AS body_html
    FROM articles a
    LEFT JOIN article_translations t   ON t.article_id = a.id AND t.locale = ${locale}
    LEFT JOIN article_translations ten ON ten.article_id = a.id AND ten.locale = 'en'
    WHERE a.slug = ${slug}
    LIMIT 1
  `
  return (rows[0] as unknown as PublicArticle) ?? null
}

/** Public: list published articles for a locale (with EN fallback). */
export async function getPublishedArticles(locale: string): Promise<PublicArticle[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      a.id, a.slug, a.badge_type, a.hero_image_url, a.hero_image_alt,
      COALESCE(t.title, ten.title) AS title,
      COALESCE(t.excerpt, ten.excerpt) AS excerpt,
      COALESCE(t.badge_label, ten.badge_label) AS badge_label,
      COALESCE(t.date_label, ten.date_label) AS date_label,
      COALESCE(t.body_html, ten.body_html) AS body_html
    FROM articles a
    LEFT JOIN article_translations t   ON t.article_id = a.id AND t.locale = ${locale}
    LEFT JOIN article_translations ten ON ten.article_id = a.id AND ten.locale = 'en'
    ORDER BY a.display_order ASC, a.published_at DESC
  `
  return rows as unknown as PublicArticle[]
}

/** Public: get all slugs (for generateStaticParams). */
export async function getAllSlugs(): Promise<string[]> {
  const sql = getDb()
  const rows = await sql`SELECT slug FROM articles ORDER BY display_order ASC`
  return rows.map(r => r.slug)
}

// ── Mutations ────────────────────────────────────────────────────────────────

export async function createArticle(data: {
  slug: string
  badge_type: string
  hero_image_url: string
  hero_image_alt: string
  display_order?: number
  translations: ArticleTranslation[]
}): Promise<ArticleWithTranslations> {
  const sql = getDb()
  const [article] = await sql`
    INSERT INTO articles (slug, badge_type, hero_image_url, hero_image_alt, display_order)
    VALUES (${data.slug}, ${data.badge_type}, ${data.hero_image_url}, ${data.hero_image_alt}, ${data.display_order ?? 0})
    RETURNING *
  `

  for (const t of data.translations) {
    await sql`
      INSERT INTO article_translations (article_id, locale, title, excerpt, badge_label, date_label, body_html)
      VALUES (${article.id}, ${t.locale}, ${t.title}, ${t.excerpt}, ${t.badge_label}, ${t.date_label}, ${t.body_html})
    `
  }

  return (await getArticleById(article.id))!
}

export async function updateArticle(id: string, data: {
  slug?: string
  badge_type?: string
  hero_image_url?: string
  hero_image_alt?: string
  display_order?: number
  translations?: ArticleTranslation[]
}): Promise<ArticleWithTranslations | null> {
  const sql = getDb()

  // Check article exists
  const [existing] = await sql`SELECT id FROM articles WHERE id = ${id}`
  if (!existing) return null

  // Update article fields
  await sql`
    UPDATE articles SET
      slug           = COALESCE(${data.slug ?? null}, slug),
      badge_type     = COALESCE(${data.badge_type ?? null}, badge_type),
      hero_image_url = COALESCE(${data.hero_image_url ?? null}, hero_image_url),
      hero_image_alt = COALESCE(${data.hero_image_alt ?? null}, hero_image_alt),
      display_order  = COALESCE(${data.display_order ?? null}, display_order),
      updated_at     = NOW()
    WHERE id = ${id}
  `

  // Upsert translations
  if (data.translations) {
    for (const t of data.translations) {
      await sql`
        INSERT INTO article_translations (article_id, locale, title, excerpt, badge_label, date_label, body_html)
        VALUES (${id}, ${t.locale}, ${t.title}, ${t.excerpt}, ${t.badge_label}, ${t.date_label}, ${t.body_html})
        ON CONFLICT (article_id, locale) DO UPDATE SET
          title       = EXCLUDED.title,
          excerpt     = EXCLUDED.excerpt,
          badge_label = EXCLUDED.badge_label,
          date_label  = EXCLUDED.date_label,
          body_html   = EXCLUDED.body_html
      `
    }
  }

  return getArticleById(id)
}

export async function deleteArticle(id: string): Promise<boolean> {
  const sql = getDb()
  const result = await sql`DELETE FROM articles WHERE id = ${id} RETURNING id`
  return result.length > 0
}

export async function reorderArticles(orderedIds: string[]): Promise<void> {
  const sql = getDb()
  for (let i = 0; i < orderedIds.length; i++) {
    await sql`UPDATE articles SET display_order = ${i}, updated_at = NOW() WHERE id = ${orderedIds[i]}`
  }
}
