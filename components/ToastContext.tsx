'use client'

import React, { createContext, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  open: boolean
  message: string
  type: ToastType
  handleClose: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<ToastType>('info')

  const showToast = (newMessage: string, newType: ToastType = 'info') => {
    setMessage(newMessage)
    setType(newType)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <ToastContext.Provider value={{ showToast, open, message, type, handleClose }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 