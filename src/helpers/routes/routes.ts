// Rutas

import { Boxes, House, LayoutDashboard, Megaphone, type LucideIcon, Computer, WarehouseIcon, Users2, UsersRoundIcon, ShieldEllipsis } from "lucide-react"
import type { ComponentType } from "react"
import Dashboard from "../../views/home/Dashboard"
import Campaigns from "../../views/home/Campaigns"
import CRM from "../../views/home/CRM"
import ChargeInventory from "../../components/inventory/ChargeInventory"
import Inventory from "../../views/home/Inventory"
import Warehouse from "../../views/Warehouse"
import Users from "../../views/users/Users"
import Permissions from "../../views/users/Permissions"

// Clase de rutas
export interface RouteConfig {
  key: string
  path?: string
  name: string
  icon: LucideIcon
  component?: ComponentType
  showInSidebar: boolean
  subItems?: RouteConfig[]
}


export const routesDashboard: RouteConfig[] = [
  { // Dashboard
    key: 'dashboard',
    path: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    component: Dashboard,
    showInSidebar: true,
  },
  {
    key: 'home',
    name: 'Home',
    icon: House,
    showInSidebar: true,
    subItems: [
      { // Inventario
        key: 'inventory',
        path: '/inventory',
        name: 'Inventario',
        icon: Boxes,
        component: Inventory,
        showInSidebar: true,
      },
      { // Campañas
        key: 'campaigns',
        path: '/campaigns',
        name: 'Campañas',
        icon: Megaphone,
        component: Campaigns,
        showInSidebar: true,
      },
      { // CRM
        key: 'crm',
        path: '/crm',
        name: 'CRM',
        icon: Computer,
        component: CRM,
        showInSidebar: true,
      },
    ]
  },
  { // Almacenes
    key: 'warehouses',
    path: '/warehouses',
    name: 'Almacenes',
    icon: WarehouseIcon,
    component: Warehouse,
    showInSidebar: true,
  },
  { // Cargar de inventario
    key: 'charge-inventory',
    path: '/charge-inventory',
    name: 'Cargar almacén',
    icon: LayoutDashboard,
    component: ChargeInventory,
    showInSidebar: false,
  },
  {
    key: 'admin',
    name: 'Gestión de usuarios',
    icon: Users2,
    showInSidebar: true,
    subItems: [
      { // Contactos
        key: 'users',
        path: '/users',
        name: 'Usuarios',
        icon: UsersRoundIcon,
        component: Users,
        showInSidebar: true,
      },
      { // Permisos
        key: 'permissions',
        path: '/permissions',
        name: 'Permisos',
        icon: ShieldEllipsis,
        component: Permissions,
        showInSidebar: true,
      },
    ]
  },
]
