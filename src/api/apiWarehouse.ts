// Endpoints de almacenes

import { handleApiError } from "../helpers/errorHandler"
import type { CreateWarehouseRequest } from "../schemas/warehouse-schema"
import api from "../utils/axios"


// ------------------------- Almacen -------------------------

// - Obtención de almacenes por Be
export const getWarehouses = async (id_be: string) => {
  try {
    const dataBeId = {
      id_be
    }
    const { data } = await api.post('/querywarehouse', dataBeId)
    return data
  } catch (error) {
    handleApiError(error)
  }
}

// - Creación de almacén
export const createWarehouse = async (formData: CreateWarehouseRequest) => {
  try {
    const { data } = await api.post('/createwarehouse', formData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}