// Componente Checkbox

import { type InputHTMLAttributes, useEffect, useRef } from "react"
import { gsap } from 'gsap'
import './style.css'


// Componente de check con GSAP
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
}

const Checkbox = ({ label, className = "", ...props }: CheckboxProps) => {
  // Refs para GSAP
  const checkIconRef = useRef<SVGSVGElement>(null)
  const checkPathRef = useRef<SVGPathElement>(null)
  const checkboxRef = useRef<HTMLDivElement>(null)

  // Animación cuando cambia el estado checked
  useEffect(() => {
    if (props.checked) {
      // Animación de entrada
      if (checkIconRef.current && checkPathRef.current && checkboxRef.current) {
        // Animar el contenedor del checkbox
        gsap.to(checkboxRef.current, {
          scale: 1.1,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        })

        // Animar la aparición del ícono
        gsap.fromTo(checkIconRef.current,
          {
            scale: 0,
            rotation: -180
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
          }
        )

        // Animar el dibujo del path (efecto de escritura)
        const pathLength = checkPathRef.current.getTotalLength()
        checkPathRef.current.style.strokeDasharray = `${pathLength}`
        checkPathRef.current.style.strokeDashoffset = `${pathLength}`

        gsap.to(checkPathRef.current, {
          strokeDashoffset: 0,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.1
        })
      }
    } else {
      // Animación de salida
      if (checkIconRef.current && checkPathRef.current) {
        gsap.to(checkIconRef.current, {
          scale: 0,
          rotation: 180,
          duration: 0.2,
          ease: "power2.in"
        })
      }
    }
  }, [props.checked])

  return (
    <label className="inline-flex items-center relative cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only" // Ocultamos el checkbox original
        {...props}
      />
      <div
        ref={checkboxRef}
        className={`
          w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center 
          transition-all duration-300 group-hover:border-sky-400
          ${props.checked
            ? "bg-sky-500 border-transparent shadow-sm shadow-sky-300"
            : "bg-white group-hover:bg-sky-50"
          } 
          ${className}
        `}
        onMouseEnter={(e) => {
          if (!props.checked) {
            gsap.to(e.currentTarget, {
              scale: 1.05,
              duration: 0.2,
              ease: "power2.out"
            })
          }
        }}
        onMouseLeave={(e) => {
          if (!props.checked) {
            gsap.to(e.currentTarget, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            })
          }
        }}
      >
        {props.checked && (
          <svg
            ref={checkIconRef}
            className="w-4 h-4 text-white"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: 'scale(0)' }}
          >
            <path
              ref={checkPathRef}
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {label && (
        <span
          className="ml-2 text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-800 select-none"
        >
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox