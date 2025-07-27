// Schema de inventario

import z from "zod"

export interface InventoryFormData {
  nombre: string
  calle: string
  delegacion: string
  cp: string
  ciudad: string
  estado: string
  operadorLogistico: string
  tipoInventario: 'fisico' | 'virtual' | '' // Permitir string vacío inicialmente
  descripcion: string
  ubicacion: string
}


export const InventorySchema = z.object({
  inventories: z.array(
    z.object({
      iccid: z.string(),
      imsi: z.string(),
      msisdn: z.string(),
      fabricante: z.string(),
      fechaCarga: z.string(),
      almcaen: z.string(),
      tipoAlmacen: z.string(),
      estadoLinea: z.string()
    })
  )
})

export type InventoryType = z.infer<typeof InventorySchema>['inventories'][number]

