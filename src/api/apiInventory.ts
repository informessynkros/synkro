// Endpoint de inventarios

import { handleApiError } from "../helpers/errorHandler";
import type { InventoryDataProps } from "../schemas/inventory-schema";
import api from "../utils/axios";


export const getInventory = async (dataInventory: InventoryDataProps) => {
  try {
    const { data } = await api.post('/querywarehouse/inventory', dataInventory)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
