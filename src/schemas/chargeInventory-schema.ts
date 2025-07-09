// schema de carga de almacén

export interface ChargeInventoryData {
  nombre: string
  tipoInvenatrio: string
  archivo: string
  almacen: number
}

export interface InventoryData {
  key: number
  value: string
  label: string
}