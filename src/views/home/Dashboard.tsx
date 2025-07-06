// Vista de panel de control

import { Box, ShoppingBag, User } from "lucide-react"
import Card from "../../components/ui/card/Card"
import useMediaQueries from "../../hooks/useMediaQueries"
import CustomLineChart from "../../components/ui/graphics/LineChart"
import CustomDonutChart from "../../components/ui/graphics/DonutCahart"


const Dashboard = () => {

  // Hook
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  // Datos para la gráfica de líneas
  const lineChartData = [
    { name: '03 Wed', forecast: 30, activaciones: 50 },
    { name: '04 Thu', forecast: 40, activaciones: 20 },
    { name: '05 Fri', forecast: 45, activaciones: 35 },
    { name: '06 Sat', forecast: 37, activaciones: 25 },
    { name: '07 Sun', forecast: 42, activaciones: 35 },
    { name: '08 Mon', forecast: 62, activaciones: 43 },
    { name: '09 Tue', forecast: 55, activaciones: 25 },
    { name: '10 Wed', forecast: 12, activaciones: 20 },
    { name: '11 Thu', forecast: 35, activaciones: 38 },
    { name: '12 Fri', forecast: 38, activaciones: 30 },
    { name: '13 Sat', forecast: 20, activaciones: 25 },
    { name: '14 Sun', forecast: 10, activaciones: 18 },
    { name: '15 Mon', forecast: 32, activaciones: 22 },
    { name: '16 Tue', forecast: 48, activaciones: 28 }
  ]

  // Datos para la gráfica circular
  const donutChartData = [
    { name: 'plan1', value: 40, color: '#333333', label: '10 Días - 4GB' },
    { name: 'plan2', value: 30, color: '#666666', label: '15 Días - 6GB' },
    { name: 'plan3', value: 30, color: '#cccccc', label: '30 Días - 30GB' }
  ]

  return (
    <div className="">
      <div className={`grid ${isDesktop ? 'grid-cols-3 gap-8' : isTablet ? 'grid-cols-2 gap-5' : isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 gap-3'}`}>
        <Card
          icon={ShoppingBag}
          title="Activaciones"
          countSubtitle="120"
          subtitle="Activaciones Netas"
          price="9,328.55"
          graphics="15.6"
          weeklyQuantity="1.4k"
          background="black" />
        <Card
          icon={User}
          title="Recargas"
          countSubtitle="1,500"
          subtitle="Recargas de ayer"
          price="12,302"
          graphics="12.7"
          weeklyQuantity="1.2k"
          background="white" />
        <Card
          icon={Box}
          title="Portabilidades"
          countSubtitle="1,500"
          subtitle="Port In"
          price="5,000"
          graphics="12.7"
          weeklyQuantity="1.2k"
          background="white" />
      </div>

      {/* Gráficas */}
      <div className={`pt-8 pb-8 grid ${isDesktop
        ? 'grid-cols-2 gap-8'
        : isTablet
          ? 'grid-cols-1 gap-6'
          : isMobile
            ? 'grid-cols-1 gap-4'
            : 'grid-cols-2 gap-8'
        }`}>
        <CustomLineChart
          data={lineChartData}
          title="Activaciones Vs Forecast"
        />
        <CustomDonutChart
          data={donutChartData}
          totalValue="$6.2k"
          title="Recargas"
        />
      </div>
    </div>
  )
}

export default Dashboard
