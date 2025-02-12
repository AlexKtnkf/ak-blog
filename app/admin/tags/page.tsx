'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useToast } from '@/components/ToastContext'

interface Tag {
  id: number
  name: string
  slug: string
  type: 'tag' | 'category'
  description?: string
  parentId?: number
}

export default function TagsPage() {
  const { showToast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState<{
    name: string;
    type: 'tag' | 'category';
    description: string;
    parentId: string;
  }>({
    name: '',
    type: 'tag',
    description: '',
    parentId: '',
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      const data = await response.json()
      setTags(data)
    } catch (error) {
      showToast('Failed to load tags', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTag ? `/api/tags/${editingTag.id}` : '/api/tags'
      const method = editingTag ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save tag')

      showToast(`Tag ${editingTag ? 'updated' : 'created'} successfully`, 'success')
      fetchTags()
      handleCloseDialog()
    } catch (error) {
      showToast(`Failed to ${editingTag ? 'update' : 'create'} tag`, 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete tag')

      showToast('Tag deleted successfully', 'success')
      fetchTags()
    } catch (error) {
      showToast('Failed to delete tag', 'error')
    }
  }

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag)
      setFormData({
        name: tag.name,
        type: tag.type,
        description: tag.description || '',
        parentId: tag.parentId?.toString() || '',
      })
    } else {
      setEditingTag(null)
      setFormData({
        name: '',
        type: 'tag',
        description: '',
        parentId: '',
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTag(null)
    setFormData({
      name: '',
      type: 'tag',
      description: '',
      parentId: '',
    })
  }

  const getParentOptions = () => {
    return tags.filter((tag) => 
      tag.type === 'category' && (!editingTag || tag.id !== editingTag.id)
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tags & Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tags found
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>
                    {tag.type.charAt(0).toUpperCase() + tag.type.slice(1)}
                  </TableCell>
                  <TableCell>{tag.description}</TableCell>
                  <TableCell>
                    {tag.parentId
                      ? tags.find((t) => t.id === tag.parentId)?.name
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(tag)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingTag ? 'Edit Tag' : 'New Tag'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormControl>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'tag' | 'category' })}
                  label="Type"
                >
                  <MenuItem value="tag">Tag</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                </Select>
              </FormControl>
              {formData.type === 'category' && (
                <FormControl>
                  <InputLabel>Parent Category</InputLabel>
                  <Select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    label="Parent Category"
                  >
                    <MenuItem value="">None</MenuItem>
                    {getParentOptions().map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTag ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
} 