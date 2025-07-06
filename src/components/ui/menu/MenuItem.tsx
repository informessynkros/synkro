// Componente que maneja la opción de un módulo

import { type LucideIcon } from "lucide-react"


interface MenuItemProps {
  icon: LucideIcon
  href?: string
  text: string
  colorText?: string
  hoverBgColor?: string
  onClick?: () => void
}

const MenuItem = ({
  icon: Icon,
  href = '#',
  text,
  colorText = 'text-gray-700',
  hoverBgColor = 'hover:bg-gray-100',
  onClick
}: MenuItemProps) => {
  return (
    <a
      href={`${href}`}
      className={`block px-4 py-2 text-sm ${colorText} ${hoverBgColor} transition-colors duration-200`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{text}</span>
      </div>
    </a>
  )
}

export default MenuItem
