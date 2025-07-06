// Layout dashboard

import { Outlet } from "react-router-dom"
import Navbar from "../components/ui/navbar/Navbar"
import Sidebar from "../components/ui/sidebar/Sidebar"
import { useEffect, useState } from "react"
import useMediaQueries from "../hooks/useMediaQueries"


const DashboardLayout = () => {

  // Estados
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Hook
  const { isMobile, isTablet } = useMediaQueries()

  // Auto cerramos el sidebar cuando llegue a tablet
  useEffect(() => {
    if (isTablet) {
      setIsSidebarCollapsed(true)
    } else if (!isTablet && !isMobile) {
      setIsSidebarCollapsed(false)
    }
  }, [isMobile, isTablet])

  // Cierre del sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Función que cierra el sidebar (En modos responsivos)
  const closeSidebar = () => {
    setIsSidebarCollapsed(true)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Backdrop blur para móvil */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 transition-all duration-300 ease-in-out"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
          onClick={closeSidebar}
          aria-label="Cerrar sidebar"
        />
      )}
      {/* Sidebar */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'}
        `}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Contenido principal */}
      <div className={`
        flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${isMobile ? 'flex-1 w-full' : isSidebarCollapsed ? 'flex-1' : 'flex-1'}
      `}>
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="mx-auto p-6 h-full bg-gray-50">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
