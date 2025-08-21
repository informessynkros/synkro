// Titulo

interface TitleProps {
  title: string
  typography: 'h1' | 'h2' | 'h3'
  fontWeight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  italic?: boolean
  className?: string
}

const Title = ({
  title,
  typography,
  fontWeight = 'bold',
  italic = false,
  className = ''
}: TitleProps) => {

  // Mapeo de typography a tamaños de Tailwind
  const getTypographySize = (type: 'h1' | 'h2' | 'h3'): string => {
    switch (type) {
      case 'h1':
        return 'text-5xl' // 48px
      case 'h2':
        return 'text-4xl' // 36px  
      case 'h3':
        return 'text-3xl' // 30px
      default:
        return 'text-3xl'
    }
  }

  // Mapeo de fontWeight a clases de Tailwind
  const getFontWeight = (weight: TitleProps['fontWeight']): string => {
    const weightMap: Record<NonNullable<TitleProps['fontWeight']>, string> = {
      'thin': 'font-thin',           // 100
      'extralight': 'font-extralight', // 200
      'light': 'font-light',         // 300
      'normal': 'font-normal',       // 400
      'medium': 'font-medium',       // 500
      'semibold': 'font-semibold',   // 600
      'bold': 'font-bold',           // 700
      'extrabold': 'font-extrabold', // 800
      'black': 'font-black'          // 900
    }
    return weight ? weightMap[weight] : 'font-bold'
  }

  // Construir las clases CSS
  const sizeClass = getTypographySize(typography)
  const weightClass = getFontWeight(fontWeight)
  const italicClass = italic ? 'italic' : ''

  const combinedClasses = [
    sizeClass,
    weightClass,
    italicClass,
    className
  ].filter(Boolean).join(' ')

  // Usar el elemento HTML semántico correcto
  if (typography === 'h1') return <h1 className={combinedClasses}>{title}</h1>
  if (typography === 'h2') return <h2 className={combinedClasses}>{title}</h2>
  return <h3 className={combinedClasses}>{title}</h3>
}

export default Title

// Ejemplos de uso:

// Básico
// <Title title="Título Principal" typography="h1" />

// Con peso personalizado
// <Title title="Subtítulo" typography="h2" fontWeight="medium" />

// Con itálica
// <Title title="Texto destacado" typography="h3" fontWeight="light" italic={true} />

// Con clases adicionales
// <Title 
//   title="Título con colores" 
//   typography="h1" 
//   fontWeight="extrabold" 
//   className="text-teal-600 mb-4"
// />

// Todos los pesos disponibles:
// 'thin' (font-thin - 100)
// 'extralight' (font-extralight - 200)  
// 'light' (font-light - 300)
// 'normal' (font-normal - 400)
// 'medium' (font-medium - 500)
// 'semibold' (font-semibold - 600)
// 'bold' (font-bold - 700) - DEFAULT
// 'extrabold' (font-extrabold - 800)
// 'black' (font-black - 900)