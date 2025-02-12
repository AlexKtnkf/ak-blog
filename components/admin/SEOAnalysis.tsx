'use client'

import { useEffect, useState } from 'react'
import { Alert, Box, Stack } from '@mui/material'
import { analyzeSEO } from '@/lib/seo/suggestions'

interface SEOAnalysisProps {
  content: {
    title: string
    seo: {
      metaTitle: string
      metaDescription: string
      ogImage: string
    }
    blocks: Array<{ type: string; content: string }>
  }
}

export function SEOAnalysis({ content }: SEOAnalysisProps) {
  const [suggestions, setSuggestions] = useState<Array<{ type: string; message: string }>>([])

  useEffect(() => {
    setSuggestions(analyzeSEO(content))
  }, [content])

  return (
    <Box sx={{ mt: 3 }}>
      <Stack spacing={1}>
        {suggestions.map((suggestion, index) => (
          <Alert key={index} severity={suggestion.type as any}>
            {suggestion.message}
          </Alert>
        ))}
        {suggestions.length === 0 && (
          <Alert severity="success">
            All SEO checks passed!
          </Alert>
        )}
      </Stack>
    </Box>
  )
} 