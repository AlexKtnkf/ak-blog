import { Box, Skeleton, Paper } from '@mui/material'

export default function EditContentLoading() {
  return (
    <Box>
      <Skeleton variant="text" sx={{ fontSize: '2.125rem', width: 200, mb: 2 }} />
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={56} />
          ))}
        </Box>
      </Paper>
    </Box>
  )
} 