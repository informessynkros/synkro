// Vista de inventario

import { Boxes } from "lucide-react"
import Table from "../../components/ui/table/Table"
import inventory from '../../assets/inventoryData.json'
import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { LabelBadge } from "../../components/ui/label/LabelBadge"
import type { InventoryType } from "../../schemas/inventory-schema"


const Inventory = () => {

  // Números consecutivos
  const numberedInventory = useMemo(() => {
    return inventory.inventories.map((inv, index) => ({
      ...inv,
      consecutiveNumber: index + 1,
    }))
  }, [inventory])

  // Definicion de inventario para pintarlos dentro de la tabla
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
      <Table
        data={numberedInventory}
        columns={columns}
        title="Almacén"
        icon={Boxes}
        paragraph="Aquí podrás ver todos los registros existentes de inventarios"
        onButtonOptions // Esto activa las acciones de inventario
      />
    </div>
  )
}

export default Inventory
