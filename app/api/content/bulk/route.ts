import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'
import { withDatabase } from '@/lib/db/connection'
import { ContentEntry } from '@/lib/db/entities/ContentEntry'

export async function POST(request: Request) {
  const session = await getServerSession(authConfig)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const { ids, action } = await request.json()
      const entries = await em.find(ContentEntry, { id: { $in: ids } })
      
      switch (action) {
        case 'publish':
          entries.forEach(entry => {
            entry.status = 'published'
            entry.publishedAt = new Date()
          })
          break
        case 'unpublish':
          entries.forEach(entry => {
            entry.status = 'draft'
            entry.publishedAt = undefined
          })
          break
        case 'delete':
          await em.removeAndFlush(entries)
          return NextResponse.json({ success: true })
      }

      await em.flush()
      return NextResponse.json({ success: true })
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
} 