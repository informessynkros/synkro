// Archivo que contiene las endpoints de Autenticación, MFA

import { handleApiError } from "../helpers/errorHandler"
import type { ActivateAccountApiProps, AuthDataProps } from "../schemas/auth-schema"
import api from "../utils/axios"


// ------------------------- Autenticación -------------------------
// Login
export const authenticationUser = async (authData: AuthDataProps) => {
  try {
    const { data } = await api.post('/login', authData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// Activación de cuenta
export const activateAccount = async (accountData: ActivateAccountApiProps) => {
  try {
    const { data } = await api.post('/activate-account', accountData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// ------------------------- MFA -------------------------
