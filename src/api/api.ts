// Endpoints

import { handleApiError } from "../helpers/errorHandler"
import api from "../utils/axios"

// ------------------------- Inventario -------------------------

// Obtención de almacenes por Be
export const getInventories = async (id_be: string) => {
  try {
    const { data } = await api.post('/querywarehouse', id_be)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
