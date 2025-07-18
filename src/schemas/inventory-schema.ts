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


// Schema de direccion
const DireccionSchema = z.object({
  estado: z.string().min(1, "El estado es requerido"),
  cp: z.string().regex(/^\d{5}$/, "CP debe tener 5 dígitos"),
  municipio: z.string().min(1, "El municipio es requerido"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  calle: z.string().min(1, "La calle es requerida")
})

// Schema para inventario
const InfoAlmacenSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  direccion: DireccionSchema,
  ubicacion_interna: z.array(z.string()).min(1, "Debe tener al menos una ubicación interna"),
  operador_logistico: z.string().min(1, "El operador logístico es requerido"),
  // tipo_inventario: z.string(),
  tipo_inventario: z.enum(["FISICO", "VIRTUAL"], {
    errorMap: () => ({ message: "Debe ser FISICO o VIRTUAL" })
  }),
  nombre: z.string().min(1, "El nombre es requerido")
})

// Schema para almacen individual
const AlmacenSchema = z.object({
  id_almacen: z.string().min(1, "El ID del almacén es requerido"),
  info: InfoAlmacenSchema
})

export const InventoryNewData = z.object({
  id_be: z.string().min(1, "El ID del cliente (BE) es requerido"),
})


// Types derivados de los schemas creados anteriormente
export type InventoryData = z.infer<typeof InventoryNewData>
export type Almacen = z.infer<typeof AlmacenSchema>
export type InfoAlmacen = z.infer<typeof InfoAlmacenSchema>
export type Direccion = z.infer<typeof DireccionSchema>

// Validaciones adicionales útiles
export const validateInventoryData = (data: unknown): InventoryData => {
  return InventoryNewData.parse(data)
}

export const validateAlmacen = (data: unknown): Almacen => {
  return AlmacenSchema.parse(data)
}

// Para formularios - schema individual de almacén
export const AlmacenFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  calle: z.string().min(1, "La calle es requerida"),
  municipio: z.string().min(1, "El municipio es requerido"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  estado: z.string().min(1, "El estado es requerido"),
  cp: z.string().regex(/^\d{5}$/, "CP debe tener 5 dígitos"),
  ubicacion_interna: z.string().min(1, "La ubicación interna es requerida"),
  operador_logistico: z.string().min(1, "El operador logístico es requerido"),
  tipo_inventario: z.enum(["FISICO", "VIRTUAL"])
})

export type AlmacenFormData = z.infer<typeof AlmacenFormSchema>
