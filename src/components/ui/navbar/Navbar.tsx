// Componente Navbar

import gsap from "gsap"
import { Menu, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
// import InputSearch from "../input/InputSearch"
import MenuProfile from "../menu/MenuProfile"
import ButtonNotification from "../button/notifications/ButtonNotification"
import useMediaQueries from "../../../hooks/useMediaQueries"
import AlgoliaSearch from "../search/AlgoliaSearch"


interface NavbarProps {
  onToggleSidebar: () => void
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {

  // Estados
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Refs
  const toggleRef = useRef<HTMLButtonElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchMobileRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  // Hook
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  // Efecto que me ayuda a cerrar algún dropdown al cual abrí
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Perfil de usuario
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }

      // Notificaciones
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }

      // Search mobile
      if (searchMobileRef.current &&
        !searchMobileRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)) {
        if (searchOpen) {
          const searchElement = searchMobileRef.current
          gsap.to(searchElement, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              setSearchOpen(false)
            }
          })
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileOpen, notificationsOpen, searchOpen])

  // Animacion del boton toggle
  const handleToggleClick = () => {
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      })
    }
    onToggleSidebar()
  }

  // Animación del botón de búsqueda
  const handleSearchToggle = () => {
    if (searchOpen) {
      const searchElement = searchMobileRef.current
      if (searchElement) {
        gsap.to(searchElement, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            setSearchOpen(false)
          }
        })
      } else {
        setSearchOpen(false)
      }
    } else {
      // Si está cerrado, abrir
      setSearchOpen(true)
    }
  }

  // Animacion de entrada del navbar
  useEffect(() => {
    gsap.fromTo('.navbar-content',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
  }, [])

  if (isDesktop) {
    return (
      <nav className="bg-white border-b border-gray-200 px-6 py-4 navbar-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              ref={toggleRef}
              onClick={handleToggleClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-700">
                Bienvenido Pablo
              </h1>
              <p className="text-sm text-gray-500">
                Estas son las métricas de tu MVNO
              </p>
            </div>
          </div>

          {/* <div className="flex-1 max-w-md mx-8"> */}
          {/* <div className="flex-1 max-w-max mx-8">
            <AlgoliaSearch
              onClose={() => setSearchOpen(false)}
            />
          </div> */}

          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-max mx-8">
              <AlgoliaSearch
                onClose={() => setSearchOpen(false)}
              />
              {/* <InputSearch /> */}
            </div>

            <div className="relative" ref={notificationsRef}>
              <ButtonNotification
                notificationsOpen={notificationsOpen}
                setNotificationsOpen={() => setNotificationsOpen(!notificationsOpen)}
              />
            </div>
            <MenuProfile
              ref={profileRef}
              profileOpen={profileOpen}
              setProfileOpen={() => setProfileOpen(!profileOpen)}
            />
          </div>
        </div>
      </nav>
    )
  }

  if (isMobile) {
    return (
      <>
        <nav className="bg-white border-b border-gray-200 px-4 py-3 navbar-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                ref={toggleRef}
                onClick={handleToggleClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                ref={searchButtonRef}
                onClick={handleSearchToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              <div className="relative" ref={notificationsRef}>
                <ButtonNotification
                  notificationsOpen={notificationsOpen}
                  setNotificationsOpen={() => setNotificationsOpen(!notificationsOpen)}
                />
              </div>

              <MenuProfile
                ref={profileRef}
                profileOpen={profileOpen}
                setProfileOpen={() => setProfileOpen(!profileOpen)}
              />
            </div>
          </div>
        </nav>

        {searchOpen && (
          <div
            ref={searchMobileRef}
            className="bg-white border-b border-gray-200 px-4 py-3 animate-fadeIn"
          >
            {/* <InputSearch /> */}
            <AlgoliaSearch
              onClose={() => setSearchOpen(false)}
            />
          </div>
        )}
      </>
    )
  }

  if (isTablet) {
    return (
      <nav className="bg-white border-b border-gray-200 px-5 py-4 navbar-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              ref={toggleRef}
              onClick={handleToggleClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-700">
                Bienvenido Pablo
              </h1>
              <p className="text-sm text-gray-500">
                Métricas de tu MVNO
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="max-w-max">
              {/* <InputSearch /> */}
              <AlgoliaSearch
                onClose={() => setSearchOpen(false)}
              />
            </div>

            <div className="relative" ref={notificationsRef}>
              <ButtonNotification
                notificationsOpen={notificationsOpen}
                setNotificationsOpen={() => setNotificationsOpen(!notificationsOpen)}
              />
            </div>

            <MenuProfile
              ref={profileRef}
              profileOpen={profileOpen}
              setProfileOpen={() => setProfileOpen(!profileOpen)}
            />
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
