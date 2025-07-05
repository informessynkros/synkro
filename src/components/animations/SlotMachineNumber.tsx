// Animación tragamonedas

import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import useMediaQueries from "../../hooks/useMediaQueries"


interface SlotMachineNumberProps {
  finalNumber: number
  delay?: number
  duration?: number
  className?: string
}

const SlotMachineNumber = ({
  finalNumber,
  delay = 0,
  duration = 2,
  className = ""
}: SlotMachineNumberProps) => {
  // Hooks
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  // Ref
  const numberRef = useRef<HTMLDivElement>(null)
  // Estados
  const [currentNumber, setCurrentNumber] = useState(0)

  // Efectos
  useEffect(() => {
    const element = numberRef.current
    if (!element) return

    // Función que genera números aleatorios (Para manejar el tragamonedas aleatorio)
    const generateRandomNumber = () => Math.floor(Math.random() * 10)

    // Timeline de GSAP
    const tl = gsap.timeline({ delay })

    // Fase 1: Números cambiando rápidamente (Este efecto es slot machine)
    tl.to({}, {
      duration: duration * 0.7, // 70% del tiempo total
      ease: 'power2.out',
      onUpdate: function () {
        const progress = this.progress()
        // Reducimos la velocidad del tragamoneda
        const changeSpeed = Math.max(0.1, 1 - progress)

        if (Math.random() < changeSpeed) {
          setCurrentNumber(generateRandomNumber())
        }
      }
    })

      // Fase 2: Transición al número final con bounce, es decir, con rebote
      .to({}, {
        duration: duration * 0.3, // 30% restante
        ease: "bounce.out",
        onStart: () => {
          setCurrentNumber(finalNumber)
        },
        onUpdate: function () {
          // Efecto de escala durante el bounce
          const progress = this.progress()
          const scale = 1 + (Math.sin(progress * Math.PI * 4) * 0.1 * (1 - progress))
          gsap.set(element, { scale })
        },
        onComplete: () => {
          gsap.set(element, { scale: 1 })
        }
      })

    return () => {
      tl.kill()
    }
  }, [finalNumber, delay, duration])

  return (
    <span
      ref={numberRef}
      className={`inline-block font-bold ${isDesktop ? 'text-[12rem]' : isTablet ? 'text-9xl' : isMobile ? 'text-8xl' : ''} text-transparent bg-gradient-to-br from-slate-400 to-slate-600 bg-clip-text select-none ${className}`}
    >
      {currentNumber}
    </span>
  )
}

export default SlotMachineNumber
