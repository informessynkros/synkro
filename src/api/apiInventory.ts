// Endpoint de inventarios

import { handleApiError } from "../helpers/errorHandler"
import type { InventoryDataProps, InventoryUploadData, InventoryUploadRequest } from "../schemas/inventory-schema"
import api from "../utils/axios"

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


// - Validación de inventario
export const validateInventory = async (dataInv: InventoryUploadData, id_be: string) => {
  try {
    const formData = new FormData()
    formData.append('nombre', dataInv.nombre)
    formData.append('tipo_inventario', dataInv.tipo_inventario)
    formData.append('region', dataInv.region)
    formData.append('id_almacen', dataInv.id_almacen)

    if (dataInv.archivo) {
      formData.append('archivo', dataInv.archivo)
    }

    const { data } = await api.post(`/validate-document-inventory?id_be=${id_be}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    handleApiError(error)
  }
}
