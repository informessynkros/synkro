// Manejo de errores

import { AxiosError } from 'axios'

export const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage))
  }
  throw new Error('Error desconocido al realizar la operación')
}