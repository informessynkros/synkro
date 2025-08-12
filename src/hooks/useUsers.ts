// Hook de usuarios

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUser, getMvnos, getRoles, getUsers, updateUser } from "../api/apiUsers"
import { useToast } from "../context/ToastContext"


// - Usuarios
const useUsers = () => {

  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Query de usuarios
  const usersQuery = useQuery({
    queryFn: getUsers,
    queryKey: ['users'],
    retry: 1,
    // refetchInterval: 1000
  })

  // Creación de usuarios
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: data => {
      showToast({ type: 'success', title: 'Éxito', message: data.message })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error })
    }
  })

  // Actualizción de usuarios
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: data => {
      showToast({ type: 'success', title: 'Éxito', message: data.message })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error })
    }
  })

  return {
    // Obtención de usuarios
    users: usersQuery.data || [],
    isLoadingUsers: usersQuery.isLoading,
    isErrorUsers: usersQuery.isError,
    errorUsers: usersQuery.error,

    // Creación de usuarios
    createUser: createUserMutation.mutate,
    isPendingCreate: createUserMutation.isPending,
    isSuccessCreate: createUserMutation.isSuccess,
    isErrorCreate: createUserMutation.isError,
    errorCreate: createUserMutation.error,

    // Actualización de usuarios
    updateUser: updateUserMutation.mutate,
    isPendingUpdate: updateUserMutation.isPending,
    isSuccessUpdate: updateUserMutation.isSuccess,
    isErrorUpdate: updateUserMutation.isError,
    errorUpdate: updateUserMutation.error,
  }
}


// - Roles
const useRoles = () => {

  const rolesQuery = useQuery({
    queryFn: getRoles,
    queryKey: ['roles'],
    retry: 1
  })

  return {
    // Obtención de roles
    roles: rolesQuery.data || [],
    isLoadingRoles: rolesQuery.isLoading,
    isErrorRoles: rolesQuery.isError,
    errorRoles: rolesQuery.error,
  }
}


// - Mvnos
const useMvnos = () => {

  const mvnosQuery = useQuery({
    queryFn: getMvnos,
    queryKey: ['mvnos'],
    retry: 1
  })

  return {
    // Obtención de mvnos
    mvnos: mvnosQuery.data || [],
    isLoadingMvnos: mvnosQuery.isLoading,
    isErrorMvnos: mvnosQuery.isError,
    errorMvnos: mvnosQuery.error,
  }
}

export {
  useUsers,
  useRoles,
  useMvnos
}
