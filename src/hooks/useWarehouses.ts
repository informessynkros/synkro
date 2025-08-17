// Hook de inventario

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWarehouse, getWarehouses } from '../api/apiWarehouse'
import { useToast } from '../context/ToastContext'


const useWarehouses = (id_be: string) => {

  const { showToast } = useToast()
  const queryClient = useQueryClient()

  // Query de almacén
  const warehousesQuery = useQuery({
    queryFn: () => getWarehouses(id_be),
    queryKey: ['warehouses', id_be],
    enabled: !!id_be,
    retry: 1
    // refetchInterval: 1000
  })

  // Crear almacén
  const createWarehouseMutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      showToast({ type: 'success', title: 'Éxito', message: data.message })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess?.error })
    }
  })

  return {
    // Query de almacenes
    warehouses: warehousesQuery.data?.almacenes || [],
    isLoadingWare: warehousesQuery.isLoading,
    isErrorWare: warehousesQuery.isError,
    errorWare: warehousesQuery.error,

    // Creación de almacenes
    createWarehouse: createWarehouseMutation.mutate,
    isPendingCreateWh: createWarehouseMutation.isPending,
    isSuccessCreateWh: createWarehouseMutation.isSuccess,
    isErrorCreateWh: createWarehouseMutation.isError,
    errorCreateWh: createWarehouseMutation.error,
  }
}

export default useWarehouses
