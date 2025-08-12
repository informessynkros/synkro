// Vista Usuarios

import { useMemo } from "react"
import { useUsers } from "../hooks/useUsers"
import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "../schemas/users-schema"
import { LabelBadge } from "../components/ui/label/LabelBadge"
import { FileEditIcon, User2, UsersIcon } from "lucide-react"
import Table from "../components/ui/table/Table"
import LoadingErrorHandler from "../components/chargeView/LoadingErrorHandler"
import { useDrawerManager } from "../hooks/useDrawerManager"
import { Drawer } from "vaul"
import FormUser from "../components/users/FormUser"


const Users = () => {

  // Hooks
  const {
    users,
    isLoadingUsers,
    isErrorUsers,
    errorUsers
  } = useUsers()
  const {
    isDrawerOpen,
    selectedItem,
    handleOpenDrawer,
    handleClick,
    handleCloseDrawer,
    setIsDrawerOpen
  } = useDrawerManager<User>()

  // Ocultar el id de los usuarios
  const numberedUsers = useMemo(() => {
    return users.map((usr: User, index: number) => ({
      ...usr,
      consecutiveNumber: index + 1,
    }))
  }, [users])

  const columns: ColumnDef<User>[] = [
    {
      header: 'ID',
      accessorKey: "consecutiveNumber",
      enableColumnFilter: false,
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
      enableColumnFilter: false,
    },
    {
      header: 'Email',
      accessorKey: 'checkpoint',
      enableColumnFilter: false,
    },
    {
      header: 'Be ID',
      accessorKey: 'be_id',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <LabelBadge labelText={row.original.be_id} variant="info" />
      }
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      enableColumnFilter: false,
      enableSorting: true,
      cell: ({ row }) => {
        if (row.original.status === 0) {
          return <LabelBadge labelText='Inactivo' variant="error" />
        } else if (row.original.status === 1) {
          return <LabelBadge labelText='Pendiente' variant="warning" />
        } else if (row.original.status === 2) {
          return <LabelBadge labelText='Activo' variant="success" />
        }
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

  const contentUsers = (
    <>
      <Table
        data={numberedUsers}
        columns={columns}
        title="Usuarios"
        paragraph="Aquí podrás administrar todos los usuarios existentes"
        icon={UsersIcon}
        enabledButton
        onButtonClick={handleOpenDrawer}
        iconButton={User2}
        buttonText="Crear usuario"
      />
    </>
  )

  return (
    <div className="h-screen">
      <LoadingErrorHandler
        isLoading={isLoadingUsers}
        isError={isErrorUsers}
        error={errorUsers}
        loadingMessage="Cargando usuarios..."
      >
        {contentUsers}
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
                <FormUser
                  user={selectedItem!!}
                  closeDrawer={handleCloseDrawer}
                />
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

export default Users
