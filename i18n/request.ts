import { getRequestConfig } from 'next-intl/server'
import { unstable_cache } from 'next/cache'
import { routing } from './routing'

type Locale = (typeof routing.locales)[number]

/**
 * Fetch all DB overrides for a locale, cached with a 'translations' tag.
 * Returns null if the DB is unavailable (fallback to static JSON).
 */
const getDbOverrides = unstable_cache(
  async (locale: Locale): Promise<Record<string, Record<string, string>> | null> => {
    try {
      // Dynamic import to avoid loading DB code in edge environments
      const { getDb } = await import('../api/lib/db')
      const sql = getDb()
      const rows = await sql<{ namespace: string; key_path: string; value: string }[]>`
        SELECT namespace, key_path, ${sql(locale)} AS value
        FROM page_translations
        WHERE ${sql(locale)} != ''
      `
      // Build nested map: overrides[namespace][key_path] = value
      const overrides: Record<string, Record<string, string>> = {}
      for (const row of rows) {
        if (!overrides[row.namespace]) overrides[row.namespace] = {}
        overrides[row.namespace][row.key_path] = row.value
      }
      return overrides
    } catch {
      return null
    }
  },
  ['translations'],
  { tags: ['translations'], revalidate: 60 },
)

/**
 * Set a deeply nested value using a dot-path key.
 * Mutates obj in place. Safe for non-existent intermediate keys.
 */
function setDeep(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (typeof cur[part] !== 'object' || cur[part] === null) {
      cur[part] = {}
    }
    cur = cur[part] as Record<string, unknown>
  }
  // Try to restore arrays/objects stored as JSON strings
  let parsed: unknown = value
  if (value.startsWith('[') || value.startsWith('{')) {
    try { parsed = JSON.parse(value) } catch { /* keep as string */ }
  }
  cur[parts[parts.length - 1]] = parsed
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  // Load static JSON as the base
  const messages = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>

  // Merge DB overrides on top (best-effort — falls back to static if DB unavailable)
  const overrides = await getDbOverrides(locale as Locale)
  if (overrides) {
    for (const [namespace, keys] of Object.entries(overrides)) {
      if (typeof messages[namespace] !== 'object' || messages[namespace] === null) {
        messages[namespace] = {}
      }
      for (const [keyPath, value] of Object.entries(keys)) {
        setDeep(messages[namespace] as Record<string, unknown>, keyPath, value)
      }
    }
  }

  return { locale, messages }
})
