// Componente del perfil de usuario

import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { MenuItem, MenuItemButton } from "./MenuItem"
import LineSeparator from "../lineSeparator/LineSeparator"
import { forwardRef, useEffect, useRef } from "react"
import gsap from "gsap"
import useMediaQueries from "../../../hooks/useMediaQueries"
import useAuth from "../../../hooks/useAuth"


interface MenuProfileProps {
  profileOpen: boolean
  setProfileOpen: () => void
  userName?: string
}

const MenuProfile = forwardRef<HTMLDivElement, MenuProfileProps>(
  ({ profileOpen, setProfileOpen, userName }, ref) => {

    // Hook
    const { isMobile, isTablet } = useMediaQueries()
    const { logoutUser } = useAuth()

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

    const logout = () => {
      logoutUser()
    }

    const getDisplayName = (fullName: string) => {
      if (!fullName) return ''

      const names = fullName.split(' ')

      if (isTablet && names.length >= 2) {
        return `${names[0]} ${names[1].charAt(0)}.`
      } else if (isMobile && names.length >= 1) {
        return names[0]
      }

      return fullName
    }

    // Función para obtener iniciales
    const getInitials = (fullName: string) => {
      if (!fullName) return 'U' // Usuario por defecto

      const names = fullName.trim().split(' ').filter(name => name.length > 0)

      if (names.length === 0) return 'U'
      if (names.length === 1) return names[0].charAt(0).toUpperCase()

      // Tomar primera letra del primer nombre y primera letra del último nombre
      const firstInitial = names[0].charAt(0).toUpperCase()
      const lastInitial = names[names.length - 1].charAt(0).toUpperCase()

      return `${firstInitial}${lastInitial}`
    }

    return (
      <div ref={ref} className="relative">
        <button
          onClick={setProfileOpen}
          className={`
            flex items-center rounded-lg hover:bg-gray-100 transition-colors duration-200 
            focus:outline-none focus:ring-2 focus:ring-teal-800
            ${isMobile ? 'p-1.5 space-x-2' : 'p-2 space-x-3'}
          `}
        >
          <div className={`
            bg-[#00555A] rounded-full 
            flex items-center justify-center
            ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}
          `}>
            <span className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {getInitials(userName || '')}
            </span>
          </div>

          {!isMobile && (
            <span className="text-sm font-medium text-gray-900 max-w-36 truncate block">
              {getDisplayName(userName!)}
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
            <MenuItemButton icon={LogOut} text="Cerrar Sesión" onClick={logout} />
          </div>
        )}
      </div>
    )
  }
)

// Esto nos ayuda debuggear
MenuProfile.displayName = "MenuProfile"

export default MenuProfile
