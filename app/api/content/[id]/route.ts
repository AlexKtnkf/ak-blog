import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'
import { withDatabase } from '@/lib/db/connection'
import { ContentEntry } from '@/lib/db/entities/ContentEntry'
import { Tag } from '@/lib/db/entities/Tag'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const entry = await em.findOne(ContentEntry, { id: parseInt(params.id) }, {
        populate: ['tags', 'blocks']
      })
      
      if (!entry) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }

      return NextResponse.json(entry)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      
      const entry = await em.findOne(ContentEntry, { id: parseInt(params.id) }, {
        populate: ['tags']
      })
      
      if (!entry) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }

      // Update basic fields
      em.assign(entry, {
        title: body.title,
        slug: body.slug,
        status: body.status,
        type: body.type,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      })

      // Update tags
      if (body.tags) {
        const tags = await em.find(Tag, { id: { $in: body.tags.map((t: any) => t.id) } })
        entry.tags.set(tags)
      }

      await em.flush()
      
      return NextResponse.json(entry)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await withDatabase(async (orm) => {
      const em = orm.em.fork()
      const entry = await em.findOne(ContentEntry, { id: parseInt(params.id) })
      
      if (!entry) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }

      await em.removeAndFlush(entry)
      return NextResponse.json({ success: true })
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
} 