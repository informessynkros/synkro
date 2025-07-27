// Endpoints

import { handleApiError } from "../helpers/errorHandler"
import type { AlmacenFormData } from "../schemas/warehouse-schema"
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
export const createWarehouse = async (formData: AlmacenFormData) => {
  try {
    const { data } = await api.post('/createwarehouse', formData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
