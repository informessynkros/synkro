// Hook de inventario

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWarehouse, getWarehouses } from '../api/api'
import type { SchemaAlmacen } from '../schemas/warehouse-schema'
import { useToast } from '../context/ToastContext'
import useNavigation from './useNavigation'


const useWarehouses = (id_be: string) => {

  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { goView } = useNavigation()

  // Query de almacén
  const warehousesQuery = useQuery<SchemaAlmacen, Error>({
    queryFn: () => getWarehouses(id_be),
    queryKey: ['warehouses', id_be],
    enabled: !!id_be,
    retry: 1,
    refetchInterval: 2000
  })

  // Crear almacén
  const createWarehouseMutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: data => {
      goView('/warehouses')
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      showToast({
        type: 'success',
        title: 'Éxito',
        message: data.message
      })
    },
    onError: error => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.message
      })
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
    isErrorCreateWh: createWarehouseMutation.isError,
    errorCreateWh: createWarehouseMutation.error,
  }
}

export default useWarehouses
