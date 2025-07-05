// Layout de autenticacion

import { Outlet } from "react-router-dom"



const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
