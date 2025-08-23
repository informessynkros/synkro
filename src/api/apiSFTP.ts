// Endpoint de SFTP

import { handleApiError } from "../helpers/errorHandler"
import type { SFTPData } from "../schemas/sftp-schema"
import api from "../utils/axios"


// ------------------------- SFTP -------------------------

// - Creación de conexión SFTP
export const createConnectionSFTP = async (formData: SFTPData, mvno: string) => {
  try {
    const { data } = await api.post(`/mvnodashboardconnection?mvno=${mvno}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// - Consulta de logs de conexión
export const getMvnoConnectionHistory = async (mvno_id: string) => {
  try {
    const { data } = await api.post('/mvnodashboardconnection/getmvnoconnectionhistory', mvno_id)
    return data
  } catch (error) {
    handleApiError(error)
  }
}

