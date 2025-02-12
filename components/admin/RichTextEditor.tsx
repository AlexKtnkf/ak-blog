'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
} from '@mui/icons-material'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  disabled?: boolean
}

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const handleLinkClick = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleImageClick = () => {
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        '& .ProseMirror': {
          p: 2,
          minHeight: 200,
          '&:focus': {
            outline: 'none',
          },
        },
      }}
    >
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <ToggleButtonGroup
          size="small"
          aria-label="text formatting"
          disabled={disabled}
        >
          <ToggleButton
            value="bold"
            selected={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="bold"
          >
            <FormatBold />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-label="italic"
          >
            <FormatItalic />
          </ToggleButton>
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
          <ToggleButton
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="bullet list"
          >
            <FormatListBulleted />
          </ToggleButton>
          <ToggleButton
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="ordered list"
          >
            <FormatListNumbered />
          </ToggleButton>
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
          <ToggleButton
            value="blockquote"
            selected={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="blockquote"
          >
            <FormatQuote />
          </ToggleButton>
          <ToggleButton
            value="codeBlock"
            selected={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            aria-label="code block"
          >
            <Code />
          </ToggleButton>
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
          <Tooltip title="Add link">
            <IconButton
              onClick={handleLinkClick}
              disabled={disabled}
              size="small"
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add image">
            <IconButton
              onClick={handleImageClick}
              disabled={disabled}
              size="small"
            >
              <ImageIcon />
            </IconButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>
      <EditorContent editor={editor} />
    </Box>
  )
} 