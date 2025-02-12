'use client'

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import {
  Article as ArticleIcon,
  Tag as TagIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'

const DRAWER_WIDTH = 240

const menuItems = [
  { text: 'Content', icon: <ArticleIcon />, path: '/admin/content' },
  { text: 'Tags', icon: <TagIcon />, path: '/admin/tags' },
  { text: 'Media', icon: <ImageIcon />, path: '/admin/media' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
]

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar /> {/* This creates space for the header */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
} 