// Componente de tarjeta corregido
import { ChartSpline, ChevronRight, DollarSign, Plus, type LucideIcon, Percent } from "lucide-react"
import useMediaQueries from "../../hooks/useMediaQueries"

interface CardProps {
  icon: LucideIcon
  title: string
  countSubtitle?: string
  subtitle?: string
  price?: string
  graphics?: string
  weeklyQuantity?: string
  background?: 'black' | 'white'
}

const Card = ({
  icon: Icon,
  title,
  countSubtitle = '0',
  subtitle,
  price = '0',
  graphics = '0',
  weeklyQuantity = '0',
  background = 'white'
}: CardProps) => {

  // Hook
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  const isDark = background === 'black'

  const cardClasses = isDark
    ? `${isDesktop ? 'p-5' : isTablet ? 'p-4' : isMobile ? 'p-3' : 'p-3'} bg-[#202123] rounded-2xl`
    : `${isDesktop ? 'p-5' : isTablet ? 'p-4' : isMobile ? 'p-3' : 'p-3'} bg-white rounded-2xl`

  const iconBgClasses = isDark
    ? `${isDesktop ? 'p-5' : isTablet ? 'p-4' : isMobile ? 'p-3' : 'p-3'} bg-[#333] rounded-2xl`
    : `${isDesktop ? 'p-5' : isTablet ? 'p-4' : isMobile ? 'p-3' : 'p-3'} bg-gray-100 rounded-2xl`

  const iconClasses = isDark
    ? `${isDesktop ? 'w-7 h-7' : isTablet ? 'w-6 h-6' : isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-gray-300`
    : `${isDesktop ? 'w-7 h-7' : isTablet ? 'w-6 h-6' : isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-gray-600`

  const titleClasses = isDark
    ? `${isDesktop ? 'text-2xl' : isTablet ? 'text-2xl' : isMobile ? 'text-xl' : 'text-xl'} font-semibold text-white`
    : `${isDesktop ? 'text-2xl' : isTablet ? 'text-2xl' : isMobile ? 'text-xl' : 'text-xl'} font-semibold text-gray-900`

  const subtitleClasses = isDark
    ? 'text-gray-400'
    : 'text-gray-500'

  const chevronBgClasses = isDark
    ? 'bg-[#333] hover:bg-[#444] rounded-full duration-200 p-1 cursor-pointer'
    : 'bg-gray-100 hover:bg-gray-200 rounded-full duration-200 p-1 cursor-pointer'

  const chevronClasses = isDark
    ? `${isDesktop ? 'h-7 w-7' : isTablet ? 'h-6 w-6' : isMobile ? 'h-5 w-5' : 'text-xl'} text-white`
    : `${isDesktop ? 'h-7 w-7' : isTablet ? 'h-6 w-6' : isMobile ? 'h-5 w-5' : 'text-xl'} text-gray-600`

  const priceClasses = isDark
    ? 'text-white flex items-center gap-1.5 my-5'
    : 'text-gray-900 flex items-center gap-1.5 my-5'

  const metricsClasses = isDark
    ? 'text-white'
    : 'text-gray-900'

  const weeklyTextClasses = isDark
    ? 'text-gray-400 ml-2'
    : 'text-gray-500 ml-2'

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={iconBgClasses}>
            <Icon className={iconClasses} />
          </div>
          <div className="flex flex-col gap-2">
            <span className={titleClasses}>{title}</span>
            <span className={subtitleClasses}> {countSubtitle} {` `} {subtitle} </span>
          </div>
        </div>
        <div className={chevronBgClasses}>
          <ChevronRight className={chevronClasses} />
        </div>
      </div>

      <div className={priceClasses}>
        <DollarSign />
        <span className={`${isDesktop ? 'text-3xl' : isMobile ? 'text-2xl' : 'text-2xl'}`}>{price}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-3 ${metricsClasses}`}>
          <ChartSpline />
          <div className="flex items-center">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>{graphics}</span>
            <Percent className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
        <div className={`flex items-center gap-3 ${metricsClasses}`}>
          <div className="flex items-center">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>{weeklyQuantity}</span>
            <span className={weeklyTextClasses}>Está semana</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card