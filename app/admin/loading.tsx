import { Box, Skeleton, Grid, Paper } from '@mui/material'

export default function AdminLoading() {
  return (
    <Box>
      <Skeleton variant="text" sx={{ fontSize: '2.125rem', width: 200, mb: 2 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} md={6} lg={3} key={i}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
              <Skeleton
                variant="text"
                sx={{ fontSize: '2.125rem', width: '40%', mt: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
} 