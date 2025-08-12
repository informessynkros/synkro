// Archivo que contiene las endpoints de Autenticación, MFA

import { handleApiError } from "../helpers/errorHandler"
import type { ActivateAccountApiProps, AuthDataProps } from "../schemas/auth-schema"
import api from "../utils/axios"


// ------------------------- Autenticación -------------------------
// - Login
export const authenticationUser = async (authData: AuthDataProps) => {
  try {
    const data = await api.post('/login', authData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// = Activación de cuenta
export const activateAccount = async (accountData: ActivateAccountApiProps) => {
  try {
    const { data } = await api.post('/activate-account', accountData)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// - Setup MFA
export const setupMFA = async (token: string) => {
  try {
    const { data } = await api.post('/setup-mfa', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// - Verificar MFA
export const verifyMFA = async ({ token, code }: { token: string, code: string }) => {
  try {
    const { data } = await api.post('/verify-mfa', { codigo: code }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// - Verificar inicio de sesión con MFA
export const verifyLoginMFA = async ({ mfa_token, code }: { mfa_token: string, code: string }) => {
  try {
    const { data } = await api.post('/verify-login-mfa', { codigo: code, mfa_token: mfa_token }, {
      headers: {
        Authorization: `Bearer ${mfa_token}`
      }
    })
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// ------------------------- MFA -------------------------
