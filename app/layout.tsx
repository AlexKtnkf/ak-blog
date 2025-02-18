import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/lib/theme'
import { ToastProvider } from '@/components/ToastContext'
import { Toaster } from '@/components/Toaster'
import { NextAuthProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Blog & CMS',
  description: 'A modern blog and CMS built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider>
              <NextAuthProvider>
                {children}
              </NextAuthProvider>
              <Toaster />
            </ToastProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}