// Endpoints

import { handleApiError } from "../helpers/errorHandler"
import api from "../utils/axios"

// ------------------------- Inventario -------------------------

// Obtención de almacenes por Be
export const getInventories = async (be_id: string) => {
  try {
    const { data } = await api.post('/querywarehouse', be_id)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
