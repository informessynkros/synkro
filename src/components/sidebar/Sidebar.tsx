// Componente sidebar mejorado

import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { routesDashboard, type RouteConfig } from "../../helpers/routes/routes"
import { ChevronDown, ChevronRight } from "lucide-react"
import gsap from "gsap"
import useMediaQueries from "../../hooks/useMediaQueries"


interface SidebarProps {
  isCollapsed: boolean
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {

  // Estados
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Hook
  const { isMobile } = useMediaQueries()

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
    navigate(path)
  }

  // Verificamos si una ruta está activa
  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  // Verificamos si un módulo padre tiene rutas activas
  const hasActiveChild = (subItems: RouteConfig[]) => {
    return subItems.some(item => item.path && isActiveRoute(item.path))
  }

  // Rendrizar item del menú
  const renderMenuItem = (route: RouteConfig, isChild = false) => {
    const isExpanded = expandedItems.includes(route.key)
    const isActive = route.path ? isActiveRoute(route.path) : hasActiveChild(route.subItems || [])
    const hasChildren = route.subItems && route.subItems.length > 0

    return (
      <div key={route.key} className="mb-1">
        <div
          className={`
            flex items-center justify-between cursor-pointer
            transition-all duration-200
            ${isChild
              ? `mx-4 px-4 py-2 rounded-full hover:bg-[#333] ${isActive ? 'bg-[#333]' : ''}`
              : `px-6 py-3 ${isActive ? 'border-l-4 border-white' : ''}`
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
            <route.icon className="w-5 h-5 text-gray-300" />
            <span className="text-gray-100 font-medium">{route.name}</span>
          </div>

          {hasChildren && (
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {hasChildren && (
          <div
            ref={el => {
              if (el) {
                if (isExpanded) {
                  gsap.fromTo(el,
                    { height: 0, opacity: 0 },
                    { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
                  )
                } else {
                  gsap.to(el, {
                    height: 0, opacity: 0, duration: 0.3, ease: 'power2.in'
                  })
                }
              }
            }}
            className={`overflow-hidden ${isExpanded ? 'block' : 'hidden'}`}
          >
            {route.subItems?.map(subRoute =>
              renderMenuItem(subRoute, true)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={sidebarRef}
      className={`
        bg-[#202123] h-full transition-all duration-300 ease-in-out overflow-hidden
        ${isMobile ? 'shadow-xl;' : ''}
      `}
      style={{
        width: isCollapsed ? '0px' : '300px',
        minWidth: isCollapsed ? '0px' : '300px'
      }}
    >
      <div className="text-white">
        <div className="flex justify-center items-center my-14 text-2xl font-bold">
          <div className="flex gap-3 items-center">
            <span>@</span>
            <span>Synkros</span>
          </div>
        </div>

        <nav>
          {routesDashboard.filter(route => route.showInSidebar).map(route => renderMenuItem(route))}
        </nav>
      </div>
    </div>
  )

}

export default Sidebar