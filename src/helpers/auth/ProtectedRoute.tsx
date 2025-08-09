// Archivo de proteccion de rutas

import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'


const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: any) => state.authUser)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to='/auth/login' state={{ from: location }} replace />

  return <Outlet />
}

export default ProtectedRoute