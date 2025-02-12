'use client'

import { useState } from 'react'
import { Box, useMediaQuery, useTheme, Drawer } from '@mui/material'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

const DRAWER_WIDTH = 240

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminHeader onMenuClick={handleDrawerToggle} />
      
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          <AdminSidebar />
        </Drawer>
      )}

      {/* Desktop drawer */}
      {!isMobile && <AdminSidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: '64px', // Height of the AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  )
} 