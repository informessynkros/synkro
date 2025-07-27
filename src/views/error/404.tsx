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
    // Asegurar visibilidad inicial
    gsap.set([titleRef.current, descriptionRef.current, buttonRef.current], {
      opacity: 1,
      y: 0
    })

    const tl = gsap.timeline()

    // Animación inicial del contenedor
    tl.from(containerRef.current, {
      opacity: 0,
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

    // Animación del camión (entrada desde la izquierda)
    tl.from(truckRef.current, {
      x: -200,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.7)"
    }, 0.3)

    // Efecto slot machine para el 404
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const finalNumbers = ['4', '0', '4']

    slotRefs.current.forEach((slot, index) => {
      if (slot) {
        // Animación de giro rápido
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

    // Animación del texto
    tl.fromTo(titleRef.current, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, 1.5)

    tl.fromTo(descriptionRef.current, {
      y: 20,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, 1.8)

    tl.fromTo(buttonRef.current, {
      y: 20,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Ilustración SVG de fondo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="800"
          height="600"
          viewBox="0 0 800 600"
          className="w-full h-full max-w-4xl opacity-10"
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
            <ellipse cx="150" cy="120" rx="40" ry="25" fill="white" opacity="0.8" />
            <ellipse cx="180" cy="115" rx="35" ry="20" fill="white" opacity="0.8" />
            <ellipse cx="130" cy="115" rx="30" ry="18" fill="white" opacity="0.8" />

            <ellipse cx="450" cy="80" rx="45" ry="28" fill="white" opacity="0.7" />
            <ellipse cx="485" cy="75" rx="38" ry="22" fill="white" opacity="0.7" />
            <ellipse cx="420" cy="75" rx="32" ry="20" fill="white" opacity="0.7" />

            <ellipse cx="650" cy="140" rx="35" ry="20" fill="white" opacity="0.6" />
            <ellipse cx="675" cy="135" rx="30" ry="18" fill="white" opacity="0.6" />
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

      {/* Camión animado */}
      <div ref={truckRef} className="absolute bottom-32 left-1/4 z-10">
        <svg width="120" height="60" viewBox="0 0 120 60">
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

          {/* Ruedas */}
          <circle cx="25" cy="50" r="8" fill="#1f2937" />
          <circle cx="25" cy="50" r="5" fill="#374151" />
          <circle cx="75" cy="50" r="8" fill="#1f2937" />
          <circle cx="75" cy="50" r="5" fill="#374151" />
          <circle cx="85" cy="50" r="8" fill="#1f2937" />
          <circle cx="85" cy="50" r="5" fill="#374151" />
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
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  color: '#2563eb'
                }}
              >
                0
              </span>
            </div>
          ))}
        </div>

        {/* Título */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          style={{ color: '#111827' }}
        >
          ¡Ups! Mercancía Perdida
        </h1>

        {/* Descripción */}
        <p
          ref={descriptionRef}
          className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
          style={{ color: '#374151' }}
        >
          Parece que esta página se desvió del almacén.
          <br />
          No te preocupes, nuestro camión te llevará de vuelta al inventario principal.
        </p>

        {/* Botón de acción */}
        <button
          ref={buttonRef}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl text-lg hover:scale-105"
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

      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 right-20">
        <div className="w-12 h-12 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      </div>
      <div className="absolute top-32 left-16">
        <div className="w-8 h-8 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="absolute bottom-40 right-32">
        <div className="w-10 h-10 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}

export default NotFoundPage