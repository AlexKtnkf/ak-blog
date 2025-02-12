'use client'

import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Chip,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useToast } from '@/components/ToastContext'

interface Tag {
  id: number
  name: string
  type: 'tag' | 'category'
  parentId?: number
}

interface TagSelectorProps {
  value: Tag[]
  onChange: (tags: Tag[]) => void
  disabled?: boolean
}

export function TagSelector({ value, onChange, disabled }: TagSelectorProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Tag[]>([])

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      const data = await response.json()
      setTags(data.filter((tag: Tag) => tag.type === 'tag'))
      setCategories(data.filter((tag: Tag) => tag.type === 'category'))
    } catch (error) {
      showToast('Failed to load tags', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryHierarchy = (category: Tag): string => {
    const parentCategory = categories.find(c => c.id === category.parentId)
    return parentCategory 
      ? `${getCategoryHierarchy(parentCategory)} > ${category.name}`
      : category.name
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading tags...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        multiple
        options={categories}
        value={value.filter(v => v.type === 'category')}
        onChange={(_, newValue) => {
          onChange([...value.filter(v => v.type === 'tag'), ...newValue])
        }}
        getOptionLabel={(option) => getCategoryHierarchy(option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Categories"
            placeholder="Select categories"
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={getCategoryHierarchy(option)}
              {...getTagProps({ index })}
              color="primary"
            />
          ))
        }
        disabled={disabled}
      />

      <Autocomplete
        multiple
        options={tags}
        value={value.filter(v => v.type === 'tag')}
        onChange={(_, newValue) => {
          onChange([...value.filter(v => v.type === 'category'), ...newValue])
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            placeholder="Select or create tags"
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.name}
              {...getTagProps({ index })}
            />
          ))
        }
        disabled={disabled}
      />
    </Box>
  )
} 