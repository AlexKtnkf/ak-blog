import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'
import { ContentEntry } from '@/lib/db/entities/ContentEntry'
import { Tag } from '@/lib/db/entities/Tag'
import { User } from '@/lib/db/entities/User'
import { withDatabase } from '@/lib/db/connection'

export async function GET() {
  const session = await getServerSession(authConfig)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const entries = await em.find(ContentEntry, {}, {
        populate: ['tags', 'blocks'],
        orderBy: { createdAt: 'DESC' }
      })
      return NextResponse.json(entries)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authConfig)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const body = await request.json()
      const author = await em.findOne(User, { email: session?.user?.email })
      
      if (!author) {
        throw new Error('User not found')
      }

      const entry = em.create(ContentEntry, {
        title: body.title,
        slug: body.slug,
        status: body.status,
        type: body.type,
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      })

      if (body.tags?.length) {
        const tags = await em.find(Tag, { id: { $in: body.tags.map((t: any) => t.id) } })
        entry.tags.set(tags)
      }

      await em.persistAndFlush(entry)
      await em.populate(entry, ['tags'])
      return NextResponse.json(entry)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
} 