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

// Nuevo schema para el plano del formulario
export const WarehouseFlatFormSchema = z.object({
  // Información básica
  id_be: z.string(),
  nombre: z.string(),
  tipo_inventario: z.enum(['FISICO', 'VIRTUAL']),
  descripcion: z.string(),
  operador_logistico: z.string(),
  // Dirección (campos aplanados)
  calle: z.string(),
  municipio: z.string(),
  cp: z.string(),
  ciudad: z.string(),
  estado: z.string(),
  // ubicacion_interna: z.string()
  ubicacion_interna: z.array(z.string())
})

export type WarehouseFlatFormData = z.infer<typeof WarehouseFlatFormSchema>

// Estructura que crea almacén
export type CreateWarehouseRequest = {
  id_be: string
  almacenes: {
    nombre: string
    tipo_inventario: 'FISICO' | 'VIRTUAL'
    descripcion: string
    operador_logistico: string
    direccion: {
      calle: string
      municipio: string
      cp: string
      ciudad: string
      estado: string
    }
    ubicacion_interna: string[]
  }
}

// Función de tranformación estre estructuras
export const flattenWarehouse = (warehouse: Almacen | null): WarehouseFlatFormData => {
  if (!warehouse) {
    return {
      id_be: '',
      nombre: '',
      tipo_inventario: 'FISICO',
      descripcion: '',
      operador_logistico: '',
      calle: '',
      municipio: '',
      cp: '',
      ciudad: '',
      estado: '',
      ubicacion_interna: []
    }
  }

  return {
    id_be: '',
    nombre: warehouse.info.nombre,
    tipo_inventario: warehouse.info.tipo_inventario,
    descripcion: warehouse.info.descripcion,
    operador_logistico: warehouse.info.operador_logistico,
    calle: warehouse.info.direccion.calle,
    municipio: warehouse.info.direccion.municipio,
    cp: warehouse.info.direccion.cp,
    ciudad: warehouse.info.direccion.ciudad,
    estado: warehouse.info.direccion.estado,
    // ubicacion_interna: warehouse.info.ubicacion_interna.join(', ')
    ubicacion_interna: warehouse.info.ubicacion_interna
  }
}

export const transformToCreateRequest = (formData: WarehouseFlatFormData): CreateWarehouseRequest => {
  return {
    id_be: formData.id_be,
    almacenes: {
      nombre: formData.nombre,
      tipo_inventario: formData.tipo_inventario,
      descripcion: formData.descripcion,
      operador_logistico: formData.operador_logistico,
      direccion: {
        calle: formData.calle,
        municipio: formData.municipio,
        cp: formData.cp,
        ciudad: formData.ciudad,
        estado: formData.estado
      },
      // ubicacion_interna: Array.isArray(formData.ubicacion_interna)
      //   ? formData.ubicacion_interna
      //   : formData.ubicacion_interna.split(',').map(item => item.trim()).filter(item => item.length > 0)
      ubicacion_interna: formData.ubicacion_interna
    }
  }
}

// Para formularios - schema individual de almacén
// export const AlmacenFormSchema = z.object({
//   id_be: z.string().min(1, "El ID del cliente (BE) es requerido"),
//   almacenes: z.object({
//     nombre: z.string().min(1, "El nombre es requerido"),
//     tipo_inventario: z.enum(["FISICO", "VIRTUAL"], {
//       errorMap: () => ({ message: "Debe ser FISICO o VIRTUAL" })
//     }),
//     descripcion: z.string().min(1, "La descripción es requerida"),
//     operador_logistico: z.string().min(1, "El operador logístico es requerido"),
//     direccion: z.object({
//       calle: z.string().min(1, "La calle es requerida"),
//       municipio: z.string().min(1, "El municipio es requerido"),
//       cp: z.string().regex(/^\d{5}$/, "CP debe tener 5 dígitos"),
//       ciudad: z.string().min(1, "La ciudad es requerida"),
//       estado: z.string().min(1, "El estado es requerido"),
//     }),
//     ubicacion_interna: z.array(z.string()).min(1, "Debe tener al menos una ubicación interna"),
//   }),
// })

// export type AlmacenFormData = z.infer<typeof AlmacenFormSchema>
