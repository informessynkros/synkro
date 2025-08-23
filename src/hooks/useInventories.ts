// Hook de inventario

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getInventory, loadInventory, validateInventory } from '../api/apiInventory'
import type { InventoryDataProps, InventoryUploadData } from '../schemas/inventory-schema'
import { useToast } from '../context/ToastContext'
import useNavigation from './useNavigation'


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
  const { goView } = useNavigation()

  // Validación de archivo
  const validateInventoryMutation = useMutation({
    mutationFn: ({ dataInv, id_be }: { dataInv: InventoryUploadData, id_be: string }) =>
      validateInventory(dataInv, id_be),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] })
      // Cambiar para manejar la respuesta de validación
      if (data.valid) {
        showToast({ type: 'success', title: 'Validación exitosa', message: 'Archivo válido para procesar' })
      } else {
        showToast({ type: 'warning', title: 'Archivo con errores', message: `Se encontraron ${data.summary?.total_errors || 0} errores` })
      }
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.message })
    }
  })

  // Mutación de carga de inventario
  const loadInventoryMutation = useMutation({
    mutationFn: loadInventory,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] })
      showToast({ type: 'success', title: 'Éxito', message: data.message })
      goView('/warehouses')
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

    // Carga de inventario
    validateInv: validateInventoryMutation.mutate,
    isPendingValidateInv: validateInventoryMutation.isPending,
    isSuccessValidateInv: validateInventoryMutation.isSuccess,
    isErrorValidateInv: validateInventoryMutation.isError,
    errorValidateInv: validateInventoryMutation.error,
    validationData: validateInventoryMutation.data
  }
}

export {
  useInventories,
  useChargeInventory
}
