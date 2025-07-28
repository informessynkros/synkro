// Vista almacenes

import { PackagePlus, Truck } from "lucide-react"
import Table from "../components/ui/table/Table"
import inventory from '../assets/inventoryData.json'
import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Almacen } from "../schemas/warehouse-schema"
import useWarehouses from "../hooks/useWarehouses"
import LoadingErrorHandler from "../components/chargeView/LoadingErrorHandler"
import useNavigation from "../hooks/useNavigation"


const Warehouse = () => {

  // BEID manual
  const BEID = 'BE001'

  // Hook
  const {
    warehouses,
    isLoadingWare,
    isErrorWare,
    errorWare
  } = useWarehouses(BEID)
  const { goView } = useNavigation()

  // Números consecutivos
  const numberedInventory = useMemo(() => {
    return warehouses.map((inv, index) => ({
      ...inv,
      consecutiveNumber: index + 1,
    }))
  }, [inventory])

  // Definicion de usuarios para pintarlos dentro de la tabla
  const columns: ColumnDef<Almacen>[] = [
    {
      header: 'ID',
      accessorKey: "consecutiveNumber",
      enableColumnFilter: false,
    },
    {
      header: 'Nombre',
      accessorKey: 'info.nombre',
      enableColumnFilter: true,
    },
    {
      header: 'Dirección',
      accessorKey: 'info.direccion.calle',
      enableColumnFilter: false,
    },
    {
      header: 'Operador Logístico',
      accessorKey: 'info.operador_logistico',
      enableColumnFilter: true
    },
    {
      header: 'Tipo almacen',
      accessorKey: 'info.tipo_inventario',
      enableColumnFilter: true,
    },
  ]

  const contentWarehouses = (
    <>
      <Table
        data={numberedInventory}
        columns={columns}
        title="Almacén"
        icon={Truck}
        paragraph="Aquí podrás ver todos los registros existentes en el inventario"
        enabledButton
        buttonText="Agregar almacén"
        iconButton={PackagePlus}
        onButtonClick={() => goView('/create-inventory')}
      />
    </>
  )

  return (
    <div className="h-screen">
      <LoadingErrorHandler
        isLoading={isLoadingWare}
        isError={isErrorWare}
        error={errorWare}
        loadingMessage="Cargando almacenes..."
      >
        {contentWarehouses}
      </LoadingErrorHandler>
    </div>
  )
}

export default Warehouse