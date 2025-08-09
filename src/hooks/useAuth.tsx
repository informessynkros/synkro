// Lógica de autenticación

import { useMutation } from "@tanstack/react-query"
import { activateAccount, authenticationUser, setupMFA, verifyLoginMFA, verifyMFA } from "../api/apiAuth"
import { useDispatch } from "react-redux"
import { useToast } from "../context/ToastContext"
import { clearMfaToken, getCheckpoint, setCredentials, setMfaToken } from "../helpers/redux/AuthSlice"
import useNavigation from "./useNavigation"



const useAuth = () => {

  const dispath = useDispatch()
  const { showToast } = useToast()
  const { goView } = useNavigation()

  // Mutación de activación de cuenta
  const activateAccountMutation = useMutation({
    mutationFn: activateAccount,
    onSuccess: data => {
      showToast({ type: 'success', title: 'Éxito', message: data.message })
      goView('/auth/login')
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error })
    }
  })

  // Setup MFA
  const setupMFAMutation = useMutation({
    mutationFn: setupMFA,
    onSuccess: data => {
      showToast({ type: 'success', title: 'Éxito', message: data.message })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error })
    }
  })

  // Verificar MFA
  const verifyMFAMutation = useMutation({
    mutationFn: verifyMFA,
    onSuccess: data => {
      showToast({ type: 'success', title: 'Éxito', message: data.message })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error })
    }
  })

  // Verificar Login MFA
  const verifyLoginMFAMutation = useMutation({
    mutationFn: verifyLoginMFA,
    onSuccess: data => {
      showToast({ type: 'success', title: 'Éxito', message: data.message })
      if (data.login_complete) {
        const dataLogin = {
          user: data.user,
          token: data.token
        }
        dispath(setCredentials(dataLogin))
        dispath(clearMfaToken())
        goView('/dashboard')
      }
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error })
    }
  })

  // Mutación de inicio de sesión
  const loginMutation = useMutation({
    mutationFn: authenticationUser,
    onSuccess: data => {
      if (data?.status === 201) { // Necesita activar cuenta
        dispath(getCheckpoint({ checkpoint: data?.data.checkpoint }))
        goView('/auth/active-account')
      } else if (data?.status === 202) { // Debe configurar MFA obligatoriamente
        const dataLogin = {
          user: data?.data.user,
          token: data?.data.token
        }
        dispath(setCredentials(dataLogin))
      } else if (data?.data.mfa_required) { // Si el usuario tiene habilitado el MFA, pedir código
        dispath(setMfaToken({ mfa_token: data?.data.mfa_token }))
      } else { // Login normal sin MFA
        const dataLogin = {
          user: data?.data.user,
          token: data?.data.token
        }
        dispath(setCredentials(dataLogin))
        goView('/dashboard')
      }
      showToast({ type: 'success', title: 'Éxito', message: data?.data.message })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.error, others: `Número de intentos: ${mess.intentos_restantes}` })
    },
  })

  return {

    // Activación de cuenta
    acAccount: activateAccountMutation.mutate,
    isPendingAccount: activateAccountMutation.isPending,
    isErrorAccount: activateAccountMutation.isError,
    errorAccount: activateAccountMutation.error,

    // Setup MFA
    setupMFA: setupMFAMutation.mutate,
    isPendingSetupMFA: setupMFAMutation.isPending,
    isErrorSetupMFA: setupMFAMutation.isError,
    errorSetupMFA: setupMFAMutation.error,
    setupMFAData: setupMFAMutation.data,

    // Verificar MFA
    verifyMFA: verifyMFAMutation.mutate,
    isPendingVerifyMFA: verifyMFAMutation.isPending,
    isErrorVerifyMFA: verifyMFAMutation.isError,
    errorVerifyMFA: verifyMFAMutation.error,
    verifyMFAMutation,

    // Verificar Login MFA
    verifyLoginMFA: verifyLoginMFAMutation.mutate,
    isPendingVerifyLoginMFA: verifyLoginMFAMutation.isPending,
    isErrorVerifyLoginMFA: verifyLoginMFAMutation.isError,
    errorVerifyLoginMFA: verifyLoginMFAMutation.error,
    verifyLoginMFAMutation,

    // Inicio sesión
    login: loginMutation.mutate,
    isPendingLogin: loginMutation.isPending,
    isErrorLogin: loginMutation.isError,
    errorLogin: loginMutation.error,
    loginMutation, // Con la finalidad de obtener el estado del response
  }
}

export default useAuth
