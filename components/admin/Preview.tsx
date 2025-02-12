'use client'

import { Box, Paper, Typography } from '@mui/material'
import DOMPurify from 'dompurify'

interface PreviewProps {
  content: {
    title: string
    blocks: Array<{
      type: string
      content: string
    }>
  }
}

export function Preview({ content }: PreviewProps) {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          {content.title}
        </Typography>
        
        {content.blocks.map((block, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            {block.type === 'text' && (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(block.content),
                }}
              />
            )}
            {block.type === 'image' && (
              <Box
                component="img"
                src={block.content}
                alt=""
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  )
} 