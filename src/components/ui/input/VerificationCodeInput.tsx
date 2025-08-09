// Componente que maneja el código de verificación de MFA

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { gsap } from 'gsap'
import { CircleX } from 'lucide-react'

interface VerificationCodeInputProps {
  onChange: (code: string) => void
  error?: string
}

const VerificationCodeInput = ({ onChange, error }: VerificationCodeInputProps) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const errorRef = useRef<HTMLParagraphElement>(null)

  // Efecto cuando code cambia
  useEffect(() => {
    onChange(code.join(''))
  }, [code, onChange])

  // Animación de error con GSAP
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(errorRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [error])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Animación sutil al input cuando se llena
      if (value !== '' && inputRefs.current[index]) {
        gsap.fromTo(inputRefs.current[index],
          { scale: 1 },
          {
            scale: 1.1,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
          }
        )
      }

      // Mover foco al siguiente input
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="mb-4">
      {error && (
        <p
          ref={errorRef}
          className="flex items-center text-red-700 text-sm mt-1 bg-red-100 font-semibold rounded-md p-2 mb-2 gap-2"
        >
          <CircleX className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Código de verificación
      </label>

      <div className="flex flex-wrap justify-between gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el }}
            type="text"
            maxLength={1}
            className={`w-12 h-12 text-center text-2xl border-2 rounded-lg transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50 ${digit ? 'border-green-400 bg-green-50' : 'border-gray-300'
              } ${error ? 'border-red-400' : ''}`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        {code.join('').length}/6 dígitos
      </p>
    </div>
  )
}

export default VerificationCodeInput