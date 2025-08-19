// Hook de inventario

import { useQuery } from '@tanstack/react-query'
import { getInventory } from '../api/apiInventory'
import type { InventoryDataProps } from '../schemas/inventory-schema'


const useInventories = (dataInv: InventoryDataProps) => {

  const inventoriesQuery = useQuery({
    queryFn: () => getInventory(dataInv),
    queryKey: ['inventories'],
    retry: 1,
    enabled: !!dataInv.MVNO && !!dataInv.almacen // Si no hay mvno y almacén, no se activa la query
  })

  return {
    inventories: inventoriesQuery.data || [],
    isLoadingInven: inventoriesQuery.isLoading,
    isErrorInven: inventoriesQuery.isError,
    errorInven: inventoriesQuery.error
  }
}

export default useInventories
