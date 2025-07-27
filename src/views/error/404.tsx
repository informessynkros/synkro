import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const NotFoundPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const truckRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<SVGGElement>(null)
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Animación inicial del contenedor - SIN opacity
    tl.from(containerRef.current, {
      scale: 0.95,
      duration: 0.5,
      ease: "power2.out"
    })

    // Animación de las nubes (movimiento sutil)
    if (cloudsRef.current) {
      gsap.to(Array.from(cloudsRef.current.children), {
        x: "20px",
        duration: 8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 2
      })
    }

    // Animación del camión - SOLO posición inicial
    tl.from(truckRef.current, {
      x: -200,
      duration: 1.2,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Después de la entrada, iniciar movimiento continuo
        gsap.to(truckRef.current, {
          x: "+=30",
          duration: 3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        })
      }
    }, 0.3)

    // Animación de ruedas - solo elementos con rayos/radios
    const wheelSpokes = truckRef.current?.querySelectorAll('.wheel-spoke')
    if (wheelSpokes) {
      wheelSpokes.forEach(spoke => {
        gsap.to(spoke, {
          rotation: 360,
          duration: 0.8,
          ease: "none",
          repeat: -1,
          transformOrigin: "center center"
        })
      })
    }

    // Efecto slot machine para el 404 - SIN tocar opacity
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const finalNumbers = ['4', '0', '4']

    slotRefs.current.forEach((slot, index) => {
      if (slot) {
        gsap.to(slot, {
          rotationX: 360 * 5,
          duration: 2 + index * 0.3,
          ease: "power2.out",
          onUpdate: function () {
            if (this.progress() < 0.8) {
              const randomNum = numbers[Math.floor(Math.random() * numbers.length)]
              if (slot.textContent !== null) {
                slot.textContent = randomNum
              }
            } else {
              if (slot.textContent !== null) {
                slot.textContent = finalNumbers[index]
              }
            }
          },
          delay: 0.8 + index * 0.2
        })
      }
    })

    // Animación del texto - posición Y sin callbacks de opacity
    tl.from(titleRef.current, {
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    }, 1.5)

    tl.from(descriptionRef.current, {
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    }, 1.8)

    tl.from(buttonRef.current, {
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    }, 2.1)

    // Animación hover del botón
    const button = buttonRef.current
    const handleMouseEnter = () => {
      if (button) {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }

    const handleMouseLeave = () => {
      if (button) {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }

    if (button) {
      button.addEventListener('mouseenter', handleMouseEnter)
      button.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter)
        button.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Ilustración SVG de fondo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="800"
          height="600"
          viewBox="0 0 800 600"
          className="w-full h-full max-w-4xl opacity-100"
        >
          {/* Montañas de fondo */}
          <path
            d="M0 400 L150 250 L300 350 L450 200 L600 300 L750 180 L800 220 L800 600 L0 600 Z"
            fill="#64748b"
            opacity="0.3"
          />
          <path
            d="M0 450 L100 320 L250 380 L400 280 L550 350 L700 250 L800 290 L800 600 L0 600 Z"
            fill="#475569"
            opacity="0.4"
          />

          {/* Nubes */}
          <g ref={cloudsRef}>
            <ellipse cx="150" cy="200" rx="40" ry="25" fill="white" opacity="0.8" />
            <ellipse cx="180" cy="195" rx="35" ry="20" fill="white" opacity="0.8" />
            <ellipse cx="130" cy="195" rx="30" ry="18" fill="white" opacity="0.8" />

            <ellipse cx="450" cy="160" rx="45" ry="28" fill="white" opacity="0.7" />
            <ellipse cx="485" cy="155" rx="38" ry="22" fill="white" opacity="0.7" />
            <ellipse cx="420" cy="155" rx="32" ry="20" fill="white" opacity="0.7" />

            <ellipse cx="650" cy="220" rx="35" ry="20" fill="white" opacity="0.6" />
            <ellipse cx="675" cy="215" rx="30" ry="18" fill="white" opacity="0.6" />
          </g>

          {/* Carretera */}
          <path
            d="M0 500 Q400 480 800 500 L800 520 Q400 500 0 520 Z"
            fill="#374151"
          />
          <path
            d="M50 510 L150 508 M250 507 L350 505 M450 504 L550 502 M650 501 L750 500"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="20,30"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Camión animado en la carretera */}
      <div ref={truckRef} className="absolute bottom-28 left-1/2 z-10">
        <svg width="120" height="60" viewBox="0 0 120 60">
          {/* Sombra del camión */}
          <ellipse cx="60" cy="58" rx="50" ry="8" fill="#000000" opacity="0.2" />

          {/* Cabina del camión */}
          <rect x="10" y="20" width="30" height="25" fill="#ef4444" rx="2" />
          <rect x="12" y="22" width="8" height="8" fill="#93c5fd" opacity="0.8" />

          {/* Contenedor de carga */}
          <rect x="40" y="15" width="50" height="30" fill="#64748b" rx="2" />
          <rect x="42" y="17" width="46" height="26" fill="#475569" />

          {/* Cajas en el contenedor */}
          <rect x="45" y="20" width="8" height="8" fill="#f59e0b" />
          <rect x="55" y="20" width="8" height="8" fill="#10b981" />
          <rect x="65" y="20" width="8" height="8" fill="#3b82f6" />
          <rect x="75" y="20" width="8" height="8" fill="#f59e0b" />
          <rect x="50" y="30" width="8" height="8" fill="#ef4444" />
          <rect x="60" y="30" width="8" height="8" fill="#8b5cf6" />
          <rect x="70" y="30" width="8" height="8" fill="#10b981" />

          {/* ✅ RUEDAS ARREGLADAS - Solo giran los rayos/radios */}
          {/* Rueda 1 */}
          <circle cx="25" cy="50" r="8" fill="#1f2937" />
          <circle cx="25" cy="50" r="5" fill="#374151" />
          <g className="wheel-spoke">
            <line x1="25" y1="45" x2="25" y2="55" stroke="#1f2937" strokeWidth="1" />
            <line x1="20" y1="50" x2="30" y2="50" stroke="#1f2937" strokeWidth="1" />
          </g>

          {/* Rueda 2 */}
          <circle cx="75" cy="50" r="8" fill="#1f2937" />
          <circle cx="75" cy="50" r="5" fill="#374151" />
          <g className="wheel-spoke">
            <line x1="75" y1="45" x2="75" y2="55" stroke="#1f2937" strokeWidth="1" />
            <line x1="70" y1="50" x2="80" y2="50" stroke="#1f2937" strokeWidth="1" />
          </g>

          {/* Rueda 3 */}
          <circle cx="85" cy="50" r="8" fill="#1f2937" />
          <circle cx="85" cy="50" r="5" fill="#374151" />
          <g className="wheel-spoke">
            <line x1="85" y1="45" x2="85" y2="55" stroke="#1f2937" strokeWidth="1" />
            <line x1="80" y1="50" x2="90" y2="50" stroke="#1f2937" strokeWidth="1" />
          </g>

          {/* Humo del escape */}
          <circle cx="8" cy="15" r="2" fill="#d1d5db" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="5" cy="10" r="1.5" fill="#e5e7eb" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.2;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="3" cy="6" r="1" fill="#f3f4f6" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Contenido principal */}
      <div className="text-center z-20 max-w-2xl">
        {/* Número 404 con efecto slot machine */}
        <div className="flex justify-center items-center mb-8 space-x-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200"
            >
              <span
                ref={(el) => {
                  slotRefs.current[index] = el
                }}
                className="text-8xl md:text-9xl font-black text-blue-600 block leading-none"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                0
              </span>
            </div>
          ))}
        </div>

        {/* Título - SIN estilos inline forzados */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold mb-4 text-black"
        >
          ¡Ups! Mercancía Perdida
        </h1>

        {/* Descripción - MÁS SEPARACIÓN del botón */}
        <p
          ref={descriptionRef}
          className="text-lg md:text-xl mb-20 leading-relaxed text-gray-700"
        >
          Parece que esta página se desvió del almacén.
          <br />
          No te preocupes, nuestro camión te llevará de vuelta al inventario principal.
        </p>

        {/* Botón de acción - SIN estilos inline forzados */}
        <button
          ref={buttonRef}
          className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl text-lg hover:bg-blue-700"
          onClick={() => window.history.back()}
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Regresar al Almacén</span>
          </span>
        </button>
      </div>

    </div>
  )
}

export default NotFoundPage