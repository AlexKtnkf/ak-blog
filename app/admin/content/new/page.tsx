import { Box, Typography } from '@mui/material'
import { ContentForm } from '@/components/admin/ContentForm'

export default function NewContent() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Content
      </Typography>
      <ContentForm />
    </Box>
  )
} 