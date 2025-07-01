// Carta de inventario

import type { LucideIcon } from "lucide-react"
import useMediaQueries from "../../hooks/useMediaQueries"


interface CardInventoryProps {
  icon: LucideIcon
  title: string
  paragraph?: string
  background?: string
  href?: string
}

const CardInventory = ({ icon: Icon, title, paragraph, background, href }: CardInventoryProps) => {

  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  return (
    <a href={href} className={`bg-[${background}] rounded-2xl p-5 cursor-pointer duration-200 shadow-md hover:shadow-lg`}>
      <div>
        <Icon className={`${isDesktop ? 'w-7 h-7' : isTablet ? 'w-6 h-6' : isMobile ? 'w-5 h-5' : ''} text-white`} />
      </div>
      <div className="flex items-start flex-col gap-3 text-white pt-4">
        <span>{title}</span>
        <span>{paragraph}</span>
      </div>
    </a>
  )
}

export default CardInventory
