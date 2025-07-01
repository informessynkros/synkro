// Input por defecto

import { type LucideIcon } from 'lucide-react'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({
  label,
  icon: Icon,
  error,
  ...props
}, ref) => {
  const inputClasses = `w-full px-4 py-2 ${Icon ? "pl-10" : "pl-4"
    } border rounded-lg focus:outline-none focus:ring-2 duration-200 focus:shadow-md ${error
      ? "border-red-500 focus:ring-red-500 text-red-600"
      : "border-gray-200 focus:ring-slate-700 text-slate-600"
    }`

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          className={inputClasses}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  )
})

CustomInput.displayName = 'CustomInput'

export default CustomInput