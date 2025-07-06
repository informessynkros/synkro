// Componente de radio button

import { CircleX } from "lucide-react"


export interface RadioOption<T = any> {
  label: string,
  value: T,
}

interface RadioButtonGroupProps<T = any> {
  label?: string
  options: RadioOption<T>[]
  value?: T,
  onChange: (value: T) => void
  error?: string
  required?: boolean
  name: string
  className?: string
  disabled?: boolean
}

const RadioButtonGroup = <T = any,>({
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  name,
  className = "",
  disabled = false
}: RadioButtonGroupProps<T>) => {

  const hasError = !!error
  const isEmpty = value === undefined || value === null

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex flex-row gap-2">
        {options.map((option, index) => {
          const isSelected = value === option.value
          const radioId = `${name}-${index}`

          return (
            <label
              key={index}
              htmlFor={radioId}
              className={`
                flex items-start gap-3 p-3 rounded-lg cursor-pointer
                transition-all duration-200 ease-in-out
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                ${isSelected
                  ? hasError
                    ? 'border-red-300 bg-red-50'
                    : 'border-[#333] bg-gray-100'
                  : hasError && isEmpty
                    ? 'border-red-300'
                    : 'border-gray-200'
                }
              `}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={String(option.value)}
                  checked={isSelected}
                  onChange={() => !disabled && onChange(option.value)}
                  disabled={disabled}
                  className="sr-only" // Esto oculta el radio nativo
                />

                <div
                  className={`
                    w-5 h-5 rounded-full border-2 transition-all duration-200 ease-in-out
                    flex items-center justify-center
                    ${isSelected
                      ? hasError
                        ? 'border-red-500 bg-red-500'
                        : 'border-[#333] bg-[#333]'
                      : hasError && isEmpty
                        ? 'border-red-400 bg-white'
                        : 'border-gray-300 bg-white'
                    }
                    ${!disabled && 'hover:border-gray-400'}
                  `}
                >
                  {/* Punto interno con animación */}
                  <div
                    className={`
                      w-2 h-2 rounded-full bg-white transition-all duration-200 ease-in-out
                      transform ${isSelected ? 'scale-100' : 'scale-0'}
                    `}
                  />
                </div>
              </div>

              {/* Contenido del label */}
              <div className="flex flex-col gap-1">
                <span
                  className={`
                    text-sm font-medium
                    ${isSelected
                      ? 'text-gray-900'
                      : 'text-gray-700'
                    }
                  `}
                >
                  {option.label}
                </span>
              </div>
            </label>
          )
        })}
      </div>

      {hasError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <CircleX className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

export default RadioButtonGroup
