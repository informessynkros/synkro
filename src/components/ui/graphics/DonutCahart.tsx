// Componente de gráfica circular (donut)

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ChevronRight } from 'lucide-react'
import useMediaQueries from '../../../hooks/useMediaQueries'
import LineSeparator from '../lineSeparator/LineSeparator'

interface DonutChartData {
  name: string
  value: number
  color: string
  label: string
}

interface CustomDonutChartProps {
  data: DonutChartData[]
  totalValue: string
  title?: string
  className?: string
}

const CustomDonutChart = ({
  data,
  totalValue,
  title = "Recargas",
  className = ""
}: CustomDonutChartProps) => {

  // Hook
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  // Clases del icono
  const chevronBgClasses = 'bg-gray-100 hover:bg-gray-200 rounded-full duration-200 p-1 cursor-pointer'
  const chevronClasses = `${isDesktop ? 'h-7 w-7' : isTablet ? 'h-6 w-6' : isMobile ? 'h-5 w-5' : 'text-xl'} text-gray-600`

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#202123]">{title}</h3>
        <div className={`${chevronBgClasses}`}>
          <ChevronRight className={`${chevronClasses}`} />
        </div>
      </div>

      <LineSeparator />

      <div className={`${isMobile ? 'flex flex-col' : 'flex'} items-center justify-between`}>
        <div className={`relative ${isDesktop ? 'w-74 h-74' : isTablet ? 'w-64 h-64' : isMobile ? 'w-44 h-44' : ''}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={isDesktop ? 100 : isTablet ? 80 : isMobile ? 70 : 70}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Valor central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#333]">{totalValue}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomDonutChart