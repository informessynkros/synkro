// Hook de inventario

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getInventory, loadInventory } from '../api/apiInventory'
import type { InventoryDataProps } from '../schemas/inventory-schema'
import { useToast } from '../context/ToastContext'


const useInventories = (dataInv: InventoryDataProps) => {

  const inventoriesQuery = useQuery({
    queryFn: () => getInventory(dataInv),
    queryKey: ['inventories'],
    retry: 1,
    enabled: !!dataInv.MVNO && !!dataInv.almacen // Si no hay mvno y almacén, no se activa la query
  })

  return {
    // Obtención de inventario
    inventories: inventoriesQuery.data || [],
    isLoadingInven: inventoriesQuery.isLoading,
    isErrorInven: inventoriesQuery.isError,
    errorInven: inventoriesQuery.error,
  }
}

// Hook de carga de inventario
const useChargeInventory = () => {

  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Mutación de carga de inventario
  const loadInventoryMutation = useMutation({
    mutationFn: loadInventory,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] })
      showToast({ type: 'success', title: 'Éxito', message: data.message })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.message })
    }
  })

  return {
    // Carga de inventario
    loadInventory: loadInventoryMutation.mutate,
    isPendingloadInv: loadInventoryMutation.isPending,
    isSuccessloadInv: loadInventoryMutation.isSuccess,
    isErrorloadInv: loadInventoryMutation.isError,
    errorloadInv: loadInventoryMutation.error,
  }
}

export {
  useInventories,
  useChargeInventory
}
