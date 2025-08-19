// Vista almacenes

import { Edit, PackagePlus, Truck } from "lucide-react"
import Table from "../components/ui/table/Table"
import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Almacen } from "../schemas/warehouse-schema"
import useWarehouses from "../hooks/useWarehouses"
import LoadingErrorHandler from "../components/chargeView/LoadingErrorHandler"
// import useNavigation from "../hooks/useNavigation"
import { Drawer } from "vaul"
import FormWarehouse from "../components/warehouse/FormWarehouse"
import { useSelector } from "react-redux"
import InventorySection from "../components/inventory/InventorySection"


const Warehouse = () => {
  // BEID manual
  const { user } = useSelector((state: any) => state.authUser)

  // Hook
  const {
    warehouses,
    isLoadingWare,
    isErrorWare,
    errorWare
  } = useWarehouses(user.be_id)

  // console.log('Almacenes', warehouses)

  // Estados
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  // Selección del almacén
  const [selectedWarehouse, setSelectedWarehouse] = useState<Almacen | null>(null)

  // const { goView } = useNavigation()

  const handleOpenDrawer = () => {
    setSelectedWarehouse(null)
    setIsDrawerOpen(true)
  }

  const handleClickWarehouse = (warehouse: Almacen) => {
    if (warehouse) {
      setSelectedWarehouse(warehouse)
      setIsDrawerOpen(true)
      console.log(warehouse)
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedWarehouse(null)
  }

  // Números consecutivos
  const numberedWarehouse = useMemo(() => {
    return warehouses.map((warehouse: any, index: any) => ({
      ...warehouse,
      consecutiveNumber: index + 1,
    }))
  }, [warehouses])

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
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-sky-100 text-sky-700 rounded-md p-1.5 hover:bg-sky-200 hover:shadow duration-300 cursor-pointer"
            onClick={() => handleClickWarehouse(row.original)}
            title="Editar"
          >
            <Edit size={18} />
          </button>
        </div>
      )
    },
  ]

  const contentWarehouses = (
    <>
      <Table
        data={numberedWarehouse}
        columns={columns}
        title="Almacén"
        icon={Truck}
        paragraph="Aquí podrás ver todos los registros existentes en el inventario"
        enabledButton
        buttonText="Agregar almacén"
        iconButton={PackagePlus}
        // onButtonClick={() => goView('/create-inventory')}}
        onButtonClick={handleOpenDrawer}
      />
    </>
  )

  return (
    <div>
      <LoadingErrorHandler
        isLoading={isLoadingWare}
        isError={isErrorWare}
        error={errorWare}
        loadingMessage="Cargando almacenes..."
      >
        {contentWarehouses}
      </LoadingErrorHandler>

      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-gray-300/40 z-30" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />

              <div className="w-auto mx-auto">
                <Drawer.Title className="font-medium mb-4 text-lg">
                </Drawer.Title>
                {isDrawerOpen && (
                  <FormWarehouse
                    warehouse={selectedWarehouse || null}
                    closeDrawer={handleCloseDrawer}
                  />
                )}
                <InventorySection
                // mvno={user?.be_id}
                // almacen={selectedWarehouse?.id_almacen!!}
                />
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

export default Warehouse