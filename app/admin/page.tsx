import { Typography, Grid, Paper, Box } from '@mui/material'

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Content
            </Typography>
            <Typography component="p" variant="h4">
              0
            </Typography>
          </Paper>
        </Grid>
        {/* Add more dashboard widgets as needed */}
      </Grid>
    </Box>
  )
} 