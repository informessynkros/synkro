// Schema de SFTP

import z from "zod";


// Schema para la creación de conexión SFTP
export const SFTPSchema = z.object({

})


// Interface de creación de conexión SFTP
export interface SFTPData {
  ip: string
  puerto: string
  usuario: string
  password: string
  certificado: File | null
}


// Interface para la data de logs de conexiôn
export const MvnoConecctionHistory = z.object({
  evento_id: z.string(),
  descripcion: z.string(),
  accion: z.string(),
  timestamp: z.string(),
  mvno_id: z.string(),
  operador: z.string(),
  estado: z.string()
})