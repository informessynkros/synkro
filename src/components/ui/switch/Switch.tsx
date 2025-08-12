// components/ui/Switch.tsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface SwitchProps {
  color?: string
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  id?: string
}

const Switch: React.FC<SwitchProps> = ({
  color = '#10b981', // verde por defecto
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  id
}) => {
  const switchRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Configuraciones de tamaño
  const sizeConfig = {
    sm: {
      width: 'w-10',
      height: 'h-6',
      circle: 'w-4 h-4',
      translate: 16 // 40px - 16px (circle width)
    },
    md: {
      width: 'w-12',
      height: 'h-7',
      circle: 'w-5 h-5',
      translate: 20 // 48px - 20px (circle width)
    },
    lg: {
      width: 'w-14',
      height: 'h-8',
      circle: 'w-6 h-6',
      translate: 24 // 56px - 24px (circle width)
    }
  }

  const currentSize = sizeConfig[size]

  useEffect(() => {
    if (!circleRef.current || !trackRef.current) return

    const tl = gsap.timeline()

    if (checked) {
      tl.to(circleRef.current, {
        x: currentSize.translate,
        duration: 0.2, // Más rápido
        ease: "power2.out"
      })
        .to(trackRef.current, {
          backgroundColor: color,
          duration: 0.15, // Más rápido
          ease: "power2.out"
        }, "<")
        .to(circleRef.current, {
          scale: 1.05, // Menos bounce
          duration: 0.08,
          ease: "power2.out"
        }, "-=0.05")
        .to(circleRef.current, {
          scale: 1,
          duration: 0.08,
          ease: "power2.out"
        })
    } else {
      tl.to(circleRef.current, {
        x: 0,
        duration: 0.2, // Más rápido
        ease: "power2.out"
      })
        .to(trackRef.current, {
          backgroundColor: "#d1d5db", // gray-300
          duration: 0.15, // Más rápido
          ease: "power2.out"
        }, "<")
        .to(circleRef.current, {
          scale: 1.05, // Menos bounce
          duration: 0.08,
          ease: "power2.out"
        }, "-=0.05")
        .to(circleRef.current, {
          scale: 1,
          duration: 0.08,
          ease: "power2.out"
        })
    }

    return () => {
      tl.kill()
    }
  }, [checked, color, currentSize.translate])

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      onChange(!checked)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'
            }`}
        >
          {label}
        </label>
      )}

      <div
        ref={switchRef}
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        className={`
          relative inline-flex items-center rounded-full transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${currentSize.width} ${currentSize.height}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        `}
      >
        {/* Track del switch */}
        <div
          ref={trackRef}
          className={`
            absolute inset-0 rounded-full
            ${currentSize.width} ${currentSize.height}
          `}
          style={{
            backgroundColor: checked ? color : '#d1d5db'
          }}
        />

        {/* Círculo deslizante */}
        <div
          ref={circleRef}
          className={`
            relative bg-white rounded-full shadow-lg
            ${currentSize.circle}
            ${disabled ? '' : 'hover:shadow-xl'}
          `}
          style={{
            marginLeft: '2px',
            marginRight: '2px'
          }}
        />
      </div>

      {/* Estado visual para desarrollo (opcional) */}
      {process.env.NODE_ENV === 'development' && (
        <span className="text-xs text-gray-400">
          Estado: {checked ? 'Activo' : 'Inactivo'}
        </span>
      )}
    </div>
  )
}

export default Switch