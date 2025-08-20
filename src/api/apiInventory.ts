// Endpoint de inventarios

import { handleApiError } from "../helpers/errorHandler";
import type { InventoryDataProps, InventoryUploadRequest } from "../schemas/inventory-schema";
import api from "../utils/axios";

// ------------------------- INventarios -------------------------

// - Obtención de inventario cargado
export const getInventory = async (dataInventory: InventoryDataProps) => {
  try {
    const { data } = await api.post('/querywarehouse/inventory', dataInventory)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// - Carga de inventario
export const loadInventory = async ({ id_be, formData }: InventoryUploadRequest) => {
  try {
    const { data } = await api.post(`/loadwarehouse?id_be=${id_be}`, formData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
