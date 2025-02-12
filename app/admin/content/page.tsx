'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TablePagination,
  TextField,
  MenuItem,
  Checkbox,
  TableSortLabel,
  Toolbar,
  alpha,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Publish as PublishIcon,
  UnpublishedOutlined as UnpublishIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastContext'

interface ContentEntry {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  type: string
  createdAt: string
  updatedAt: string
}

type Order = 'asc' | 'desc'
type OrderBy = keyof ContentEntry

export default function ContentList() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<ContentEntry[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<OrderBy>('updatedAt')
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      if (!response.ok) throw new Error('Failed to fetch content')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      showToast('Failed to load content', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(filteredContent.map((entry) => entry.id))
      return
    }
    setSelected([])
  }

  const handleSelect = (id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (!selected.length) return
    if (!confirm(`Are you sure you want to ${action} the selected items?`)) return

    try {
      const response = await fetch('/api/content/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected, action }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} content`)

      showToast(`Successfully ${action}ed selected items`, 'success')
      fetchContent()
      setSelected([])
    } catch (error) {
      showToast(`Failed to ${action} content`, 'error')
    }
  }

  const filteredContent = content
    .filter((entry) => {
      const matchesSearch = entry.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesType = filterType === 'all' || entry.type === filterType
      const matchesStatus = filterStatus === 'all' || entry.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return bValue < aValue ? -1 : 1
      }
    })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/content/new')}
        >
          New Content
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <TextField
            select
            size="small"
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="post">Post</MenuItem>
            <MenuItem value="page">Page</MenuItem>
            <MenuItem value="project">Project</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </TextField>
        </Box>

        {selected.length > 0 && (
          <Toolbar
            sx={{
              pl: 2,
              pr: 1,
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }}
          >
            <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
              {selected.length} selected
            </Typography>
            <Button
              startIcon={<PublishIcon />}
              onClick={() => handleBulkAction('publish')}
            >
              Publish
            </Button>
            <Button
              startIcon={<UnpublishIcon />}
              onClick={() => handleBulkAction('unpublish')}
            >
              Unpublish
            </Button>
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
          </Toolbar>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredContent.length}
                    checked={selected.length === filteredContent.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'updatedAt'}
                    direction={orderBy === 'updatedAt' ? order : 'asc'}
                    onClick={() => handleSort('updatedAt')}
                  >
                    Last Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      Loading...
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredContent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      No content found
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContent
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((entry) => (
                    <TableRow
                      key={entry.id}
                      selected={selected.includes(entry.id)}
                      hover
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(entry.id)}
                          onChange={() => handleSelect(entry.id)}
                        />
                      </TableCell>
                      <TableCell>{entry.title}</TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={entry.status}
                          color={entry.status === 'published' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => router.push(`/admin/content/${entry.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleBulkAction('delete')}
                          color="error"
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredContent.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </Paper>
    </Box>
  )
} 
