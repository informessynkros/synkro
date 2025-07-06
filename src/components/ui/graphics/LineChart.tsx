// Componente de gráfica de líneas

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import useMediaQueries from '../../../hooks/useMediaQueries'
import LineSeparator from '../lineSeparator/LineSeparator'

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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              domain={[0, 70]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{
                paddingBottom: '20px',
                fontSize: '14px'
              }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#333333"
              strokeWidth={2}
              dot={{ fill: '#333333', strokeWidth: 2, r: 4 }}
              name="Forecast"
              activeDot={{ r: 6, stroke: '#333333', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="activaciones"
              stroke="#cccccc"
              strokeWidth={2}
              dot={{ fill: '#cccccc', strokeWidth: 2, r: 4 }}
              name="Activaciones"
              activeDot={{ r: 6, stroke: '#cccccc', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CustomLineChart
