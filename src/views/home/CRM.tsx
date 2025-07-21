// Vista de CRM - Usuarios

import { useMemo } from "react"
import useUsers from "../../hooks/useUsers"
import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "../../schemas/users-schema"
import { LabelBadge } from "../../components/ui/label/LabelBadge"
import { FileEditIcon, Users } from "lucide-react"
import Table from "../../components/ui/table/Table"
import LoadingErrorHandler from "../../components/chargeView/LoadingErrorHandler"


const CRM = () => {

  // Hooks
  const {
    users,
    usersIsLoading,
    usersIsError,
    usersError
  } = useUsers()

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
      header: 'MFA',
      accessorKey: 'mfa_enabled',
      enableColumnFilter: false,
      cell: ({ row }) => {
        if (row.original.mfa_enabled === 1) {
          return <LabelBadge labelText='Activo' variant="default" />
        } else {
          return <LabelBadge labelText='Inactivo' variant="warning" />
        }
      }
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
        if (row.original.status === 1) {
          return <LabelBadge labelText='Activo' variant="success" />
        } else {
          return <LabelBadge labelText='Inactivo' variant="error" />
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
            onClick={() => console.log(row.original)}
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
        icon={Users}
        enabledButton={false}
      />
    </>
  )

  return (
    <div className="h-screen">
      <LoadingErrorHandler
        isLoading={usersIsLoading}
        isError={usersIsError}
        error={usersError}
        loadingMessage="Cargando usuarios..."
      >
        {contentUsers}
      </LoadingErrorHandler>
    </div>
  )
}

export default CRM
