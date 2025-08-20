import type { ReactNode } from "react"
import { routesDashboard, type RouteConfig } from "./helpers/routes/routes"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./views/auth/Login"
import ForgotPassword from "./views/auth/ForgotPassword"
import NotFound from "./views/error/404"
import 'leaflet/dist/leaflet.css'
import { ToastProvider } from "./context/ToastContext"
import ProtectedRoute from "./helpers/auth/ProtectedRoute"
import AppLayout from "./layouts/AppLayout"
import Home from "./views/Home"
import ActivateAccount from "./views/auth/ActivateAccount"
import PublicRoute from "./helpers/auth/PublicRoute"

function Router() {

  // Función que genera las rutas
  const generateRoutes = (routes: RouteConfig[]): ReactNode => {
    return routes.map(route => {
      // si es módulo padre tiene hijos
      if (route.subItems) {
        return generateRoutes(route.subItems)
      }

      // Si es un módulo padre
      if (route.path && route.component) {
        return (
          <Route
            key={route.key}
            path={route.path}
            element={<route.component />}
          />
        )
      }

      return []
    })
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>

          <Route element={<AppLayout />}>
            <Route path='/' element={<Home />} index />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {generateRoutes(routesDashboard)}
            </Route>
          </Route>

          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path='/auth/active-account' element={<ActivateAccount />} />
            </Route>
          </Route>

          {/* Not found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default Router
