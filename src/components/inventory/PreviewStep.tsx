// Paso de previsualización del wizard de carga de inventario

import { FileText, CheckCircle, Eye, Package, MapPin, Tag, Upload, ArrowLeft } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { LabelBadge } from "../ui/label/LabelBadge"
import ButtonCustom from "../ui/button/ButtonCustom"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import Section from "../ui/section/Section"
import { useChargeInventory } from "../../hooks/useInventories"
import type { InventoryUploadData } from "../../schemas/inventory-schema"


interface PreviewStepProps {
  formData: InventoryUploadData
  onBack: () => void
  onEdit?: () => void
}

const PreviewStep = ({ formData, onBack, onEdit }: PreviewStepProps) => {
  const [searchParams] = useSearchParams()
  const id_be = searchParams.get('id_be')

  const {
    loadInventory,
    isPendingloadInv,
    isSuccessloadInv,
    isErrorloadInv,
  } = useChargeInventory()

  // Helper para crear FormData que espera la API
  const createFormDataForAPI = (data: InventoryUploadData): FormData => {
    const formData = new FormData()
    formData.append('nombre', data.nombre)
    formData.append('tipo_inventario', data.tipo_inventario)
    formData.append('region', data.region)
    if (data.archivo) {
      formData.append('archivo', data.archivo)
    }
    return formData
  }

  const handleSubmitInventory = async () => {
    try {
      const inventoryRequest = {
        id_be: id_be || '',
        formData: createFormDataForAPI(formData)
      }

      await loadInventory(inventoryRequest)
    } catch (error) {
      console.error('Error al cargar inventario:', error)
    }
  }

  // Mapeo de valores para mostrar labels más amigables
  const getTipoInventarioLabel = (tipo: string) => {
    const tipos = {
      'fisico': 'SIM Físico',
      'virtual': 'E-SIM'
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  const getRegionLabel = (regionKey: string) => {
    const regiones = {
      '1': 'Región 1',
      '2': 'Región 2',
      '3': 'Región 3',
      '4': 'Región 4',
      '5': 'Región 5'
    }
    return regiones[regionKey as keyof typeof regiones] || `Región ${regionKey}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <Section
        text="Confirmar carga de inventario"
        icon={Eye}
      />

      <div className="mt-6 space-y-6">
        {/* Resumen de la información */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              <CheckCircle className="inline w-5 h-5 mr-2 text-green-600" />
              Resumen de la carga
            </h3>

            {id_be && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">BE: </span>
                <LabelBadge variant="info" labelText={id_be} />
              </div>
            )}
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">
                Información del Inventario
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nombre:</span>
                    <p className="text-gray-900">{formData.nombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Tipo de Inventario:</span>
                    <p className="text-gray-900">{getTipoInventarioLabel(formData.tipo_inventario)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Región:</span>
                    <p className="text-gray-900">{getRegionLabel(formData.region)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del archivo */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">
                Archivo a cargar
              </h4>

              {formData.archivo ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">
                        {formData.archivo.name}
                      </p>
                      <p className="text-xs text-green-600">
                        Tamaño: {(formData.archivo.size / 1024).toFixed(1)} KB
                      </p>
                      <p className="text-xs text-green-600">
                        Tipo: {formData.archivo.type || 'CSV'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">No se ha seleccionado ningún archivo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estado de validación */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Información validada correctamente
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Todos los campos han sido completados y el archivo está listo para ser cargado.
                Al confirmar, se iniciará la carga del inventario en el sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {isSuccessloadInv && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  ¡Inventario cargado exitosamente!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  El inventario ha sido procesado y cargado en el sistema.
                </p>
              </div>
            </div>
          </div>
        )}

        {isErrorloadInv && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar el inventario
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Ha ocurrido un error durante la carga. Por favor, verifica los datos e intenta nuevamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-between pt-4">
          <ButtonCustom
            text="Atrás"
            icon={ArrowLeft}
            onClick={onBack}
            disabled={isPendingloadInv}
          />

          <div className="flex gap-3">
            {onEdit && (
              <ButtonCustom
                text="Editar"
                icon={FileText}
                onClick={onEdit}
                disabled={isPendingloadInv}
              />
            )}

            <ButtonCustomLoading
              text="Cargar Inventario"
              loadingText="Cargando..."
              isLoading={isPendingloadInv}
              icon={Upload}
              onClick={handleSubmitInventory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewStep