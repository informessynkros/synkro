// Configuración de gráficas

import type { ChartOptions } from "chart.js";

// Gráfica de LineChart
export const optionsLineChart: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { // Este ejemplo vemos: Forecast y Activaciones. Son las opciones disponibles para buscar en la gráfica, o ver las estadísticas de cierta opción
      position: 'top' as const, // Posición
      align: 'end' as const, // De que manera los vas a linear
      labels: {
        usePointStyle: true, // Si le dejamos true, serán circulos; si le ponemos false, serán rectangulos (Se refiere al color y estilo que se le dará a la opción)
        pointStyle: 'rectRounded', // Figura
        padding: 20, // Espacio
        font: { size: 14 }, // Tamaño del texto
        color: '#666' // Color
      }
    },
    tooltip: { // Es aquel componente emergente que muestra información breve
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#FFF',
      bodyColor: '#FFF',
      borderColor: '#333',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      intersect: false,
      mode: 'index' as const
    }
  },
  scales: {
    x: {
      display: true,
      grid: { display: true },
      border: { display: false },
      ticks: {
        color: '#666',
        font: { size: 12 },
        padding: 10
      }
    },
    y: { // Esto muestra los números posicionados de manera vertical del lado izquierdo
      display: true,
      min: 0,
      max: 70, // Máximo de líneas a mostrar (Es decir, son 7)
      grid: { // Esto pinta
        color: '#F0F0F0', // Color de las líneas horizontales
        lineWidth: 1 // Tamaño de la línea que cruza de manera horizontal
      },
      border: { // Asignamos 
        display: false,
        dash: [3, 3] // Esto es lo que hace que las líneas horizontales se vean muy cortas, si le pones un mínimo de 10 en ambas posiciones, la línea se estira más
      },
      ticks: { //Los ticks son los números que vemos posicionados del lado izquierdo de la gráfica
        color: '#666',
        font: { size: 12 },
        padding: 10
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  elements: { point: { hoverBorderWidth: 2 } },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  }
}


// Gráfica de DonutChart
export const optionsDonutChart: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: false // Ocultamos la leyenda porque tengo una personalizada
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#333',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: function (context) {
          const value = context.parsed
          const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: ${value}% (${percentage}%)`
        }
      }
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeOutQuart'
  },
  interaction: {
    intersect: false
  }
}
