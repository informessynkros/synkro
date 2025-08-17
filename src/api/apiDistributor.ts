// Endpoint de distribuidores

import { handleApiError } from "../helpers/errorHandler"
import type { DistributorFormData } from "../schemas/disributor-schema"
import api from "../utils/axios"


// ------------------------- Distribuidores -------------------------

// - Obtención de distribuidores
export const getDistributors = async () => {
  try {
    const { data } = await api.get('/distributor/get')
    return data.distributors
  } catch (error) {
    handleApiError(error)
  }
}


// - Creación de distribuidor
export const createDistributor = async (dataDistributor: DistributorFormData) => {
  try {
    const { data } = await api.post('/distributor/create', dataDistributor)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
