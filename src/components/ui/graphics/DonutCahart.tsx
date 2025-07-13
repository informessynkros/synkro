// Componente de gráfica circular (donut) CORREGIDO
import { ChevronRight } from 'lucide-react'
import { optionsDonutChart } from '../../../utils/graphics/configurationGraphics'
import { Doughnut } from 'react-chartjs-2'
import './index'
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

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: data.map(item => item.color),
        borderWidth: 0,
        spacing: 2,
        borderRadius: 4,
      }
    ]
  }

  // Clases del icono
  const chevronBgClasses = 'bg-gray-100 hover:bg-gray-200 rounded-full duration-200 p-1 cursor-pointer transition-colors'
  const chevronClasses = `${isDesktop
      ? 'h-7 w-7'
      : isTablet
        ? 'h-6 w-6'
        : isMobile
          ? 'h-5 w-5'
          : 'text-xl'
    } text-gray-600`

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#202123]">{title}</h3>
        <div className={chevronBgClasses}>
          <ChevronRight className={chevronClasses} />
        </div>
      </div>

      <LineSeparator />

      <div className={`${isMobile ? 'flex flex-col' : 'flex'} items-center justify-between`}>

        <div className={`relative ${isDesktop
            ? 'w-72 h-72'
            : isTablet
              ? 'w-64 h-64'
              : isMobile
                ? 'w-44 h-44'
                : ''
          }`}>
          <Doughnut
            data={chartData}
            options={optionsDonutChart}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`font-bold text-[#333] ${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'
              }`}>
              {totalValue}
            </span>
          </div>
        </div>

        <div className={`flex flex-col gap-4 ${isMobile ? 'mt-6 w-full' : ''}`}>
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-75 cursor-pointer"
              onClick={() => console.log(`Clicked on ${item.label}`)}
            >
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0 transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 font-medium">
                {item.label}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomDonutChart