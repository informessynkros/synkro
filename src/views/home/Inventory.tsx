// Vista de inventario

import { BoxSelect } from "lucide-react"
// import CardInventory from "../../components/ui/card/CardInventory"
// import useMediaQueries from "../../hooks/useMediaQueries"
import Table from "../../components/ui/table/Table"
import inventory from '../../assets/inventoryData.json'
import { useEffect, useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { LabelBadge } from "../../components/ui/label/LabelBadge"
import type { InventoryType } from "../../schemas/inventory-schema"
import useInventories from "../../hooks/useInventories"


const Inventory = () => {

  // Hook
  // const { isDesktop, isTablet, isMobile } = useMediaQueries()
  const {
    inventories,
    isLoadingInven,
    isErrorInven,
    errorInven
  } = useInventories('BE001')

  useEffect

  console.log('isLoadingInven', isLoadingInven)
  console.log('isErrorInven', isErrorInven)
  console.log('errorInven', errorInven)
  console.log('inventories', inventories)

  // Números consecutivos
  const numberedInventory = useMemo(() => {
    return inventory.inventories.map((inv, index) => ({
      ...inv,
      consecutiveNumber: index + 1,
    }))
  }, [inventory])

  // Definicion de usuarios para pintarlos dentro de la tabla
  const columns: ColumnDef<InventoryType>[] = [
    {
      header: 'ID',
      accessorKey: "consecutiveNumber",
      enableColumnFilter: false,
    },
    {
      header: 'ICCID',
      accessorKey: 'iccid',
      enableColumnFilter: false,
    },
    {
      header: 'IMSI',
      accessorKey: 'imsi',
      enableColumnFilter: false,
    },
    {
      header: 'MSISDN',
      accessorKey: 'msisdn',
      enableColumnFilter: false
    },
    {
      header: 'Fabricante',
      accessorKey: 'fabricante',
      enableColumnFilter: false,
    },
    {
      header: 'Fecha de carga',
      accessorKey: 'fechaCarga',
      enableColumnFilter: false,
    },
    {
      header: 'Almacén',
      accessorKey: 'almacen',
      enableColumnFilter: false,
    },
    {
      header: 'Tipo de almacén',
      accessorKey: 'tipoAlmacen',
      enableColumnFilter: false,
    },
    {
      header: 'Estado de línea',
      accessorKey: 'estadoLinea',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const estado = row.original.estadoLinea

        switch (estado) {
          case 'Idle':
            return <LabelBadge labelText='Idle' variant="info" />
          case 'Suspendida':
            return <LabelBadge labelText='Suspendida' variant="error" />
          case 'Activa':
            return <LabelBadge labelText='Activa' variant="success" />
          default:
            return <LabelBadge labelText={estado} variant="info" />
        }
      }
    },
  ]

  return (
    <div>
      {/* <div className={`grid ${isDesktop ? 'grid-cols-3' : isTablet ? 'grid-cols-2' : isMobile ? 'grid-cols-1' : ''} gap-5`}>
        <CardInventory
          icon={Calendar}
          title="Crear almacén"
          paragraph="Para poder cargar tu inventario inicial debes de crear tu primer almacén, da click aqui y configuralo"
          background="#202123"
          href="/create-inventory"
        />

        <CardInventory
          icon={Calendar}
          title="Cargar inventario"
          paragraph='Una vez creado tu almacén, carga tu primer inventario con el "input file" que te da tu proveedor de sims'
          background="#666"
          href="/charge-inventory"
        />
      </div> */}

      <Table
        data={numberedInventory}
        columns={columns}
        title="Almacén"
        icon={BoxSelect}
        paragraph="Aquí podrás ver todos los registros existentes en el inventario"
      />
    </div>
  )
}

export default Inventory
