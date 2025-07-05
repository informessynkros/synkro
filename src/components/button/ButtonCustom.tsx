// Componente de botón normal

import type { LucideIcon } from "lucide-react"
import useMediaQueries from "../../hooks/useMediaQueries"

interface ButtonProps {
  text: string
  icon: LucideIcon
  className?: string
  bgColor?: 'primary' | 'secundary'
  type?: "submit" | "reset" | "button"
  onClick?: () => void
  large?: 'w-full' | 'w-auto'
}

const ButtonCustom = ({
  text,
  icon: Icon,
  className = "",
  bgColor = 'primary',
  type = "button",
  onClick,
  large = 'w-full'
}: ButtonProps) => {
  // Hooks
  const { isDesktop, isTablet } = useMediaQueries()

  const backgroundColor = bgColor === 'primary' ? 'bg-[#333]' : bgColor === 'secundary' ? 'bg-[#777]' : 'bg-[#333]'
  const hoverColor = bgColor === 'primary' ? 'hover:bg-[#444]' : bgColor === 'secundary' ? 'hover:bg-[#666]' : 'hover:bg-[#444]'

  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        type={type}
        className={`${large} py-2 rounded-lg flex items-center justify-center gap-4 cursor-pointer ${backgroundColor} duration-200 ${hoverColor} ${className}`}
      >
        <Icon className={`${isDesktop ? 'w-7 h-7' : isTablet ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
        <span className={`text-white ${isDesktop ? 'text-normal' : isTablet ? 'text-sm' : 'text-sm'}`}>
          {text}
        </span>
      </button>
    </div>
  )
}

export default ButtonCustom
