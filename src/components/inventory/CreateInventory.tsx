// Vista para crear un inventario

import { Box, Building, CircleX, Globe, Hash, Home, MapPin, PersonStanding, SaveAll, Truck } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import MessageToasty from "../ui/messages/MessageToasty"
import useMediaQueries from "../../hooks/useMediaQueries"
import type { RadioOption } from "../ui/button/radioButton/RadioButtonGroup"
import RadioButtonGroup from "../ui/button/radioButton/RadioButtonGroup"
import ButtonCustom from "../ui/button/ButtonCustom"
import useNavigation from "../../hooks/useNavigation"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import LineSeparator from "../ui/lineSeparator/LineSeparator"


const CreateInventory = () => {

  // Hooks
  const { isDesktop, isMobile } = useMediaQueries()
  const { goBack } = useNavigation()

  const defaultValues = useMemo(
    // Valores del documento
    () => ({
      nombre: '',
      calle: '',
      delegacion: '',
      cp: '',
      ciudad: '',
      estado: '',
      operadorLogistico: '',
      tipoInventario: '',
      descripcion: '',
      ubicacion: ''
    }),
    []
  )

  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  const tipoInventarioOptions: RadioOption<'fisico' | 'virtual'>[] = [
    {
      label: 'Inventario Físico',
      value: 'fisico',
    },
    {
      label: 'Inventario Virtual',
      value: 'virtual',
    }
  ]

  // Envio de información
  const handleDataSubmit = () => {
    try {
      const data = {
        nombre: '',
        calle: '',
        delegacion: '',
        cp: '',
        ciudad: '',
        estado: '',
        operadorLogistico: '',
        tipoInventario: 0,
        descripcion: '',
        ubicacion: ''
      }
      console.log('Enviando data: ', data)
    } catch (error) {
      console.warn('Ocurrio un error')
    }
  }

  return (
    <>
      <div className="bg-white shadow-md p-6 rounded-md">
        <div className="text-[#777] flex items-center gap-3">
          <Box />
          <span>Inventario - Altan almacén</span>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-md mt-6">
        <form onSubmit={handleSubmit(handleDataSubmit)}>
          <div className={`grid ${isDesktop ? 'grid-cols-2 gap-x-8' : isMobile ? 'grid-cols-1' : ''}`}>
            {/* Row 1: Nombre y tipo de inventario */}
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: 'El nombre es requerido'
              }}
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
              name="tipoInventario"
              control={control}
              rules={{
                required: 'Debes seleccionar un tipo de inventario'
              }}
              render={({ field }) => (
                <RadioButtonGroup
                  label="Tipo de Inventario"
                  name="tipoInventario"
                  options={tipoInventarioOptions}
                  value={field.value as 'fisico' | 'virtual' | undefined}
                  onChange={value => {
                    field.onChange(value)
                    console.log('Tipo seleccionado:', value)
                  }}
                  error={errors.tipoInventario?.message}
                  required
                />
              )}
            />

            {/* Row 2: Dirección y descripción */}
            <Controller
              name="calle"
              control={control}
              rules={{
                required: 'La calle es requerida'
              }}
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
              name="descripcion"
              control={control}
              rules={{
                required: 'Agrega una breve descripción'
              }}
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

            {/* Row 3: Delegación ó Municipio, CP, Ubicación interna */}
            <Controller
              name="delegacion"
              control={control}
              rules={{
                required: 'Ingresa una delegación'
              }}
              render={({ field }) => (
                <MessageToasty
                  label="Delegación"
                  type="text"
                  icon={Home}
                  error={errors.delegacion?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="cp"
              control={control}
              rules={{
                required: 'Ingresa un código postal'
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
              name="ubicacion"
              control={control}
              rules={{
                required: 'Ingresa una ubicación interna'
              }}
              render={({ field }) => (
                <MessageToasty
                  label="Ubicación interna"
                  type="text"
                  icon={MapPin}
                  error={errors.ubicacion?.message}
                  required
                  {...field}
                />
              )}
            />

            {/* Row 4: Ciudad, Estado,  */}
            <Controller
              name="ciudad"
              control={control}
              rules={{
                required: 'Ingresa una ciudad'
              }}
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
              rules={{
                required: 'Ingresa un estado'
              }}
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

            {/* Row 5: Operador logístico */}
            <Controller
              name="operadorLogistico"
              control={control}
              render={({ field }) => (
                <MessageToasty
                  label="Operador logistico"
                  type="text"
                  icon={Truck}
                  {...field}
                />
              )}
            />

            <LineSeparator className="col-span-2 my-5" />
            {/* Row: 6: Botones de acción */}
            <div className="flex justify-end col-span-2 gap-4">
              <ButtonCustom
                text="Cancelar"
                icon={CircleX}
                onClick={goBack}
              />

              <ButtonCustomLoading
                text="Crear almacén"
                loadingText="Creando..."
                isLoading={false}
                icon={SaveAll}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateInventory
