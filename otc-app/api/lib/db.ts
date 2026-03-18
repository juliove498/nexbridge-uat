import postgres from 'postgres'

let _sql: ReturnType<typeof postgres> | null = null

/**
 * Returns a singleton postgres.js client.
 * Uses max:1 connection to stay within serverless limits.
 */
export function getDb(): ReturnType<typeof postgres> {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL environment variable is not set')
    _sql = postgres(url, { ssl: 'require', max: 1 })
  }
  return _sql
}
