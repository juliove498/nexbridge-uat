import postgres from 'postgres'

let _sql: ReturnType<typeof postgres> | null = null

/**
 * Singleton postgres.js client. max:1 for serverless cold-start safety.
 */
export function getDb(): ReturnType<typeof postgres> {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL environment variable is not set')
    _sql = postgres(url, { ssl: 'require', max: 1 })
  }
  return _sql
}
