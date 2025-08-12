// Schema de usuarios

import z from "zod"

// Schema de usuario
export const UsersSchema = z.object({
  users: z.array(
    z.object({
      id_user: z.string(),
      name: z.string(),
      mfa_secret: z.string(),
      checkpoint: z.string(),
      updated_by: z.string(),
      created_by: z.string(),
      phone_number: z.string(),
      mfa_enabled: z.boolean(),
      mfa_required: z.boolean(),
      cipher: z.string(),
      email_verified: z.string(),
      high_date: z.string(),
      update_date: z.string(),
      be_id: z.string(),
      status: z.number(),
      mvno_id: z.string(),
      role_id: z.string(),
    })
  )
})


export type User = z.infer<typeof UsersSchema>['users'][number]


// Schema de creación de usuario
export interface UserDataProps {
  name: string
  checkpoint: string
  phone_number: string
  mvno_id: string
  role_id: string
  mfa_required: boolean
}


// Schema de edición de usuario
export interface UserDataUpdateProps {
  id_user: string
  name: string
  phone_number: string
  mfa_required: boolean
  updated_by: string
  mvno_id: string
  role_id: string
}


// Schema de roles
export const RolesSchema = z.object({
  roles: z.array(
    z.object({
      id_role: z.string(),
      nombre: z.string(),
      activo: z.number(),
    })
  )
})

export type Roles = z.infer<typeof RolesSchema>['roles'][number]


// Schema de mvnos
export const MvnosSchema = z.object({
  mvnos: z.array(
    z.object({
      nombre: z.string(),
      Acta_Constitutiva: z.string(),
      status: z.number(),
      mvno_id: z.string(),
      fecha_antiguedad: z.string(),
      correo_coporativo: z.string(),
      Pago: z.string(),
      mvno: z.array(z.string()),
      bienvenida: z.string(),
      RFC: z.string(),
      producto: z.string(),
      Direccion_Facturacion: z.string(),
      telefono: z.string(),
      Direccion: z.string(),
      Modulos: z.array(z.string())
    })
  )
})

export type Mvnos = z.infer<typeof MvnosSchema>['mvnos'][number]
