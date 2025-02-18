'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TextField, Button, Paper, Box, Typography, Alert } from '@mui/material'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })
      console.log(response)
      if (response?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      setError('An error occurred')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Admin Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  )
} 