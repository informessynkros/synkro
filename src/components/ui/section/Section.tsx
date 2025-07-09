// Componente de sección para titulos en vistas

import type { LucideIcon } from "lucide-react"
import useMediaQueries from "../../../hooks/useMediaQueries"


interface SectionProps {
  text: string
  icon: LucideIcon
  colorText?: string
  background?: string
}

const Section = ({
  text,
  icon: Icon,
  colorText = "text-[#555]",
  background = "bg-white"
}: SectionProps) => {

  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  return (
    <div className={`${background} shadow-md p-6 rounded-md`}>
      <div className={`${colorText} flex items-center gap-3`}>
        <Icon />
        <span className={`${isDesktop ? 'text-2xl font-semibold' : isTablet ? 'text-xl font' : isMobile ? 'text-base font-normal' : ''}`}>
          {text}
        </span>
      </div>
    </div>
  )
}

export default Section
