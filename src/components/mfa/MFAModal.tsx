import { X, Shield } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface MFAModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

const MFAModal = ({ isOpen, onClose, title, children }: MFAModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Animación de entrada
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)

      if (overlayRef.current && modalRef.current) {
        // Estados iniciales
        gsap.set(overlayRef.current, {
          opacity: 0,
          backdropFilter: 'blur(0px)'
        })
        gsap.set(modalRef.current, {
          opacity: 0,
          scale: 0.7,
          y: -30
        })

        // Animar entrada del overlay con blur
        gsap.to(overlayRef.current, {
          opacity: 1,
          backdropFilter: 'blur(8px)',
          duration: 0.3,
          ease: "power2.out"
        })

        // Animar entrada del modal con rebote
        gsap.to(modalRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
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
        scale: 0.7,
        y: -30,
        duration: 0.25,
        ease: "power2.in"
      })

      // Animar salida del overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
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

  // Animaciones del botón de cerrar
  const handleCloseButtonHover = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        scale: 1.1,
        rotation: 90,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleCloseButtonLeave = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={() => handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
      >
        {/* Header con gradiente sutil */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Shield className="w-5 h-5 text-sky-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            onMouseEnter={handleCloseButtonHover}
            onMouseLeave={handleCloseButtonLeave}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default MFAModal