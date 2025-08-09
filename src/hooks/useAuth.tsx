// Lógica de autenticación

import { useMutation } from "@tanstack/react-query"
import { activateAccount, authenticationUser } from "../api/apiAuth"
import { useDispatch } from "react-redux"
import { useToast } from "../context/ToastContext"
import { getCheckpoint, setCredentials } from "../helpers/redux/AuthSlice"
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

  const loginMutation = useMutation({
    mutationFn: authenticationUser,
    onSuccess: data => {
      if (data?.status === 201) {
        dispath(getCheckpoint({ checkpoint: data?.data.checkpoint }))
        goView('/auth/active-account')
      }

      const dataLogin = {
        user: data?.data.user,
        token: data?.data.token
      }
      dispath(setCredentials(dataLogin))

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

    // Inicio sesión
    login: loginMutation.mutate,
    isPendingLogin: loginMutation.isPending,
    isErrorLogin: loginMutation.isError,
    errorLogin: loginMutation.error
  }
}

export default useAuth
