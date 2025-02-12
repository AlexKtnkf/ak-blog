import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'
import { withDatabase } from '@/lib/db/connection'
import { Tag } from '@/lib/db/entities/Tag'

export async function GET() {
  const session = await getServerSession(authConfig)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const tags = await em.find(Tag, {}, { orderBy: { name: 'ASC' } })
      return NextResponse.json(tags)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authConfig)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const body = await request.json()

      const tag = em.create(Tag, {
        name: body.name,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: body.type,
        description: body.description,
        parentId: body.parentId ? parseInt(body.parentId) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await em.persistAndFlush(tag)
      return NextResponse.json(tag)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
} 