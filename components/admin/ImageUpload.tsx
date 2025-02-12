'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material'
import Image from 'next/image'
import { useToast } from '@/components/ToastContext'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const { url } = await response.json()
      onChange(url)
      showToast('Image uploaded successfully', 'success')
    } catch (error) {
      showToast('Failed to upload image', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {value ? (
        <Box sx={{ position: 'relative' }}>
          <Image
            src={value}
            alt="Uploaded image"
            width={300}
            height={200}
            style={{ objectFit: 'cover' }}
          />
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => onChange('')}
            disabled={disabled}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ) : (
        <Button
          component="label"
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={disabled || loading}
          sx={{ width: '100%', height: 200 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleUpload}
            disabled={disabled || loading}
          />
        </Button>
      )}
    </Paper>
  )
} 