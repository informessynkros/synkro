// Lógica de distribuidores

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createDistributor, getDistributors } from "../api/apiDistributor"
import { useToast } from "../context/ToastContext"



const useDistributors = () => {

  const queryClient = useQueryClient()
  // Context
  const { showToast } = useToast()

  // Query de distribuidores
  const distributorsQuery = useQuery({
    queryFn: getDistributors,
    queryKey: ['distributors'],
    retry: 1
  })

  // Mutación de creación de distribuidor
  const createDistributorMutation = useMutation({
    mutationFn: createDistributor,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      showToast({ type: 'success', title: 'Éxito', message: data.message })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({
        type: 'error', title: 'Error', message: mess.message
      })
    }
  })

  return {
    // Obtención de distribuidores
    distributors: distributorsQuery.data || [],
    isLoadingDistributors: distributorsQuery.isLoading,
    isErrorDistributors: distributorsQuery.isError,
    errorDistributors: distributorsQuery.error,

    // Creación de distribuidor
    createDistributor: createDistributorMutation.mutate,
    isPendingCreateDis: createDistributorMutation.isPending,
    isSuccessCreateDis: createDistributorMutation.isSuccess,
    isErrorCreateDis: createDistributorMutation.isError,
    errorCreateDis: createDistributorMutation.error,
  }
}

export default useDistributors
