// Vista de distribuidores

import { useMemo } from "react"
import useDistributors from "../../hooks/useDistributors"
import type { Distributor } from "../../schemas/disributor-schema"
import type { ColumnDef } from "@tanstack/react-table"
import { LabelBadge } from "../../components/ui/label/LabelBadge"
import { FileEditIcon, PlusCircle, Truck } from "lucide-react"
import { useDrawerManager } from "../../hooks/useDrawerManager"
import Table from "../../components/ui/table/Table"
import LoadingErrorHandler from "../../components/chargeView/LoadingErrorHandler"
import { Drawer } from "vaul"
import FormDistributors from "../../components/distributors/FormDistributors"


const Distributors = () => {

  // Hook
  const {
    distributors,
    isLoadingDistributors,
    isErrorDistributors,
    errorDistributors
  } = useDistributors()
  const {
    isDrawerOpen,
    selectedItem,
    handleOpenDrawer,
    handleClick,
    handleCloseDrawer,
    setIsDrawerOpen
  } = useDrawerManager<Distributor>()

  // Ocultar el id de los distribuidores
  const numberedDistributors = useMemo(() => {
    return distributors.map((dist: Distributor, index: number) => ({
      ...dist,
      consecutiveNumber: index + 1,
    }))
  }, [distributors])


  const columns: ColumnDef<Distributor>[] = [
    {
      header: 'ID',
      accessorKey: "consecutiveNumber",
      enableColumnFilter: false,
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      enableColumnFilter: false,
    },
    {
      header: 'Email',
      accessorKey: 'correo',
      enableColumnFilter: false,
    },
    {
      header: 'Responsable',
      accessorKey: 'responsable',
      enableColumnFilter: false,
    },
    {
      header: 'BE',
      accessorKey: 'id_be',
      enableColumnFilter: true,
      cell: ({ row }) => {
        return <LabelBadge labelText={row.original.id_be} variant="info" />
      }
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-sky-100 text-sky-700 rounded-md p-1.5 hover:bg-sky-200 hover:shadow duration-300 cursor-pointer"
            onClick={() => handleClick(row.original)}
            title="Editar"
          >
            <FileEditIcon size={22} />
          </button>
        </div>
      )
    },
  ]

  const contentDistributors = (
    <>
      <Table
        data={numberedDistributors}
        columns={columns}
        title="Distribuidores"
        paragraph="Aquí podrás administrar todos los Distribuidores existentes"
        icon={Truck}
        enabledButton
        onButtonClick={handleOpenDrawer}
        iconButton={PlusCircle}
        buttonText="Agregar distribuidor"
      />
    </>
  )

  return (
    <div>
      <LoadingErrorHandler
        isLoading={isLoadingDistributors}
        isError={isErrorDistributors}
        error={errorDistributors}
        loadingMessage="Cargando distribuidores..."
      >
        {contentDistributors}
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
                  <FormDistributors
                    distributor={selectedItem!!}
                    closeDrawer={handleCloseDrawer}
                  />
                )}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

export default Distributors
