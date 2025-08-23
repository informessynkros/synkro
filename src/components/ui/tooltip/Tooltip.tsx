// Tooltip

import { useState, type ReactNode, useRef } from "react"
import './style.css'


interface TooltipProps {
  content: string | ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  disabled?: boolean
  delay?: number
}

const Tooltip = ({
  content,
  children,
  position = 'top',
  className = "",
  disabled = false,
  delay = 300
}: TooltipProps) => {

  // Estados
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)

  // Refs
  const timeoutRef = useRef<any | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (disabled || !content) return null

    timeoutRef.current = setTimeout(() => {
      // Calculamos posición óptima antes de mostrar
      calculateOptimalPosition()
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
  }

  const calculateOptimalPosition = () => {
    if (!containerRef.current || !tooltipRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let optimalPosition = position

    // Verificar espacio disponible y ajustar posición
    switch (position) {
      case 'top':
        if (containerRect.top < tooltipRect.height + 10) {
          optimalPosition = 'bottom'
        }
        break
      case 'bottom':
        if (containerRect.bottom + tooltipRect.height + 10 > viewportHeight) {
          optimalPosition = 'right'
        }
        break
      case 'left':
        if (containerRect.left < tooltipRect.width + 10) {
          optimalPosition = 'right'
        }
        break
      case 'right':
        if (containerRect.right + tooltipRect.width + 10 > viewportWidth) {
          optimalPosition = 'left'
        }
        break
    }

    setActualPosition(optimalPosition)
  }

  // Clases para posicionamiento
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-[9999] px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xl border border-gray-700'

    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1`
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1`
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-1`
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-1`
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1`
    }
  }

  // Clases para la flecha
  const getArrowClasses = () => {
    const baseArrow = 'absolute w-2 h-2 bg-gray-900 rotate-45'

    switch (actualPosition) {
      case 'top':
        return `${baseArrow} top-full left-1/2 transform -translate-x-1/2 -translate-y-1`
      case 'bottom':
        return `${baseArrow} bottom-full left-1/2 transform -translate-x-1/2 translate-y-1`
      case 'left':
        return `${baseArrow} left-full top-1/2 transform -translate-y-1/2 -translate-x-1`
      case 'right':
        return `${baseArrow} right-full top-1/2 transform -translate-y-1/2 translate-x-1`
      default:
        return `${baseArrow} top-full left-1/2 transform -translate-x-1/2 -translate-y-1`
    }
  }

  if (disabled || !content) {
    return <>{children}</>
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${getPositionClasses()} animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-none select-none z-[9999]`}
          style={{
            animation: 'fadeInScale 200ms ease-out forwards'
          }}
        >
          {content}
          {/* Flecha */}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  )
}

export default Tooltip


// Ejemplo de uso
{/* <Tooltip content="Texto completo aquí">
  <span>Texto truncado...</span>
</Tooltip>

// Con posición específica
<Tooltip content="ID: P_14200360_FULL_ID_HERE" position="right">
  <span>P_14200360...</span>
</Tooltip>

// Con delay personalizado
<Tooltip content="Info detallada" delay={500}>
  <button>Hover me</button>
</Tooltip> */}