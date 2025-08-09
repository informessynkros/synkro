// Protección de rutas

import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"


const ProtectedRoute = () => {

  // Obtenemos la autenticación del estado global
  const isAuthenticated = useSelector((state: any) => state.authUser.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) { // Si no hay autenticación, lo mantenemos en el login
    return <Navigate to='/auth/login' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
