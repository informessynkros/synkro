// Schema de inventario

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
