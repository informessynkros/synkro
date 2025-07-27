// Sidebar

import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import useNavigation from "../../../hooks/useNavigation"
import useMediaQueries from "../../../hooks/useMediaQueries"
import { routesDashboard, type RouteConfig } from "../../../helpers/routes/routes"
import { ChevronDown, ChevronRight } from "lucide-react"
import gsap from "gsap"


interface SidebarProps {
  isCollapsed: boolean
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {

  // Estados
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { goView } = useNavigation()
  const location = useLocation()

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Hook
  const { isMobile } = useMediaQueries()

  // Auto expandir el modulo que tiene la ruta activa
  useEffect(() => {
    const findParentWithActiveChild = (routes: RouteConfig[]): string | null => {
      for (const route of routes) {
        if (route.subItems) {
          const hasActive = route.subItems.some(sub => sub.path === location.pathname)
          if (hasActive) return route.key

          const nestedParent = findParentWithActiveChild(route.subItems)
          if (nestedParent) return route.key
        }
      }
      return null
    }

    const activeParent = findParentWithActiveChild(routesDashboard)

    if (activeParent) {
      // Solo mantener abierto el módulo que tiene la ruta activa
      setExpandedItems([activeParent])
    } else {
      // Si no hay padre activo, cerrar todos
      setExpandedItems([])
    }
  }, [location.pathname])

  // Función que muestra y oculta los módulos hijos
  const toggleExpansion = (key: string) => {
    setExpandedItems(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    )
  }

  // Función para navegar
  const handleNavigation = (path: string) => {
    goView(path)
  }

  // Verificamos si una ruta está activa
  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  // Verificamos si un módulo padre tiene rutas activas
  const hasActiveChild = (subItems: RouteConfig[]) => {
    return subItems.some(item => item.path && isActiveRoute(item.path))
  }

  // Verificar si es el último item del grupo
  const isLastItem = (routes: RouteConfig[], currentIndex: number) => {
    return currentIndex === routes.length - 1
  }

  // Renderizamos las líneas conectoras
  const renderConnectorLines = (isChild: boolean, isLast: boolean, hasChildren: boolean, isExpanded: boolean) => {
    if (!isChild) return null

    return (
      <div className="absolute left-6 top-0 bottom-0 flex">
        {/* Línea vertical principal */}
        <div className={`w-px bg-gray-200 ${isLast ? 'h-6' : 'h-full'}`} />

        {/* Línea horizontal */}
        <div className="w-4 h-px bg-gray-200 mt-6" />

        {/* Línea vertical para items expandidos */}
        {hasChildren && isExpanded && (
          <div className="absolute left-4 top-6 w-px bg-gray-200 h-full" />
        )}
      </div>
    )
  }

  const renderMenuItem = (route: RouteConfig, isChild = false, itemIndex = 0, totalItems = 0) => {
    console.log(totalItems)
    const isExpanded = expandedItems.includes(route.key)
    const isActive = route.path ? isActiveRoute(route.path) : hasActiveChild(route.subItems || [])
    const hasChildren = route.subItems && route.subItems.length > 0
    const isLast = isLastItem(routesDashboard.filter(r => r.showInSidebar), itemIndex)

    return (
      <div key={route.key} className="relative">
        {/* Renderizar líneas conectoras */}
        {renderConnectorLines(isChild, isLast, !!hasChildren, isExpanded)}

        {/* Item del menú */}
        <div
          className={`
            relative flex items-center justify-between cursor-pointer group
            transition-all duration-200 ease-in-out
            ${isChild
              ? `ml-8 px-4 py-2.5 mx-4 rounded-lg ${isActive
                ? ''
                : 'hover:bg-gray-50'
              }`
              : `px-6 py-3 mx-2 rounded-lg hover:bg-gray-50 ${isActive
                ? ''
                : ''
              }`
            }
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpansion(route.key)
            } else if (route.path) {
              handleNavigation(route.path)
            }
          }}
        >
          <div className="flex items-center gap-3">
            <route.icon
              className={`w-5 h-5 transition-colors duration-200 ${isActive
                ? 'text-sky-600'
                : 'text-gray-600 group-hover:text-gray-800'
                }`}
            />
            <span
              className={`font-medium transition-colors duration-200 ${isActive
                ? 'text-sky-700'
                : 'text-gray-700 group-hover:text-gray-900'
                }`}
            >
              {route.name}
            </span>
          </div>

          {hasChildren && (
            <div className="transition-all duration-200 group-hover:scale-110">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </div>
          )}
        </div>

        {/* Submenu con animación */}
        {hasChildren && (
          <div
            ref={el => {
              if (el && el.dataset.animated !== isExpanded.toString()) {
                el.dataset.animated = isExpanded.toString()

                if (isExpanded) {
                  el.style.display = 'block'
                  gsap.fromTo(el,
                    { height: 0, opacity: 0 },
                    { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
                  )
                } else {
                  gsap.to(el, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                      el.style.display = 'none'
                    }
                  })
                }
              }
            }}
            className="overflow-hidden"
            style={{ display: isExpanded ? 'block' : 'none' }}
          >
            <div className="relative">
              {/* Línea vertical para conectar subitems */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

              {route.subItems?.map((subRoute, subIndex) => (
                <div key={subRoute.key} className="relative">
                  {renderMenuItem(subRoute, true, subIndex, route.subItems?.length || 0)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={sidebarRef}
      className={`
        bg-white h-full transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200
        ${isMobile ? 'shadow-xl' : 'shadow-sm'}
      `}
      style={{
        width: isCollapsed ? '0px' : '300px',
        minWidth: isCollapsed ? '0px' : '300px'
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header/Logo */}
        <div className="flex justify-center items-center py-8 border-b border-gray-100">
          <div className="flex gap-3 items-center">
            <span className="text-2xl font-bold text-gray-800">@</span>
            <span className="text-2xl font-bold text-gray-800">Synkros</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 overflow-y-auto">
          <div className="space-y-1">
            {routesDashboard
              .filter(route => route.showInSidebar)
              .map((route, index) => renderMenuItem(route, false, index))}
          </div>
        </nav>

        {/* Footer opcional */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 text-center">
            Synkros
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
