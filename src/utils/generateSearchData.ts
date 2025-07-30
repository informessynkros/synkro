// Genración de información de búsqueda para Algolia

import { routesDashboard, type RouteConfig } from "../helpers/routes/routes"
import type { SearchableItem } from '../lib/algolia'


const generateKeywords = (route: RouteConfig): string[] => {
  const keywords: string[] = []

  // Nomrbe de la ruta
  keywords.push(route.name.toLowerCase())

  // Palabras clave escpecíficas por módulo
  const keywordMap: Record<string, string[]> = {
    'dashboard': ['inicio', 'home', 'principal', 'métricas', 'estadísticas'],
    'inventory': ['productos', 'stock', 'almacén', 'inventario', 'items'],
    'campaigns': ['marketing', 'promociones', 'anuncios', 'campañas', 'publicidad'],
    'crm': ['clientes', 'leads', 'ventas', 'contactos', 'relaciones'],
    'warehouses': ['almacenes', 'depósitos', 'ubicaciones', 'warehouses'],
    'create-inventory': ['crear', 'nuevo', 'agregar', 'add', 'crear almacén'],
    'charge-inventory': ['cargar', 'llenar', 'abastecer', 'restock', 'cargar almacén']
  }

  if (keywordMap[route.key]) {
    keywords.push(...keywordMap[route.key])
  }

  // Keywords por tipo de acción
  if (route.key.includes('create')) {
    keywords.push('crear', 'nuevo', 'agregar', 'add')
  }

  if (route.key.includes('charge') || route.key.includes('load')) {
    keywords.push('cargar', 'llenar', 'actualizar')
  }

  return [...new Set(keywords)]
}

// Función para determinar la categoria
const getCategory = (route: RouteConfig, parentName?: string): string => {
  if (parentName) return parentName

  const categoryMap: Record<string, string> = {
    'dashboard': 'Principal',
    'inventory': 'Gestión',
    'campaigns': 'Marketing',
    'crm': 'Ventas',
    'warehouses': 'Almacenes',
    'create-inventory': 'Acciones',
    'charge-inventory': 'Acciones'
  }

  return categoryMap[route.key] || 'Navegación'
}

// Función para generar una descripción automática
const generateDescription = (route: RouteConfig, parentName?: string): string => {
  const descriptions: Record<string, string> = {
    'dashboard': 'Página principal con métricas y estadísticas de tu MVNO',
    'inventory': 'Gestión completa de inventario y productos',
    'campaigns': 'Crear y gestionar campañas de marketing',
    'crm': 'Administrar clientes y relaciones comerciales',
    'warehouses': 'Gestión de almacenes y ubicaciones',
    'create-inventory': 'Crear un nuevo almacén para gestionar inventario',
    'charge-inventory': 'Cargar productos y stock en almacenes existentes'
  }

  if (descriptions[route.key]) {
    return descriptions[route.key]
  }

  // Descripción genérica
  const prefix = parentName ? `Modulo de ${parentName.toLowerCase()} -` : ''
  return `${prefix} ${route.name}`
}

// Función para determinar si la ruta está disponible
const isRouteAvailable = (route: RouteConfig): boolean => {
  // Rutas con las que cuento (Que funcionan)
  const availableRoutes = [
    'dashboard',
    'inventory',
    'campaigns',
    'crm',
    'warehouses',
    'create-inventory',
    'charge-inventory'
  ]

  return availableRoutes.includes(route.key)
}

// Función principal para convertir rutas a datos de búsqueda
const convertRouteToSearchItem = (
  route: RouteConfig,
  parentName?: string
): SearchableItem | null => {
  // Solo indexar rutas que tienen path (son navegables)
  if (!route.path) return null

  const isAvailable = isRouteAvailable(route)

  return {
    objectID: route.key,
    title: route.name,
    description: generateDescription(route, parentName),
    type: route.showInSidebar ? 'module' : 'action',
    category: getCategory(route, parentName),
    url: route.path,
    keywords: generateKeywords(route),
    available: isAvailable,
    priority: route.key === 'dashboard' ? 1 : route.showInSidebar ? 2 : 3
  }
}

// Función recursiva para procesar rutas y subrutas
const processRoutes = (routes: RouteConfig[], parentName?: string): SearchableItem[] => {
  const searchItems: SearchableItem[] = []

  routes.forEach(route => {
    // Procesar la ruta actual
    const searchItem = convertRouteToSearchItem(route, parentName)
    if (searchItem) {
      searchItems.push(searchItem)
    }

    // Procesar subrutas si existen
    if (route.subItems) {
      const subItems = processRoutes(route.subItems, route.name)
      searchItems.push(...subItems)
    }
  })

  return searchItems
}

// Función principal para generar todos los datos de búsqueda
export const generateSearchDataFromRoutes = (): SearchableItem[] => {
  const routeItems = processRoutes(routesDashboard)

  // Agragamos algunos items adicionales útiles
  const additionalItems: SearchableItem[] = [
    {
      objectID: 'help_navigation',
      title: 'Navegación y ayuda',
      description: 'Guía para navegar por el sistema y usar las funcionalidades',
      type: 'help',
      category: 'Ayuda',
      keywords: ['ayuda', 'help', 'navegación', 'guía', 'tutorial', 'como usar'],
      available: true,
      priority: 3
    },
    {
      objectID: 'search_help',
      title: 'Cómo usar la búsqueda',
      description: 'Aprende a buscar módulos, acciones y navegación rápida',
      type: 'help',
      category: 'Ayuda',
      keywords: ['buscar', 'search', 'encontrar', 'atajos', 'cmd+k'],
      available: true,
      priority: 3
    }
  ]

  return [...routeItems, ...additionalItems]
}

// Función para obtener estadísticas del índice
export const getSearchStats = () => {
  const data = generateSearchDataFromRoutes()

  const stats = {
    total: data.length,
    byType: data.reduce((acc, item) => {
      const type = item.type as string
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byCategory: data.reduce((acc, item) => {
      const category = item.category as string
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    available: data.filter(item => item.available).length,
    unavailable: data.filter(item => !item.available).length
  }

  return stats
}
