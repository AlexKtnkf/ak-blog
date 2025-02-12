import { Box, Skeleton, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

export default function ContentLoading() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: '2.125rem', width: 200 }} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={70} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
} 