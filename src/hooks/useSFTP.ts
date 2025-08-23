// Lógica de SFTP

import { useMutation } from '@tanstack/react-query'
import { createConnectionSFTP } from '../api/apiSFTP'
import type { SFTPData } from '../schemas/sftp-schema'
import { useToast } from '../context/ToastContext'

const useSFTP = () => {

  const { showToast } = useToast()

  const connectionSFTPMutation = useMutation({
    mutationFn: ({ dataSFTP, mvno }: { dataSFTP: SFTPData, mvno: string }) => createConnectionSFTP(dataSFTP, mvno),
    onSuccess: data => {
      showToast({ type: 'success', title: 'Validación exitosa', message: data })
    },
    onError: error => {
      const mess = JSON.parse(error.message)
      showToast({ type: 'error', title: 'Error', message: mess.message })
    }
  })

  return {
    // Creación de conexión SFTP
    createConnectionSFTP: connectionSFTPMutation.mutate,
    isPendingCreateSFTP: connectionSFTPMutation.isPending,
    isErrorCreateSFTP: connectionSFTPMutation.isError,
    errorCreateSFTP: connectionSFTPMutation.error,
  }
}

export default useSFTP

