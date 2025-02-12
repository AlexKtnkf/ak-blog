import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'
import { withDatabase } from '@/lib/db/connection'
import { ContentEntry } from '@/lib/db/entities/ContentEntry'
import { Block } from '@/lib/db/entities/Block'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const body = await request.json()
      
      const entry = await em.findOne(ContentEntry, { id: parseInt(params.id) })
      if (!entry) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }

      const block = em.create(Block, {
        contentEntry: entry,
        type: body.type,
        position: body.position,
        data: body.data,
        url: body.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await em.persistAndFlush(block)
      return NextResponse.json(block)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 })
  }
} 