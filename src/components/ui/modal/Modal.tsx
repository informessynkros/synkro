// Componente modal
import { BadgeXIcon, type LucideIcon } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'


interface ModalProps {
  isOpen: boolean
  icon: LucideIcon
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  canCloseOnOverlayClick?: boolean
}

const Modal = ({
  isOpen,
  icon: Icon,
  onClose,
  title,
  children,
  size = 'md',
  canCloseOnOverlayClick = false
}: ModalProps) => {
  // Estados y refs
  const [isVisible, setIsVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Tamaños del modal
  const sizeClasses = {
    sm: 'max-w-[95%] sm:max-w-md',
    md: 'max-w-[95%] sm:max-w-2xl',
    lg: 'max-w-[95%] sm:max-w-4xl',
    xl: 'max-w-[95%] sm:max-w-5xl'
  }

  // Animación de apertura
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)

      // Animar entrada
      if (overlayRef.current && modalRef.current) {
        // Configurar estados iniciales
        gsap.set(overlayRef.current, { opacity: 0 })
        gsap.set(modalRef.current, { opacity: 0, y: -50, scale: 0.9 })

        // Animar overlay
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        })

        // Animar modal con efecto elástico
        gsap.to(modalRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          delay: 0.1
        })
      }
    }
  }, [isOpen])

  // Función para cerrar con animación
  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      // Animar salida del modal
      gsap.to(modalRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in"
      })

      // Animar salida del overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false)
          onClose()
        }
      })
    } else {
      setIsVisible(false)
      onClose()
    }
  }

  const handleOverlayClick = () => {
    if (canCloseOnOverlayClick) {
      handleClose()
    }
  }

  const handleModalClick = (e: any) => {
    e.stopPropagation()
  }

  // Animaciones del botón de cerrar
  const handleCloseButtonHover = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        y: 5,
        x: -5,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleCloseButtonLeave = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        y: 0,
        x: 0,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleCloseButtonClick = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
        onComplete: handleClose
      })
    } else {
      handleClose()
    }
  }

  // No renderizar si no está visible
  if (!isVisible) return null

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 bg-gray-100/50 bg-opacity-50 z-50 flex items-center justify-center p-4'
      onClick={handleOverlayClick}
      style={{ opacity: 0 }}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl relative`}
        onClick={handleModalClick}
        style={{ opacity: 0, transform: 'translateY(-50px) scale(0.9)' }}
      >
        <button
          ref={closeButtonRef}
          className='absolute -top-3 -right-3 p-2.5 bg-white hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-700 transition-colors shadow-lg'
          onClick={handleCloseButtonClick}
          onMouseEnter={handleCloseButtonHover}
          onMouseLeave={handleCloseButtonLeave}
        >
          <BadgeXIcon className='w-6 h-6' />
        </button>

        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="flex items-center text-lg text-gray-700 font-semibold">
              <Icon size={30} />
              &nbsp;
              &nbsp;
              {title}
            </h3>
          </div>
        )}

        <div className='p-6 max-h-[80vh] overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
