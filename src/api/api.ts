// Endpoints

import { handleApiError } from "../helpers/errorHandler"
import api from "../utils/axios"

// ------------------------- Usuarios -------------------------

// - Obtencion de usuarios
export const getUsers = async () => {
  try {
    const { data } = await api.get('/get-users')
    return data.users
  } catch (error) {
    handleApiError(error)
  }
}


// ------------------------- Inventario -------------------------

// - Obtención de almacenes por Be
export const getInventories = async (id_be: string) => {
  try {
    const { data } = await api.post('/querywarehouse', { id_be: id_be })
    return data.inventories
  } catch (error) {
    handleApiError(error)
  }
}
