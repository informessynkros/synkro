import type { ReactNode } from "react"
import { routesDashboard, type RouteConfig } from "./helpers/routes/routes"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./views/auth/Login"
import ForgotPassword from "./views/auth/ForgotPassword"
import NotFound from "./views/error/404"

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
      <Routes>

        <Route element={<DashboardLayout />}>
          {generateRoutes(routesDashboard)}
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default Router
