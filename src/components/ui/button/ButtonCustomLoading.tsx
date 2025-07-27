// Componente de botón con loading

import type { LucideIcon } from "lucide-react"
import Spinner from "../spinner/Spinner"
import useMediaQueries from "../../../hooks/useMediaQueries"

interface ButtonProps {
  text: string
  icon: LucideIcon
  className?: string
  isLoading?: boolean
  bgColor?: 'primary' | 'secundary'
  loadingText?: string
  type?: "submit" | "reset" | "button"
  onClick?: () => void
  large?: 'w-full' | 'w-auto'
}

const ButtonCustomLoading = ({
  text,
  icon: Icon,
  className = "",
  isLoading = false,
  bgColor = 'primary',
  loadingText = 'Procesando...',
  type = "button",
  onClick,
  large = 'w-full'
}: ButtonProps) => {
  // Hooks
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  const backgroundColor = bgColor === 'primary' ? 'bg-[#333]' : bgColor === 'secundary' ? 'bg-[#777]' : 'bg-[#333]'
  const hoverColor = bgColor === 'primary' ? 'hover:bg-[#444]' : bgColor === 'secundary' ? 'hover:bg-[#666]' : 'hover:bg-[#444]'

  const buttonClasses = isMobile
    ? `w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${backgroundColor} duration-200 ${hoverColor} ${className}`
    : `${large} px-3 py-2 rounded-lg flex items-center justify-center gap-4 cursor-pointer ${backgroundColor} duration-200 ${hoverColor} ${className}`

  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        type={type}
        disabled={isLoading}
        className={buttonClasses}
      >
        {isLoading ? (
          <Spinner
            size={20}
            color="border-white"
            speed={0.8}
          />
        ) : (
          <Icon className={`${isDesktop ? 'w-6 h-6' : isTablet ? 'w-5 h-5' : 'w-5 h-5'} text-white`} />
        )}

        {!isMobile && (
          <span className={`text-white ${isDesktop ? 'text-normal' : isTablet ? 'text-sm' : 'text-sm'}`}>
            {isLoading ? loadingText : text}
          </span>
        )}
      </button>
    </div>
  )
}

export default ButtonCustomLoading
