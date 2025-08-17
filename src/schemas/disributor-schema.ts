// schema de distribuidores

import z from "zod"

export const DistributorSchema = z.object({
  distributors: z.array(
    z.object({
      correo: z.string(),
      nombre: z.string(),
      responsable: z.string(),
      descripcion: z.string(),
      id_distribuidor: z.string(),
      id_be: z.string(),
      direccion: z.object({
        estado: z.string(),
        cp: z.string(),
        municipio: z.string(),
        ciudad: z.string(),
        calle: z.string()
      }),
    })
  )
})

export type Distributor = z.infer<typeof DistributorSchema>['distributors'][number]


// Data schema para enviar al backend
export const DistributorFormSchema = z.object({
  id_be: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  responsable: z.string(),
  correo: z.string(),
  calle: z.string(),
  municipio: z.string(),
  cp: z.string(),
  ciudad: z.string(),
  estado: z.string(),
})

export type DistributorFormData = z.infer<typeof DistributorFormSchema>
