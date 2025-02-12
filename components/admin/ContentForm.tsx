'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  Tabs,
  Tab,
  SelectChangeEvent,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastContext'
import { RichTextEditor } from './RichTextEditor'
import {
  ArrowUpward,
  ArrowDownward,
  Delete,
  Add,
  Image as ImageIcon,
} from '@mui/icons-material'
import { ImageUpload } from './ImageUpload'
import { Preview } from './Preview'
import { SEOAnalysis } from './SEOAnalysis'
import { TagSelector } from './TagSelector'

interface Block {
  id?: number
  type: 'text' | 'image'
  content: string
  position: number
}

interface SEOData {
  metaTitle: string
  metaDescription: string
  ogImage: string
  noIndex: boolean
}

interface ContentFormData {
  title: string
  slug: string
  type: string
  status: 'draft' | 'published'
  blocks: Block[]
  seo: SEOData
  tags: Array<{
    id: number
    name: string
    type: 'tag' | 'category'
    parentId?: number
  }>
}

interface ContentFormProps {
  initialData?: ContentFormData
  isEditing?: boolean
  id?: number
}

export function ContentForm({ initialData, isEditing, id }: ContentFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState<ContentFormData>(
    initialData || {
      title: '',
      slug: '',
      type: 'post',
      status: 'draft',
      blocks: [
        {
          type: 'text',
          content: '',
          position: 0,
        },
      ],
      seo: {
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
        noIndex: false,
      },
      tags: [],
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/content/${id}` : '/api/content'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save content')

      showToast(
        `Content ${isEditing ? 'updated' : 'created'} successfully`,
        'success'
      )
      router.push('/admin/content')
      router.refresh()
    } catch (error) {
      showToast(`Failed to ${isEditing ? 'update' : 'create'} content`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleBlockChange = (index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, content } : block
      ),
    }))
  }

  const addBlock = (type: 'text' | 'image') => {
    setFormData((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          type,
          content: '',
          position: prev.blocks.length,
        },
      ],
    }))
  }

  const removeBlock = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }))
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.blocks.length - 1)
    ) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? prev.blocks[i - 1] : i === index - 1 ? prev.blocks[i + 1] : block
      ),
    }))
  }

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Content" />
        <Tab label="SEO" />
        <Tab label="Preview" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  helperText="URL-friendly name"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={generateSlug}
                  disabled={!formData.title || loading}
                >
                  Generate Slug
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                    disabled={loading}
                  >
                    <MenuItem value="post">Post</MenuItem>
                    <MenuItem value="page">Page</MenuItem>
                    <MenuItem value="project">Project</MenuItem>
                  </Select>
                  <FormHelperText>Content type</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                    disabled={loading}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                  <FormHelperText>Publication status</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TagSelector
                  value={formData.tags}
                  onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Content Blocks
                </Typography>
                {formData.blocks.map((block, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => moveBlock(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUpward />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => moveBlock(index, 'down')}
                          disabled={index === formData.blocks.length - 1}
                        >
                          <ArrowDownward />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeBlock(index)}
                          disabled={formData.blocks.length === 1}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                      <RichTextEditor
                        content={block.content}
                        onChange={(content) => handleBlockChange(index, content)}
                        disabled={loading}
                      />
                    </Paper>
                  </Box>
                ))}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    startIcon={<Add />}
                    onClick={() => addBlock('text')}
                    disabled={loading}
                  >
                    Add Text Block
                  </Button>
                  <Button
                    startIcon={<ImageIcon />}
                    onClick={() => addBlock('image')}
                    disabled={loading}
                  >
                    Add Image Block
                  </Button>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/admin/content')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Title"
                name="seo.metaTitle"
                value={formData.seo?.metaTitle || ''}
                onChange={handleChange}
                disabled={loading}
                helperText={`${formData.seo?.metaTitle?.length || 0}/60 characters`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                name="seo.metaDescription"
                value={formData.seo?.metaDescription || ''}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={3}
                helperText={`${formData.seo?.metaDescription?.length || 0}/160 characters`}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Social Image
              </Typography>
              <ImageUpload
                value={formData.seo?.ogImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, ogImage: url },
                  }))
                }
                disabled={loading}
              />
            </Grid>
          </Grid>
          <SEOAnalysis content={formData} />
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Preview content={formData} />
        </Paper>
      )}

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/content')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
} 