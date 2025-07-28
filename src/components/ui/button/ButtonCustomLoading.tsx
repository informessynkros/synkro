import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { LucideIcon } from "lucide-react"
import Spinner from "../spinner/Spinner"
import useMediaQueries from "../../../hooks/useMediaQueries"

interface ButtonProps {
  text: string
  icon: LucideIcon
  className?: string
  isLoading?: boolean
  bgColor?: 'primary' | 'secundary'
  loadingText?: string
  type?: "submit" | "reset" | "button"
  onClick?: () => void
  large?: 'w-full' | 'w-auto'
}

const ButtonCustomLoading = ({
  text,
  icon: Icon,
  className = "",
  isLoading = false,
  bgColor = 'primary',
  loadingText = 'Procesando...',
  type = "button",
  onClick,
  large = 'w-full'
}: ButtonProps) => {
  // Hooks
  const { isDesktop, isTablet, isMobile } = useMediaQueries()
  
  // Referencias para GSAP
  const iconRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const loadingTextRef = useRef<HTMLSpanElement>(null)

  // Animación con GSAP
  useEffect(() => {
    const icon = iconRef.current
    const spinner = spinnerRef.current
    const textElement = textRef.current
    const loadingTextElement = loadingTextRef.current

    if (!icon || !spinner || (!isMobile && (!textElement || !loadingTextElement))) return

    const tl = gsap.timeline()

    if (isLoading) {
      // Animación de entrada del loading
      if (!isMobile) {
        tl.to(textElement, {
          x: -20,
          opacity: 0,
          duration: 0.2,
          ease: "power2.out"
        })
        .set(loadingTextElement, { x: 20, opacity: 0 })
        .to(loadingTextElement, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1")
      }

      tl.to(icon, {
        x: -20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      }, isMobile ? 0 : "-=0.3")
      .set(spinner, { x: 20, opacity: 0 })
      .to(spinner, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.1")

    } else {
      // Animación de salida del loading
      tl.to(spinner, {
        x: 20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      })
      .set(icon, { x: -20, opacity: 0 })
      .to(icon, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.1")

      if (!isMobile) {
        tl.to(loadingTextElement, {
          x: 20,
          opacity: 0,
          duration: 0.2,
          ease: "power2.out"
        }, "-=0.5")
        .set(textElement, { x: -20, opacity: 0 })
        .to(textElement, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1")
      }
    }

    return () => {
      tl.kill()
    }
  }, [isLoading, isMobile])

  const backgroundColor = bgColor === 'primary' ? 'bg-[#333]' : bgColor === 'secundary' ? 'bg-[#777]' : 'bg-[#333]'
  const hoverColor = bgColor === 'primary' ? 'hover:bg-[#444]' : bgColor === 'secundary' ? 'hover:bg-[#666]' : 'hover:bg-[#444]'

  const buttonClasses = isMobile
    ? `w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${backgroundColor} duration-200 ${hoverColor} ${className}`
    : `${large} px-3 py-2 rounded-lg flex items-center justify-center gap-4 cursor-pointer ${backgroundColor} duration-200 ${hoverColor} ${className}`

  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        type={type}
        disabled={isLoading}
        className={buttonClasses}
      >
        {/* Contenedor para el ícono y spinner con posición relativa */}
        <div className="relative flex items-center justify-center">
          {/* Elemento invisible para mantener el espacio del ícono */}
          <div className={`${isDesktop ? 'w-6 h-6' : isTablet ? 'w-5 h-5' : 'w-5 h-5'}`}></div>
          
          <div 
            ref={iconRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Icon className={`${isDesktop ? 'w-6 h-6' : isTablet ? 'w-5 h-5' : 'w-5 h-5'} text-white`} />
          </div>
          
          <div 
            ref={spinnerRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 flex items-center justify-center"
          >
            <Spinner
              size={isDesktop ? 24 : isTablet ? 20 : 20}
              color="border-white"
              speed={0.8}
            />
          </div>
        </div>

        {/* Textos solo en desktop/tablet */}
        {!isMobile && (
          <div className="relative flex items-center">
            {/* Texto invisible para mantener el espacio */}
            <span className={`invisible text-white ${isDesktop ? 'text-normal' : isTablet ? 'text-sm' : 'text-sm'}`}>
              {text.length > loadingText.length ? text : loadingText}
            </span>
            
            <span 
              ref={textRef}
              className={`absolute top-1/2 left-0 transform -translate-y-1/2 whitespace-nowrap text-white ${isDesktop ? 'text-normal' : isTablet ? 'text-sm' : 'text-sm'}`}
            >
              {text}
            </span>
            
            <span 
              ref={loadingTextRef}
              className={`absolute top-1/2 left-0 transform -translate-y-1/2 whitespace-nowrap opacity-0 text-white ${isDesktop ? 'text-normal' : isTablet ? 'text-sm' : 'text-sm'}`}
            >
              {loadingText}
            </span>
          </div>
        )}
      </button>
    </div>
  )
}

export default ButtonCustomLoading