// Rutas

import { Boxes, House, LayoutDashboard, Megaphone, type LucideIcon, Computer, WarehouseIcon } from "lucide-react"
import type { ComponentType } from "react"
import Dashboard from "../../views/home/Dashboard"
import Campaigns from "../../views/home/Campaigns"
import CRM from "../../views/home/CRM"
import CreateInventory from "../../components/inventory/CreateInventory"
import ChargeInventory from "../../components/inventory/ChargeInventory"
import Inventory from "../../views/home/Inventory"
import Warehouse from "../../views/Warehouse"

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
    path: '/',
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
  { // Crear almacén
    key: 'create-inventory',
    path: '/create-inventory',
    name: 'Crear almacén',
    icon: LayoutDashboard,
    component: CreateInventory,
    showInSidebar: false,
  },
  { // Cargar de inventario
    key: 'charge-inventory',
    path: '/charge-inventory',
    name: 'Cargar almacén',
    icon: LayoutDashboard,
    component: ChargeInventory,
    showInSidebar: false,
  },
]
