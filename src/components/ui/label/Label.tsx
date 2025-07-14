// Componente de label mejorado
import type { LucideIcon } from "lucide-react"
import useMediaQueries from "../../../hooks/useMediaQueries"

interface LabelProps {
  text: string
  textCount?: string | number
  icon: LucideIcon
  className?: string
  variant?: 'dark' | 'light' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const Label = ({
  text,
  textCount = '0',
  icon: Icon,
  className = '',
  variant = 'dark',
  size
}: LabelProps) => {
  const { isTablet, isMobile } = useMediaQueries()

  // Determinar tamaño automáticamente si no se especifica
  const autoSize = size || (isMobile ? 'xs' : isTablet ? 'sm' : 'md')

  // Variantes de color con mejor contraste
  const variants = {
    dark: {
      background: 'bg-gray-800/90',
      text: 'text-white',
      icon: 'text-gray-200'
    },
    light: {
      background: 'bg-gray-100/95',
      text: 'text-gray-800',
      icon: 'text-gray-600'
    },
    primary: {
      background: 'bg-blue-600/90',
      text: 'text-white',
      icon: 'text-blue-100'
    },
    secondary: {
      background: 'bg-purple-600/90',
      text: 'text-white',
      icon: 'text-purple-100'
    },
    success: {
      background: 'bg-green-600/90',
      text: 'text-white',
      icon: 'text-green-100'
    },
    warning: {
      background: 'bg-yellow-500/90',
      text: 'text-yellow-900',
      icon: 'text-yellow-800'
    },
    error: {
      background: 'bg-red-600/90',
      text: 'text-white',
      icon: 'text-red-100'
    }
  }

  // Tamaños responsivos
  const sizes = {
    xs: {
      container: 'px-2 py-1 text-xs gap-1.5',
      icon: 'w-3 h-3',
      font: 'font-medium'
    },
    sm: {
      container: 'px-2.5 py-1.5 text-sm gap-2',
      icon: 'w-3.5 h-3.5',
      font: 'font-medium'
    },
    md: {
      container: 'px-3 py-2 text-sm gap-2',
      icon: 'w-4 h-4',
      font: 'font-semibold'
    },
    lg: {
      container: 'px-4 py-2.5 text-base gap-2.5',
      icon: 'w-5 h-5',
      font: 'font-semibold'
    }
  }

  const currentVariant = variants[variant]
  const currentSize = sizes[autoSize]

  return (
    <div
      className={`
        flex items-center rounded-lg text-xs
        transition-all duration-200 ease-in-out hover:shadow-sm
        ${currentVariant.background}
        ${currentVariant.text}
        ${currentSize.container}
        ${currentSize.font}
        ${className}
      `}
    >
      <Icon className={`${currentSize.icon} ${currentVariant.icon} flex-shrink-0`} />

      <span className="font-bold tracking-tight">
        {textCount}
      </span>

      <span className="whitespace-nowrap">
        {text}
      </span>
    </div>
  )
}

export default Label