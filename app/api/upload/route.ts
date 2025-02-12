import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function POST(request: Request) {
  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    
    // Optimize image
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, null, { // Max width 1200px, maintain aspect ratio
        withoutEnlargement: true,
      })
      .webp({ quality: 80 }) // Convert to WebP format
      .toBuffer()

    // Save original size for OG image
    if (formData.get('isOG') === 'true') {
      const ogBuffer = await sharp(buffer)
        .resize(1200, 630, { fit: 'cover' }) // OG image dimensions
        .webp({ quality: 90 })
        .toBuffer()
      
      await writeFile(join(UPLOAD_DIR, `og-${filename}.webp`), ogBuffer)
    }

    await writeFile(join(UPLOAD_DIR, `${filename}.webp`), optimizedBuffer)
    const url = `/uploads/${filename}.webp`

    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 