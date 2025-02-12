import { getORM, closeORM } from './index'

export async function withDatabase<T>(
  callback: (orm: Awaited<ReturnType<typeof getORM>>) => Promise<T>
): Promise<T> {
  const orm = await getORM()
  try {
    return await callback(orm)
  } finally {
    // In development, keep connection alive
    if (process.env.NODE_ENV === 'production') {
      await closeORM()
    }
  }
} 