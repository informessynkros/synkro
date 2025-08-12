// Contexto del toast

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import Toast from '../components/ui/toast/Toast' // Ajusta la ruta según tu estructura


interface ToastData {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  others?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (toastData: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastData = {
      ...toastData,
      id
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove toast después de la duración
    const duration = toastData.duration || 4000
    setTimeout(() => {
      removeToast(id)
    }, duration + 500) // +500ms para la animación de salida
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Render de todos los toasts */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(${index * 10}px)`,
              zIndex: 100 - index
            }}
          >
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              others={toast.others}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
