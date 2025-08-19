//  Schema de inventario

import z from "zod"


// Schema de información individual de un inventario
export const IndividualInventory = z.object({
  be: z.string(),
  msisdn: z.string(),
  imsi: z.string(),
  iccid: z.string(),
  nombre: z.string(),
  tipo_inventario: z.string(),
  region: z.string(),
  id_almacen: z.string(),
  query_execution_id: z.string(),
})

// Schema de la obtención de inventario
export const InventorySchema = z.object({
  query_execution_id: z.string(),
  result_count: z.number(),
  results: z.array(
    z.object({ IndividualInventory })
  )
})

export type Inventory = z.infer<typeof InventorySchema>['results'] // Inventario
export type InventoryCount = z.infer<typeof InventorySchema>['result_count'] // Total

// Petición que haremos al backend para que nos retorne la información
export interface InventoryDataProps {
  MVNO: string
  almacen: string
}
