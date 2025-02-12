'use client'

import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ContentForm } from '@/components/admin/ContentForm'
import { useToast } from '@/components/ToastContext'

export default function EditContent({ params }: { params: { id: string } }) {
  const { showToast } = useToast()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch content')
        const data = await response.json()
        setContent(data)
      } catch (error) {
        showToast('Failed to load content', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [params.id, showToast])

  if (loading) return <div>Loading...</div>
  if (!content) return <div>Content not found</div>

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Content
      </Typography>
      <ContentForm
        initialData={content}
        isEditing
        id={parseInt(params.id)}
      />
    </Box>
  )
} 