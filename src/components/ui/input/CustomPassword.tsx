// Componente input de contraseña

import { Eye, EyeOff, type LucideIcon } from "lucide-react"
import { forwardRef, type InputHTMLAttributes, useState } from "react"
import CustomInput from "./InputCustom"

interface CustomPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
}

const CustomPassword = forwardRef<HTMLInputElement, CustomPasswordProps>(({
  label,
  icon: Icon,
  error,
  ...props
}, ref) => {

  const [showPassword, setShowPassword] = useState(false)

  // Logica de input password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <CustomInput
        label={label}
        type={showPassword ? 'text' : 'password'}
        ref={ref}
        {...props} />
      <button
        type="button"
        className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={togglePasswordVisibility} >
        {showPassword ? (
          <Eye className="h-5 w-5" />
        ) : (
          <EyeOff className="h-5 w-5" />
        )}
      </button>
    </div>
  )
})

CustomPassword.displayName = 'CustomPassword'

export default CustomPassword