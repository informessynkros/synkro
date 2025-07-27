// Tostadita

import gsap from "gsap"
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"


interface ToastProps {
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

const Toast = ({ type, title, message, duration = 4000, onClose }: ToastProps) => {

  // Estados
  const [isVisible, setIsVisible] = useState(true) // Mostrar tostada
  const [timeLeft, setTimeLeft] = useState(duration)

  // Refs
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number>(0)
  const intervalRef = useRef<number>(0)

  // Configuración de iconos y colores por tipo
  const config = {
    success: {
      icon: <CircleCheck className="w-5 h-5" />,
      bgColor: 'bg-white',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-800',
      messageColor: 'text-emerald-700',
      progressColor: 'bg-emerald-500',
      hoverClose: 'hover:bg-emerald-100'
    },
    error: {
      icon: <CircleX className="w-5 h-5" />,
      bgColor: 'bg-white',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      progressColor: 'bg-red-500',
      hoverClose: 'hover:bg-red-100'
    },
    warning: {
      icon: <TriangleAlert className="w-5 h-5" />,
      bgColor: 'bg-white',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      progressColor: 'bg-yellow-500',
      hoverClose: 'hover:bg-yellow-100'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-white',
      iconColor: 'text-sky-600',
      titleColor: 'text-sky-800',
      messageColor: 'text-sky-700',
      progressColor: 'bg-sky-500',
      hoverClose: 'hover:bg-sky-100'
    },
  }

  const currentConfig = config[type]

  // Animación de entrada
  useEffect(() => {
    if (toastRef.current) {
      gsap.fromTo(toastRef.current,
        {
          opacity: 0,
          x: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)'
        }
      )
    }
  }, [])

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        x: 100,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false)
          onClose?.()
        }
      })
    }
  }

  // Timer y progress bar
  useEffect(() => {
    if (duration > 0) {
      // Iniciamos el timer
      timeoutRef.current = setTimeout(() => {
        handleClose()
      }, duration)

      // Progress bar
      if (progressRef.current) {
        gsap.fromTo(progressRef.current,
          { width: '100%' },
          {
            width: '0%',
            duration: duration / 1000,
            ease: 'none'
          }
        )
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            clearInterval(intervalRef.current)
            return 0
          }
          return prev - 100
        })
      }, 100)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [duration])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (progressRef.current) {
      gsap.to(progressRef.current, { animationPlayState: 'paused' })
    }
  }

  const handleMouseLeave = () => {
    if (timeLeft > 0) {
      timeoutRef.current = setTimeout(handleClose, timeLeft)

      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev > 100) {
            clearInterval(intervalRef.current)
            return 0
          }
          return prev - 100
        })
      }, 100)

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          width: '0%',
          duration: timeLeft / 1000,
          ease: 'none'
        })
      }
    }
  }

  if (!isVisible) return null

  // Si se requiere cambiar la posicion de la tostada:
  // Esquina superior izquierda
  // "fixed top-4 left-4 z-50"

  // Esquina inferior derecha  
  // "fixed bottom-4 right-4 z-50"

  // Esquina inferior izquierda
  // "fixed bottom-4 left-4 z-50"

  // Centro superior
  // "fixed top-4 left-1/2 transform -translate-x-1/2 z-50"

  // Centro de la pantalla
  // "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"

  return (
    <div
      ref={toastRef}
      className={`
        fixed top-4 right-4 z-50
        mb-3 p-4 rounded-lg shadow-lg backdrop-blur-sm
        ${currentConfig.bgColor}
        min-w-[320px] max-w-[400px] group overflow-hidden
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: 0, transform: 'translateX(100px) scale(0.8)' }}
    >
      {/* Progress bar */}
      {duration > 0 && (
        // <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div
            ref={progressRef}
            className={`h-full ${currentConfig.progressColor} rounded-bl-lg rounded-br-lg transition-all duration-100`}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Header con logo */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${currentConfig.progressColor} rounded-sm flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">@</span>
          </div>
          <span className={`text-xs font-medium ${currentConfig.titleColor} font-semibold`}>Synkros</span>
        </div>

        <button
          onClick={handleClose}
          className={`${currentConfig.iconColor} ${currentConfig.hoverClose} transition-colors p-1 rounded cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <hr className={`border border-gray-50 my-2 w-full`} />

      {/* Contenido principal */}
      <div className="flex items-start gap-3">
        <div className={`${currentConfig.iconColor} flex-shrink-0 mt-0.5`}>
          {currentConfig.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${currentConfig.titleColor} leading-tight`}>
            {title}
          </h4>
          {message && (
            <p className={`text-sm ${currentConfig.messageColor} mt-1 leading-relaxed`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Toast
