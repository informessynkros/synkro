import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state: any) => state.authUser)

  // Si el usuario está autenticado, redirigir al dashboard
  if (isAuthenticated) return <Navigate to='/dashboard' replace />

  // Si no está autenticado, mostrar el contenido de la ruta pública
  return <Outlet />
}

export default PublicRoute
