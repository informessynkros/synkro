// Hook de inventario

import { useQuery } from '@tanstack/react-query'
import { getInventories } from '../api/api'
import type { InventoryType } from '../schemas/inventory-schema'


const useInventories = (id_be: string) => {

  const inventoriesQuery = useQuery<InventoryType, Error>({
    queryFn: () => getInventories(id_be),
    queryKey: ['inventories'],
    retry: 1,
    enabled: !!id_be
  })

  return {
    inventories: inventoriesQuery.data || [],
    isLoadingInven: inventoriesQuery.isLoading,
    isErrorInven: inventoriesQuery.isError,
    errorInven: inventoriesQuery.error
  }
}

export default useInventories
