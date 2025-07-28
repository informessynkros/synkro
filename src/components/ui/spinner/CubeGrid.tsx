import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface CubeGridSpinnerProps {
  text?: string
  size?: number
  color?: string
}

const CubeGrid = ({ 
  text = "Cargando...", 
  size = 25, 
  color = "#364153"
}: CubeGridSpinnerProps) => {

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Tiempos de delay para cada cubo en la grilla
  const delays = [
    [0, 0.1, 0.2],
    [0.1, 0.2, 0.3],
    [0.2, 0.3, 0.4],
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const cubes = containerRef.current.querySelectorAll('.cube')
    // const timeline = gsap.timeline()

    // Animación del texto (fade in)
    if (textRef.current) {
      gsap.fromTo(textRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3 }
      )
    }

    // Configurar animación para cada cubo
    cubes.forEach((cube, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      const delay = delays[row][col]

      // Animación de escala y opacidad para cada cubo
      gsap.fromTo(cube,
        { 
          scale: 1,
          opacity: 1,
          transformOrigin: 'center center'
        },
        {
          scale: 0.5,
          opacity: 0.3,
          duration: 0.4,
          delay: delay,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        }
      )
    })

    // Cleanup function
    return () => {
      gsap.killTweensOf(cubes)
      if (textRef.current) {
        gsap.killTweensOf(textRef.current)
      }
    }
  }, [delays])

  return (
    <div className="flex flex-row items-center justify-center min-h-[300px] gap-4">
      <div 
        ref={containerRef}
        className="grid grid-cols-3" 
        style={{ width: size, height: size }}
      >
        {delays.map((row, i) =>
          row.map((j) => (
            <div
              key={`${i}-${j}`}
              className="cube"
              style={{
                width: size / 3,
                height: size / 3,
                backgroundColor: color,
              }}
            />
          ))
        )}
      </div>
      {text && (
        <p
          ref={textRef}
          className="text-gray-600 font-medium"
          style={{ opacity: 0 }}
        >
          {text}
        </p>
      )}
    </div>
  )
}

export default CubeGrid