// Vista de carga de inventario mejorada
import { Boxes, Upload, FileText, CircleX } from "lucide-react"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import useMediaQueries from "../../hooks/useMediaQueries"
import Section from "../ui/section/Section"
import MessageToasty from "../ui/messages/MessageToasty"
import RadioButtonGroup, { type RadioOption } from "../ui/button/radioButton/RadioButtonGroup"
import FileUploadZone from "../ui/upload/FileUploadZone"
import ExtensionsList from "../ui/lists/ExtensionsList"
import SelectMultiple from "../ui/select/SelectMultiple"
import type { InventoryData } from "../../schemas/chargeInventory-schema"
import ButtonCustom from "../ui/button/ButtonCustom"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import useNavigation from "../../hooks/useNavigation"

interface ChargeInventoryForm {
  nombre: string
  tipoInventario: 'fisico' | 'virtual' | ''
  estado: string
  archivo: File | null
  almacen: string
  region: string
}

const ChargeInventory = () => {
  // Estados
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([])
  const [selectedInventory, setSelectedInventory] = useState<InventoryData[]>([])

  // Hook
  const { isDesktop, isMobile } = useMediaQueries()
  const { goBack } = useNavigation()

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ChargeInventoryForm>({
    defaultValues: {
      nombre: '',
      tipoInventario: '',
      estado: '',
      archivo: null,
      almacen: '',
      region: ''
    }
  })

  // Opciones para radio buttons
  const tipoInventarioOptions: RadioOption<'fisico' | 'virtual'>[] = [
    { label: 'SIM Físico', value: 'fisico' },
    { label: 'E-SIM', value: 'virtual' }
  ]

  // Opciones para región
  const regionOptions = [
    { key: 1, value: 'region1', label: 'Región 1' },
    { key: 2, value: 'region2', label: 'Región 2' },
    { key: 3, value: 'region3', label: 'Región 3' },
    { key: 4, value: 'region4', label: 'Región 4' },
    { key: 5, value: 'region5', label: 'Región 5' }
  ]

  // Extensiones disponibles
  const availableExtensions = [
    { id: 'CCID', name: 'CCID', description: 'Identificador de tarjeta de circuito', active: true },
    { id: '11IM', name: '11IM', description: 'Identificador móvil', active: true },
    { id: 'M555N', name: 'M555N', description: 'Número móvil', active: false },
    { id: 'FABRICANTE', name: 'FABRICANTE', description: 'Información del fabricante', active: true }
  ]

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setValue('archivo', file)
  }

  const handleExtensionToggle = (extensionId: string) => {
    setSelectedExtensions(prev =>
      prev.includes(extensionId)
        ? prev.filter(id => id !== extensionId)
        : [...prev, extensionId]
    )
  }

  const onSubmit = (data: ChargeInventoryForm) => {
    const formData = {
      ...data,
      archivo: uploadedFile,
      extensiones: selectedExtensions
    }
    console.log('Datos del formulario:', formData)
  }

  return (
    <>
      <Section
        text="Inventario - Carga Almacén"
        icon={Boxes}
      />

      <div className="bg-white shadow-md rounded-md mt-6 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">

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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Inventario
                </h3>

                <div className="space-y-4">
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: 'El nombre es requerido' }}
                    render={({ field }) => (
                      <MessageToasty
                        label="Nombre"
                        type="text"
                        placeholder="Nombre del almacén..."
                        error={errors.nombre?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="tipoInventario"
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

              {/* Carga de archivo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Archivo
                </h3>

                <FileUploadZone
                  onFileUpload={handleFileUpload}
                  uploadedFile={uploadedFile}
                  acceptedTypes={['.csv', '.txt']}
                  maxSize={10} // MB
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

            {/* Columna derecha */}
            <div className="space-y-6">

              {/* Configuración */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración
                </h3>

                <div className="space-y-4">
                  <Controller
                    name="almacen"
                    control={control}
                    rules={{ required: 'Selecciona un almacén' }}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <SelectMultiple
                        options={regionOptions}
                        initialValue={selectedInventory.length > 0 ? selectedInventory[0] : null}
                        onSelect={selected => {
                          if (Array.isArray(selected) && selected.length > 0) {
                            onChange(selected[0].key)
                            setSelectedInventory(selected)
                          } else {
                            onChange("")
                            setSelectedInventory([])
                          }
                        }}
                        placeholder="Selecciona mvno"
                        label="MVNO"
                        labelKey="label"
                        valueKey='key'
                        extraInfo={inventory => inventory.key}
                        multiple={false}
                        error={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="region"
                    control={control}
                    rules={{ required: 'Selecciona una región' }}
                    render={({ field }) => (
                      <MessageToasty
                        label="Región"
                        type="select"
                        placeholder="Selecciona región..."
                        error={errors.region?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Extensiones */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Extensiones Disponibles
                </h3>

                <ExtensionsList
                  extensions={availableExtensions}
                  selectedExtensions={selectedExtensions}
                  onExtensionToggle={handleExtensionToggle}
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <ButtonCustom
              text="Cancelar"
              icon={CircleX}
              onClick={goBack}
            />

            <ButtonCustomLoading
              text="Cargar almacén"
              loadingText="Cargando..."
              isLoading={false}
              icon={Upload}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default ChargeInventory