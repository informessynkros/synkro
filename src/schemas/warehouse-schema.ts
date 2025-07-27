// Schema de almacen

import z from "zod"


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

// Schema de almacenes con el be_id
const SchemaWarehouse = z.object({
  id_be: z.string().min(1, "El ID del cliente (BE) es requerido"),
  almacenes: z.array(AlmacenSchema)
})

// Types derivados de los schemas creados anteriormente
export type Almacen = z.infer<typeof AlmacenSchema>
export type InfoAlmacen = z.infer<typeof InfoAlmacenSchema>
export type Direccion = z.infer<typeof DireccionSchema>
export type SchemaAlmacen = z.infer<typeof SchemaWarehouse>

export const validateAlmacen = (data: unknown): Almacen => {
  return AlmacenSchema.parse(data)
}

// Para formularios - schema individual de almacén
export const AlmacenFormSchema = z.object({
  id_be: z.string().min(1, "El ID del cliente (BE) es requerido"),
  almacenes: z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    tipo_inventario: z.enum(["FISICO", "VIRTUAL"], {
      errorMap: () => ({ message: "Debe ser FISICO o VIRTUAL" })
    }),
    descripcion: z.string().min(1, "La descripción es requerida"),
    operador_logistico: z.string().min(1, "El operador logístico es requerido"),
    direccion: z.object({
      calle: z.string().min(1, "La calle es requerida"),
      municipio: z.string().min(1, "El municipio es requerido"),
      cp: z.string().regex(/^\d{5}$/, "CP debe tener 5 dígitos"),
      ciudad: z.string().min(1, "La ciudad es requerida"),
      estado: z.string().min(1, "El estado es requerido"),
    }),
    ubicacion_interna: z.array(z.string()).min(1, "Debe tener al menos una ubicación interna"),
  }),
})

export type AlmacenFormData = z.infer<typeof AlmacenFormSchema>