// Rutas

import { House, LayoutDashboard, Megaphone, type LucideIcon, Computer, WarehouseIcon, Users2, UsersRoundIcon, ShieldEllipsis, TruckElectric, RadioTower } from "lucide-react"
import type { ComponentType } from "react"
import Dashboard from "../../views/Dashboard"
import Campaigns from "../../views/home/Campaigns"
import CRM from "../../views/home/CRM"
// import Inventory from "../../views/home/Inventory"
import Warehouse from "../../views/Warehouse"
import Users from "../../views/users/Users"
import Permissions from "../../views/users/Permissions"
import Distributors from "../../views/home/Distributors"
import InventoryWizard from "../../components/inventory/InventoryWizard"
import SFTP from "../../views/sftp/SFTP"

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
    key: 'dashboard', // LLave de la ruta
    path: '/dashboard', // Ruta
    name: 'Dashboard', // Nombre del módulo
    icon: LayoutDashboard, // Icono
    component: Dashboard, // Vista / Componente
    showInSidebar: true, // Se mostrara en el sidebar?
  },
  { // Menú padre - Home
    key: 'home',
    name: 'Home',
    icon: House,
    showInSidebar: true,
    subItems: [
      // { // Inventario
      //   key: 'inventory',
      //   path: '/inventory',
      //   name: 'Inventario',
      //   icon: Boxes,
      //   component: Inventory,
      //   showInSidebar: true,
      // },
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
      { // Distribuidores
        key: 'distributors',
        path: '/distributors',
        name: 'Distribuidores',
        icon: TruckElectric,
        component: Distributors,
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
    component: InventoryWizard,
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
  { // Conexión SFTP
    key: 'sftp',
    path: '/sftp',
    name: 'SFTP',
    icon: RadioTower,
    component: SFTP,
    showInSidebar: true,
  },
]
