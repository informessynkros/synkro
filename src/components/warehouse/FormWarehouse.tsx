// Formulario de almacén

import { useSelector } from "react-redux"
import { flattenWarehouse, type Almacen, type WarehouseFlatFormData, transformToCreateRequest } from "../../schemas/warehouse-schema"
import useWarehouses from "../../hooks/useWarehouses"
import useMediaQueries from "../../hooks/useMediaQueries"
import { useEffect } from "react"
import type { RadioOption } from "../ui/button/radioButton/RadioButtonGroup"
import { Controller } from "react-hook-form"
import { Box, Boxes, Building, Globe, Hash, Home, MapPin, PersonStanding, Pin, Truck, UploadCloud } from "lucide-react"
import MessageToasty from "../ui/messages/MessageToasty"
import RadioButtonGroup from "../ui/button/radioButton/RadioButtonGroup"
import DynamicInputArray from "../ui/input/DynamicInputArray"
import Form from "../ui/form/Form"
import AddressMapController from "../ui/map/AddressMapController"
import LineSeparator from "../ui/lineSeparator/LineSeparator"
import useNavigation from "../../hooks/useNavigation"
import ButtonCustom from "../ui/button/ButtonCustom"


interface FormWarehouseProps {
  warehouse: Almacen | null
  closeDrawer: () => void
}

