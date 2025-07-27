// Hook de usuarios

import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../api/api"



const useUsers = () => {

  const usersQuery = useQuery({
    queryFn: getUsers,
    queryKey: ['users'],
    retry: 1,
    // refetchInterval: 1000
  })

  return {
    // Obtención de usuarios
    users: usersQuery.data || [],
    isLoadingUsers: usersQuery.isLoading,
    isErrorUsers: usersQuery.isError,
    errorUsers: usersQuery.error
  }
}

export default useUsers
