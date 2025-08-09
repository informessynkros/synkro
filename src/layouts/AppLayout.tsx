// Vista principal (Landing page)

import { Outlet } from "react-router-dom"


const AppLayout = () => {
  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
