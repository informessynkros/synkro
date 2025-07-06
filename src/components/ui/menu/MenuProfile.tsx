// Componente del perfil de usuario

import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import MenuItem from "./MenuItem"
import LineSeparator from "../lineSeparator/LineSeparator"
import { forwardRef, useEffect, useRef } from "react"
import gsap from "gsap"
import useMediaQueries from "../../../hooks/useMediaQueries"


interface MenuProfileProps {
  profileOpen: boolean
  setProfileOpen: () => void
}

const MenuProfile = forwardRef<HTMLDivElement, MenuProfileProps>(
  ({ profileOpen, setProfileOpen }, ref) => {

    // Hook
    const { isMobile, isTablet } = useMediaQueries()

    // Refs
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Animación de entrada del dropdown
    useEffect(() => {
      if (dropdownRef.current && profileOpen) {
        gsap.fromTo(dropdownRef.current,
          { opacity: 0, scale: 0.95, y: -10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "back.out(1.7)" }
        )
      }
    }, [profileOpen])

    // Función que cierra con animación
    const handleCloseWithAnimation = () => {
      if (dropdownRef.current) {
        gsap.to(dropdownRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            setProfileOpen()
          }
        })
      } else {
        setProfileOpen()
      }
    }

    return (
      <div ref={ref} className="relative">
        <button
          onClick={setProfileOpen}
          className={`
            flex items-center rounded-lg hover:bg-gray-100 transition-colors duration-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isMobile ? 'p-1.5 space-x-2' : 'p-2 space-x-3'}
          `}
        >
          <div className={`
            bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
            flex items-center justify-center
            ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}
          `}>
            <span className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
              JP
            </span>
          </div>

          {!isMobile && (
            <span className="text-sm font-medium text-gray-900">
              {isTablet ? 'Juan P.' : 'Juan Pablo'}
            </span>
          )}

          <ChevronDown
            className={`
              text-gray-500 transition-transform duration-200
              ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}
              ${profileOpen ? 'rotate-180' : ''}
            `}
          />
        </button>

        {profileOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50
              ${isMobile ? 'w-44' : 'w-48'}
            `}
          >
            <MenuItem icon={User} text="Mi perfil" onClick={handleCloseWithAnimation} />
            <MenuItem icon={Settings} text="Configuración" onClick={handleCloseWithAnimation} />
            <LineSeparator />
            <MenuItem icon={LogOut} text="Cerrar Sesión" onClick={handleCloseWithAnimation} />
          </div>
        )}
      </div>
    )
  }
)

// Esto nos ayuda debuggear
MenuProfile.displayName = "MenuProfile"

export default MenuProfile
