// Componente de spinner (Usado especialmente para loading)

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface SpinnerProps {
  size?: number // Tamaño del spinner
  color?: string // Color
  borderColor?: string // Color del borde
  speed?: number // Duración en segundos para una rotación completa
}

const Spinner = ({
  size = 24,
  color = 'border-white',
  borderColor = '',
  speed = 1
}: SpinnerProps) => {
  const spinnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spinner = spinnerRef.current
    if (!spinner) return

    // Crear animación de rotación infinita
    const rotation = gsap.to(spinner, {
      rotation: 360,
      duration: speed,
      ease: "none",
      repeat: -1
    })

    // Cleanup: detener animación al desmontar
    return () => {
      rotation.kill()
    }
  }, [speed])

  return (
    <div
      style={{ width: size, height: size }}
      className="relative"
    >
      <div
        ref={spinnerRef}
        className={`
          block w-full h-full border-4 border-t-transparent rounded-full
          ${color} ${borderColor}
        `}
      />
    </div>
  )
}

export default Spinner