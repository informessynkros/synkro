// Paso de previsualización del wizard de carga de inventario

import { FileText, CheckCircle, Eye, Package, MapPin, Tag, Upload, ArrowLeft, ChartCandlestick, Check, ChartLine, TriangleAlert, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { LabelBadge } from "../ui/label/LabelBadge"
import ButtonCustom from "../ui/button/ButtonCustom"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import Section from "../ui/section/Section"
import type { InventoryUploadData } from "../../schemas/inventory-schema"
import { useState } from "react"
import Tooltip from "../ui/tooltip/Tooltip"


interface PreviewStepProps {
  formData: InventoryUploadData
  validationData?: any
  onBack: () => void
  onEdit?: () => void
  loadInventory?: (params: { id_be: string, formData: FormData }) => void
  isPendingloadInv: boolean
  isSuccessloadInv: boolean
  isErrorloadInv: boolean
}

const PreviewStep = ({
  formData,
  validationData,
  onBack,
  onEdit,
  loadInventory,
  isPendingloadInv = false,
  isSuccessloadInv = false,
  isErrorloadInv = false
}: PreviewStepProps) => {
  const [searchParams] = useSearchParams()
  const id_be = searchParams.get('id_be')

  // Estados
  const [showAllRows, setShowAllRows] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const createFormDataForAPI = (data: InventoryUploadData): FormData => {
    const formData = new FormData()
    formData.append('nombre', data.nombre)
    formData.append('tipo_inventario', data.tipo_inventario)
    formData.append('region', data.region)
    formData.append('id_almacen', data.id_almacen)
    if (data.archivo) {
      formData.append('archivo', data.archivo)
    }
    return formData
  }

  const handleSubmitInventory = () => {
    try {
      if (!loadInventory || !id_be) return

      const inventoryRequest = {
        id_be: id_be || '',
        formData: createFormDataForAPI(formData)
      }

      loadInventory(inventoryRequest)
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
      '2': 'Región 2',
      '3': 'Región 3',
      '4': 'Región 4',
      '5': 'Región 5',
      '6': 'Región 6',
      '7': 'Región 7',
      '8': 'Región 8',
      '9': 'Región 9'
    }
    return regiones[regionKey as keyof typeof regiones] || `Región ${regionKey}`
  }

  const handleExpandRows = async () => {
    setIsLoadingMore(true)
    // Simular loading
    await new Promise(resolve => setTimeout(resolve, 300))
    setShowAllRows(!showAllRows)
    setIsLoadingMore(false)
  }

  const renderValidationStatus = () => {
    if (!validationData) return null

    if (validationData.valid) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">Archivo validado correctamente</h3>
              <div className="text-sm font-medium text-green-700">
                <div className="flex items-center gap-2">
                  <ChartCandlestick />
                  <p className="text-gray-600 font-semibold">{validationData.metadata?.total_lines || 0} líneas detectadas</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check />
                  <p className="text-gray-600 font-semibold">{validationData.metadata?.valid_lines || 0} líneas válidas</p>
                </div>
                <div className="flex items-center gap-2">
                  <ChartLine />
                  <p className="text-gray-600 font-semibold">{validationData.summary?.estimated_success_rate || '100%'} tasa de éxito estimada</p>
                </div>
                {validationData.summary?.total_warnings > 0 && (
                  <div className="flex items-center gap-2">
                    <TriangleAlert />
                    <p className="text-gray-600 font-semibold">{validationData.summary?.total_warnings || '100%'} advertencias (no críticas)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Archivo con errores críticos</h3>
              <p className="text-sm text-red-700 mt-1">
                No se puede procesar el archivo. Se encontraron {validationData.summary?.total_errors || 0} errores.
              </p>
            </div>
          </div>
        </div>
      )
    }
  }

  // NUEVO: Renderizar preview del archivo
  const renderFilePreview = () => {
    if (!validationData?.preview || validationData.preview.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-center">No hay preview disponible</p>
        </div>
      )
    }

    const totalAvailable = validationData.preview?.length || 0
    const rowsToShow = showAllRows ? validationData.preview : validationData.preview.slice(0, 10)
    const remainingRows = showAllRows ? 0 : (totalAvailable - 10) // Si está expandido = 0, si no = lo que reste
    // const remainingRows = validationData.metadata?.total_lines - rowsToShow.length

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Vista previa del archivo ({validationData.preview.length} primeras líneas)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">#</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">ID Producto</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">Cantidad</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">Código 1</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">Código 2</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">Tipo</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">ICCID</th>
                <th className="px-2 py-2 text-left text-gray-600 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* {validationData.preview.map((row: any, index: number) => ( */}
              {rowsToShow.map((row: any, index: number) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${row.valid ? 'bg-white' : 'bg-red-50'}`}
                >
                  <td className="px-2 py-2 text-gray-600">{row.line_number}</td>
                  <td className="px-2 py-2 font-mono text-xs">
                    {row.columns[0] ? (
                      <Tooltip content={row.columns[0]} position="top">
                        <span className={`cursor-help ${row.columns[0].includes('Ð') ? 'text-orange-600' : 'text-gray-900'}`}>
                          {row.columns[0]?.substring(0, 15)}...
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-2">{row.columns[1] || '-'}</td>
                  <td className="px-2 py-2 font-mono text-xs">
                    {row.columns[2] ? (
                      <Tooltip content={`Código 1: ${row.columns[2]}`} position="top">
                        <span className="cursor-help text-gray-900">
                          {row.columns[2].length > 8 ? `${row.columns[2].substring(0, 8)}...` : row.columns[2]}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-2 font-mono text-xs">
                    {row.columns[3] ? (
                      <Tooltip content={`Código 2: ${row.columns[3]}`} position="top">
                        <span className="cursor-help text-gray-900">
                          {row.columns[3].length > 8 ? `${row.columns[3].substring(0, 8)}...` : row.columns[3]}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-2">{row.columns[4] || '-'}</td>
                  <td className="px-2 py-2 font-mono text-xs">
                    {row.columns[10] ? (
                      <Tooltip content={`ICCID: ${row.columns[10]}`} position="top">
                        <span className="cursor-help text-gray-900">
                          {row.columns[10].substring(0, 10)}...
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {row.valid ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        ✓ Válida
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        ✗ Error
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {remainingRows > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <button
                onClick={handleExpandRows}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-600"></div>
                    Cargando...
                  </>
                ) : showAllRows ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Contraer vista
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Ver {totalAvailable - 10} líneas más
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto">
      {/* Header */}
      <Section
        text="Confirmar carga de inventario"
        icon={Eye}
      />

      <div className="mt-6 space-y-6">
        {/* Estado de validación */}
        {renderValidationStatus()}
        {/* Resumen de la información */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-600">
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
              <h4 className="font-medium text-gray-700 border-b border-b-gray-200 pb-2">
                Información del Inventario
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-bold text-gray-700">Nombre:</span>
                    <p className="text-gray-600">{formData.nombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-bold text-gray-700">Tipo de Inventario:</span>
                    <p className="text-gray-600">{getTipoInventarioLabel(formData.tipo_inventario)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-bold text-gray-700">Región:</span>
                    <p className="text-gray-600">{getRegionLabel(formData.region)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del archivo */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b border-b-gray-200 pb-2">
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

        {validationData && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Vista previa del contenido
            </h3>
            {renderFilePreview()}
          </div>
        )}

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
              disabled={validationData && !validationData.valid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewStep