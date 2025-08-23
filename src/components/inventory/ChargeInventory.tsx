// Vista de carga de inventario mejorada
import { AlertTriangle, CheckCircle, FileText, UploadCloud } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Controller } from "react-hook-form"
import useMediaQueries from "../../hooks/useMediaQueries"
import MessageToasty from "../ui/messages/MessageToasty"
import RadioButtonGroup, { type RadioOption } from "../ui/button/radioButton/RadioButtonGroup"
import FileUploadZone from "../ui/upload/FileUploadZone"
import SelectMultiple from "../ui/select/SelectMultiple"
import { useSearchParams } from "react-router-dom"
import { LabelBadge } from "../ui/label/LabelBadge"
import Form from "../ui/form/Form"
import type { InventoryUploadData } from "../../schemas/inventory-schema"


interface ChargeInventoryProps {
  onNext?: (formData: InventoryUploadData) => void
  wizardMode?: boolean
  validateInv: (params: { dataInv: InventoryUploadData, id_be: string }) => void
  isPendingValidateInv: boolean
  isSuccessValidateInv: boolean
  isErrorValidateInv: boolean
  validationData?: any
}

const ChargeInventory = ({
  onNext,
  wizardMode = false,
  validateInv,
  isPendingValidateInv = false,
  isSuccessValidateInv = false,
  isErrorValidateInv = false,
  validationData = null
}: ChargeInventoryProps) => {

  const [searchParams] = useSearchParams()
  const id_be = searchParams.get('id_be')
  const id_almacen = searchParams.get('id_almacen')
  const nombre_almacen = decodeURIComponent(searchParams.get('nombre_almacen') || '')

  // Hook
  const { isDesktop, isMobile } = useMediaQueries()

  // Estados
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formDataToValidate, setFormDataToValidate] = useState<InventoryUploadData | null>(null)

  // const defaultValues: InventoryUploadData = {
  //   nombre: nombre_almacen ? `Inventario ${nombre_almacen}` : '',
  //   tipo_inventario: '',
  //   id_almacen: id_almacen || '',
  //   region: '',
  //   archivo: null
  // }
  const defaultValues = useMemo(() => ({
    nombre: nombre_almacen ? `Inventario ${nombre_almacen}` : '',
    tipo_inventario: '',
    id_almacen: id_almacen || '',
    region: '',
    archivo: null
  }), [nombre_almacen, id_almacen])

  // Opciones para radio buttons
  const tipoInventarioOptions: RadioOption<'fisico' | 'virtual'>[] = [
    { label: 'SIM Físico', value: 'fisico' },
    { label: 'E-SIM', value: 'virtual' }
  ]

  // Opciones para región
  const regionOptions = [
    { key: 2, value: 'region1', label: 'Región 2' },
    { key: 3, value: 'region2', label: 'Región 3' },
    { key: 4, value: 'region3', label: 'Región 4' },
    { key: 5, value: 'region4', label: 'Región 5' },
    { key: 6, value: 'region5', label: 'Región 6' },
    { key: 7, value: 'region5', label: 'Región 7' },
    { key: 8, value: 'region5', label: 'Región 8' },
    { key: 9, value: 'region5', label: 'Región 9' },
  ]

  const handleFileUpload = (file: File, setValue: any) => {
    setUploadedFile(file)
    setValue('archivo', file)
  }

  // Efecto para manejar validación exitosa
  useEffect(() => {
    if (isSuccessValidateInv && validationData && formDataToValidate && wizardMode && onNext) {
      // si la validación fue exitosa, ir al siguiente step
      if (validationData.valid) {
        onNext(formDataToValidate)
      }
    }
  }, [isSuccessValidateInv, validationData, formDataToValidate, wizardMode, onNext])

  const handleSubmitChargeInv = async (data: InventoryUploadData) => {
    const formData = {
      nombre: data.nombre,
      tipo_inventario: data.tipo_inventario,
      id_almacen: data.id_almacen,
      region: data.region,
      archivo: uploadedFile,
    }

    console.log('Datos del formulario:', formData)

    if (wizardMode) {
      // En modo wizard, primero validar
      setFormDataToValidate(formData)
      if (id_be) {
        validateInv({ dataInv: formData, id_be })
      }
      return
    }
  }

  const renderValidationStatus = () => {
    if (!wizardMode) return null

    // Mostrar loading cuando está validando
    if (isPendingValidateInv) {
      return (
        <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>
            <div>
              <h3 className="text-sm font-medium text-sky-800">Validando archivo...</h3>
              <p className="text-sm text-sky-700">Por favor espera mientras validamos el formato y contenido.</p>
            </div>
          </div>
        </div>
      )
    }

    // Solo mostrar resultados si hay validationData
    if (isSuccessValidateInv && validationData) {
      if (validationData.valid) {
        return (
          // <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-green-800">¡Validación exitosa!</h3>
                <p className="text-sm text-green-700">
                  Archivo válido con {validationData.metadata?.total_lines || 0} líneas.
                  {validationData.summary?.total_warnings > 0 &&
                    ` ${validationData.summary.total_warnings} advertencias encontradas.`
                  }
                </p>
              </div>
            </div>
          </div>
        )
      } else {
        // Verificar que validationData existe antes de acceder a sus propiedades
        return (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Errores en el archivo</h3>
                <p className="text-sm text-red-700 mb-2">
                  Se encontraron {validationData?.summary?.total_errors || 0} errores:
                </p>
                {validationData?.errors && validationData.errors.length > 0 && (
                  <ul className="text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto">
                    {validationData.errors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {validationData.errors.length > 5 && (
                      <li>• ... y {validationData.errors.length - 5} errores más</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )
      }
    }

    // Mostrar error de validación
    if (isErrorValidateInv) {
      return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error en validación</h3>
              <p className="text-sm text-red-700">No se pudo validar el archivo. Inténtalo nuevamente.</p>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  const renderChargeInventory = (control: any, errors: any, setValue: any) => {
    return (
      <div className="">

        {/* Estados de validación */}
        {renderValidationStatus()}

        {/* Grid principal */}
        <div className={`grid gap-6 ${isDesktop
          ? 'grid-cols-2 gap-x-8'
          : isMobile
            ? 'grid-cols-1'
            : 'grid-cols-2 gap-x-6'
          }`}>

          {/* Columna izquierda */}
          <div className="space-y-6">

            {/* Información básica */}
            <div>
              <div className="flex items-center mb-4 justify-between">
                <h3 className="text-lg font-semibold text-gray-600">
                  Información del Inventario
                </h3>

                {id_be && (
                  <>
                    <div className="flex items-end gap-2">
                      <LabelBadge variant="info" labelText={`BE: ${id_be}`} />
                      <LabelBadge variant="info" labelText={`Almacén: ${nombre_almacen}`} />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <Controller
                  name="nombre"
                  control={control}
                  rules={{ required: 'El nombre es requerido' }}
                  render={({ field }) => (
                    <MessageToasty
                      label="Nombre"
                      type="text"
                      placeholder="Nombre..."
                      error={errors.nombre?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="tipo_inventario"
                  control={control}
                  rules={{ required: 'Selecciona un tipo de inventario' }}
                  render={({ field }) => (
                    <RadioButtonGroup
                      label="Tipo de Inventario"
                      name="tipoInventario"
                      options={tipoInventarioOptions}
                      value={field.value as 'fisico' | 'virtual' | undefined}
                      onChange={field.onChange}
                      error={errors.tipoInventario?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">

            {/* Configuración */}
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-4">
                Configuración
              </h3>

              <div className="space-y-4">
                <Controller
                  name="region"
                  control={control}
                  rules={{
                    required: 'Por favor, selecciona una región'
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <SelectMultiple
                      options={regionOptions}
                      initialValue={value ? regionOptions.find((region: any) => region.key === value) : null}
                      onSelect={selected => {
                        if (Array.isArray(selected) && selected.length > 0) {
                          onChange(selected[0].key)
                        } else if (selected && typeof selected === 'object' && 'key' in selected) {
                          onChange(selected.key)
                        } else {
                          onChange("")
                        }
                      }}
                      placeholder="Selecciona región"
                      label="Región"
                      labelKey="label"
                      valueKey="key"
                      extraInfo={region => region.key}
                      multiple={false}
                      error={error?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Archivo */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              Archivo
            </h3>

            <FileUploadZone
              onFileUpload={file => handleFileUpload(file, setValue)}
              uploadedFile={uploadedFile}
              acceptedTypes={['.csv', '.txt']}
              maxSize={50} // MB
            />

            {uploadedFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    {uploadedFile.name}
                  </span>
                  <span className="text-xs text-green-600">
                    ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Form
      title="carga de inventario"
      icon={UploadCloud}
      item={defaultValues}
      enabledSection={false}
      defaultValues={defaultValues}
      onSubmit={handleSubmitChargeInv}
      isLoading={wizardMode ? isPendingValidateInv : false}
      isSuccess={wizardMode ? false : false}
      isError={wizardMode ? isErrorValidateInv : false}
      renderFields={renderChargeInventory}
      submitButtonText={{
        create: '', // wizardMode ? 'Siguiente' : 'Cargar almacén',
        edit: wizardMode ? 'Siguiente' : 'Cargar almacén'
      }}
      submitLoadingText={{
        create: '',
        edit: wizardMode ? 'Validando...' : 'Cargando...'
      }}
    />
  )
}

export default ChargeInventory