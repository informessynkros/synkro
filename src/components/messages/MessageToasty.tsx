// Componente que nos ayuda con los mensajes de errores en los inputs
import { CircleX, type LucideIcon } from 'lucide-react'
import InputCustom from '../input/InputCustom'
import { forwardRef, type InputHTMLAttributes, useRef, useEffect } from 'react'
import { errorAnimations } from '../../utils/animations'

export interface MessageToastyProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: LucideIcon
  onFileSelect?: (file: File | null) => void
}

const MessageToasty = forwardRef<HTMLInputElement, MessageToastyProps>(
  ({ label, error, icon: Icon, type, onFileSelect, ...props }, ref) => {
    const errorRef = useRef<HTMLDivElement>(null)
    const previousError = useRef<string | undefined>(undefined)

    // Manejar animaciones de error
    useEffect(() => {
      const errorElement = errorRef.current
      if (!errorElement) return

      // Si el error aparece por primera vez
      if (error && !previousError.current) {
        errorAnimations.showError(errorElement)
      }

      // Si el error desaparece
      if (!error && previousError.current) {
        errorAnimations.hideError(errorElement)
      }

      previousError.current = error
    }, [error])

    let InputComponent: React.ElementType = InputCustom

    // Comentado hasta crear los demas componentes
    /*
    if (type === 'textarea') {
      InputComponent = CustomTextarea
    } else if (type === 'date') {
      InputComponent = CustomDateInput
    } else if (type === 'password') {
      InputComponent = CustomPassword
    } else if (type === 'file') {
      InputComponent = CustomInputFile
    }
    */

    return (
      <div className="mb-4">
        <InputComponent
          label={label}
          icon={Icon}
          error={error}
          ref={ref as any}
          onFileSelect={onFileSelect}
          type={type}
          {...props}
        />

        {/* Mensaje de error */}
        <div
          ref={errorRef}
          className={`
            flex items-center text-red-600 text-sm font-medium
            bg-red-50 rounded-md p-3 gap-2 border border-red-200
            ${error ? 'block' : 'hidden'}
          `}
          style={{
            opacity: error ? 1 : 0,
            height: error ? 'auto' : 0,
            marginTop: error ? 4 : 0
          }}
        >
          <CircleX className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    )
  }
)

MessageToasty.displayName = 'MessageToasty'
export default MessageToasty