const FormWarehouse = ({ warehouse, closeDrawer }: FormWarehouseProps) => {
  console.log(warehouse)

  const { user } = useSelector((state: any) => state.authUser)

  const defaultValues: WarehouseFlatFormData = {
    ...flattenWarehouse(warehouse),
    id_be: user.be_id,
  }

  // Hooks
  const {
    createWarehouse,
    isPendingCreateWh,
    isSuccessCreateWh,
    isErrorCreateWh
  } = useWarehouses(user.be_id)
  const { isDesktop, isLaptop, isTablet, isMobile } = useMediaQueries()
  const { goView } = useNavigation()

  const tipoInventarioOptions: RadioOption<'FISICO' | 'VIRTUAL'>[] = [
    {
      label: 'Inventario Físico',
      value: 'FISICO',
    },
    {
      label: 'Inventario Virtual',
      value: 'VIRTUAL',
    }
  ]

  const handleLoadInventory = () => {
    // Obtenemos el be_id del localStorage
    const be_id = user.be_id
    const id_almacen = warehouse?.id_almacen
    const nombre_almacen = warehouse?.info.nombre
    goView(`/charge-inventory?id_be=${be_id}&id_almacen=${id_almacen}&nombre_almacen=${encodeURIComponent(nombre_almacen!!)}`)
  }

  // Envio de información
  const handleSubmitWarehouse = async (formData: WarehouseFlatFormData, isEditing: boolean) => {
    if (warehouse && isEditing) {
      console.log('Edición')
    } else {
      const data = transformToCreateRequest(formData)
      // console.log('Enviando data: ', data)
      await createWarehouse(data)
    }
  }

  useEffect(() => {
    if (isSuccessCreateWh && !isErrorCreateWh) {
      closeDrawer?.()
    }
  }, [isSuccessCreateWh, isErrorCreateWh, closeDrawer])

  // Render de campos de usuarios
  const renderWarehouseFields = (control: any, errors: any) => {
    return (
      <div>
        {/* Información general */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Boxes size={20} />
              Información del almacén
            </h3>

            <ButtonCustom
              text="Cargar inventario"
              icon={UploadCloud}
              onClick={handleLoadInventory}
              large="w-auto"
            />
          </div>

          <div className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : isLaptop ? 'grid-cols-2' : isMobile ? 'grid-cols-1' : ''}`}>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es requerido' }}
              render={({ field }) => (
                <MessageToasty
                  label="Nombre"
                  type="text"
                  placeholder="Nombre de almacén..."
                  icon={PersonStanding}
                  error={errors.nombre?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="tipo_inventario"
              control={control}
              rules={{ required: 'Debes seleccionar un tipo de inventario' }}
              render={({ field }) => (
                <RadioButtonGroup
                  label="Tipo de Inventario"
                  name="tipoInventario"
                  options={tipoInventarioOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.tipo_inventario?.message}
                  required
                />
              )}
            />

            <Controller
              name="descripcion"
              control={control}
              rules={{ required: 'Agrega una breve descripción' }}
              render={({ field }) => (
                <MessageToasty
                  label="Descripción"
                  type="textarea"
                  error={errors.descripcion?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="operador_logistico"
              control={control}
              render={({ field }) => (
                <MessageToasty
                  label="Operador logístico"
                  type="text"
                  icon={Truck}
                  error={errors.operador_logistico?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="ubicacion_interna"
              control={control}
              rules={{
                required: 'Ingresa una ubicación interna',
                validate: value => {
                  if (!value || value.length === 0) {
                    return 'Debe tener al menos una ubicación interna'
                  }
                  if (value.some((item: any) => !item || item.trim() === '')) {
                    return 'No puede haber ubicaciones vacías'
                  }
                  return true
                }
              }}
              render={({ field }) => (
                <DynamicInputArray
                  label="Ubicación interna"
                  placeholder="Piso / Localización"
                  icon={MapPin}
                  values={field.value || []}
                  onChange={field.onChange}
                  error={errors.almacenes?.ubicacion_interna?.message}
                  required
                  maxItems={5}
                />
              )}
            />
          </div>
        </div>

        <LineSeparator className="my-5" />

        {/* Dirección */}
        <div>
          <div className="flex items-center gap-3 mb-5 text-gray-600">
            <Pin />
            <h1 className={`font-semibold ${isDesktop ? 'text-2xl' : isTablet ? 'text-xl' : isMobile ? 'text-base' : 'font-normal text-base'}`}> Dirección </h1>
          </div>
          <div className={`grid ${isDesktop ? 'grid-cols-2' : isTablet ? 'grid-cols-1' : 'grid-cols-1'} gap-8`}>
            {/* Formulario */}
            <div>
              <Controller
                name="calle"
                control={control}
                rules={{ required: 'La calle es requerida' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Dirección (calle)"
                    type="text"
                    icon={Building}
                    error={errors.calle?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="municipio"
                control={control}
                rules={{ required: 'Ingresa una delegación' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Delegación"
                    type="text"
                    icon={Home}
                    error={errors.municipio?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="cp"
                control={control}
                rules={{
                  required: 'Ingresa un código postal',
                  pattern: {
                    value: /^\d{5}$/,
                    message: 'El CP debe tener 5 dígitos'
                  }
                }}
                render={({ field }) => (
                  <MessageToasty
                    label="Código postal"
                    type="text"
                    icon={Hash}
                    error={errors.cp?.message}
                    required
                    {...field}
                  />
                )}
              />


              <Controller
                name="ciudad"
                control={control}
                rules={{ required: 'Ingresa una ciudad' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Ciudad"
                    type="text"
                    icon={Globe}
                    error={errors.ciudad?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="estado"
                control={control}
                rules={{ required: 'Ingresa un estado' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Estado"
                    type="text"
                    icon={MapPin}
                    error={errors.estado?.message}
                    required
                    {...field}
                  />
                )}
              />
            </div>

            {/* Mapa */}
            <AddressMapController
              control={control}
              fieldPrefix=""
              mapId="warehouse-map"
              title="Ubicación del almacén"
              description="Selecciona la ubicación del almacén en el mapa"
              initialAddress={warehouse ? {
                calle: warehouse.info.direccion?.calle || '',
                municipio: warehouse.info.direccion?.municipio || '',
                ciudad: warehouse.info.direccion?.ciudad || '',
                estado: warehouse.info.direccion?.estado || '',
                cp: warehouse.info.direccion?.cp || ''
              } : undefined}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Form
      title="almacén"
      icon={Box}
      item={warehouse ? defaultValues : null}
      closeDrawer={closeDrawer}
      defaultValues={defaultValues}
      onSubmit={handleSubmitWarehouse}
      isLoading={isPendingCreateWh}
      isSuccess={isSuccessCreateWh}
      isError={isErrorCreateWh}
      renderFields={renderWarehouseFields}
      submitButtonText={{
        create: 'Crear almacén',
        edit: 'Editar almacén'
      }}
      submitLoadingText={{
        create: 'Creando...',
        edit: 'Editando...'
      }}
    />
  )
}

export default FormWarehouse
