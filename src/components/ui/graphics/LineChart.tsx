// Componente de gráfica de líneas

import useMediaQueries from '../../../hooks/useMediaQueries'
import { optionsLineChart } from '../../../utils/graphics/configurationGraphics'
import LineSeparator from '../lineSeparator/LineSeparator'
import './index'
import { Line } from 'react-chartjs-2'


interface LineChartData {
  name: string
  forecast: number
  activaciones: number
}

interface CustomLineChartProps {
  data: LineChartData[]
  title?: string
  className?: string
}

const CustomLineChart = ({
  data,
  title = "Activaciones Vs Forecast",
  className = ""
}: CustomLineChartProps) => {

  const { isMobile } = useMediaQueries()

  // Preparamos los datos de la gráfica
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Forecast',
        data: data.map(item => item.forecast),
        borderColor: '#333333',
        backgroundColor: '#333333',
        borderWidth: 2,
        pointBorderColor: '#333333',
        pointBackgroundColor: '#333333',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Activaciones',
        data: data.map(item => item.activaciones),
        borderColor: '#cccccc',
        backgroundColor: '#cccccc',
        borderWidth: 2,
        pointBorderColor: '#cccccc',
        pointBackgroundColor: '#cccccc',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
        tension: 0.4,
      }
    ]
  }

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      <div className={`${isMobile ? 'flex flex-col' : 'flex'} items-center justify-between mb-6`}>
        <h3 className="text-xl font-semibold text-[#202123]">{title}</h3>
        <div className={`flex items-center gap-3 ${isMobile ? 'pt-4' : 'p-0'}`}>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option>Exportar</option>
            <option>PDF</option>
            <option>Excel</option>
          </select>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option>30 Días</option>
            <option>7 Días</option>
            <option>90 Días</option>
          </select>
        </div>
      </div>

      <LineSeparator />

      <div className="w-full h-80">
        <Line data={chartData} options={optionsLineChart} />
      </div>
    </div>
  )
}

export default CustomLineChart
