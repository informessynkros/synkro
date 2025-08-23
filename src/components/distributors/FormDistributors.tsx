// Formulario de distribuidores

import { Controller } from "react-hook-form"
import type { Distributor, DistributorFormData } from "../../schemas/disributor-schema"
import useDistributors from "../../hooks/useDistributors"
import useMediaQueries from "../../hooks/useMediaQueries"
import MessageToasty from "../ui/messages/MessageToasty"
import { Truck, User2Icon, Mail, MapPin, Building } from "lucide-react"
import Form from "../ui/form/Form"
import LineSeparator from "../ui/lineSeparator/LineSeparator"
import AddressMapController from "../ui/map/AddressMapController"
import { useSelector } from "react-redux"

interface FormDistributorsProps {
  distributor?: Distributor | null
  closeDrawer: () => void
}

const FormDistributors = ({ distributor, closeDrawer }: FormDistributorsProps) => {

  const { user } = useSelector((state: any) => state.authUser)

  // Hook
  const {
    createDistributor,
    isPendingCreateDis,
    isSuccessCreateDis,
    isErrorCreateDis,
  } = useDistributors()
  const { isDesktop, isLaptop, isTablet, isMobile } = useMediaQueries()

  // Valores por defecto del formulario
  const defaultValues: DistributorFormData = {
    id_be: distributor?.id_be || user.be_id,
    nombre: distributor?.nombre || '',
    descripcion: distributor?.descripcion || '',
    responsable: distributor?.responsable || '',
    correo: distributor?.correo || '',
    calle: distributor?.direccion?.calle || '',
    municipio: distributor?.direccion?.municipio || '',
    cp: distributor?.direccion?.cp || '',
    ciudad: distributor?.direccion?.ciudad || '',
    estado: distributor?.direccion?.estado || ''
  }

  // Lógica de envío específica para distribuidores
  const handleSubmitDistributor = async (formData: DistributorFormData, isEditing: boolean) => {
    if (isEditing && distributor) { // Edición
      console.log('Datos para actualizar:')
      // await updateDistributor(updateData)
    } else { // Creación
      const createData = {
        id_be: formData.id_be,// user.be_id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        responsable: formData.responsable,
        correo: formData.correo,
        calle: formData.calle,
        municipio: formData.municipio,
        cp: formData.cp,
        ciudad: formData.ciudad,
        estado: formData.estado,
      }
      // console.log('Data', createData)
      await createDistributor(createData)
    }
  }

  // Render de campos de distribuidor
  const renderDistributorFields = (control: any, errors: any) => {
    return (
      <div>
        {/* Información general */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building size={20} />
            Información del Distribuidor
          </h3>

          <div className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : isLaptop ? 'grid-cols-2' : isMobile ? 'grid-cols-1' : ''}`}>
            <Controller
              name="id_be"
              control={control}
              defaultValue={user?.be_id}
              rules={{ required: 'El ID BE es requerido' }}
              render={({ field }) => (
                <MessageToasty
                  label="ID BE"
                  disabled={user?.be_id}
                  type="text"
                  placeholder="ID del BE..."
                  icon={Building}
                  error={errors.id_be?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es requerido' }}
              render={({ field }) => (
                <MessageToasty
                  label="Nombre"
                  type="text"
                  placeholder="Nombre del distribuidor..."
                  icon={User2Icon}
                  error={errors.nombre?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="responsable"
              control={control}
              rules={{ required: 'El responsable es requerido' }}
              render={({ field }) => (
                <MessageToasty
                  label="Responsable"
                  type="text"
                  placeholder="Nombre del responsable..."
                  icon={User2Icon}
                  error={errors.responsable?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="correo"
              control={control}
              rules={{
                required: 'El correo es requerido',
                pattern: {
                  value: /^[\w\.-]+@[\w\.-]+\.\w+$/,
                  message: 'Email inválido'
                }
              }}
              render={({ field }) => (
                <MessageToasty
                  label="Correo electrónico"
                  type="email"
                  placeholder="correo@empresa.com"
                  icon={Mail}
                  error={errors.correo?.message}
                  required
                  {...field}
                />
              )}
            />

            <div className={isDesktop ? 'col-span-2' : isLaptop ? 'col-span-2' : ''}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <MessageToasty
                    label="Descripción"
                    type="text"
                    placeholder="Descripción del distribuidor..."
                    error={errors.descripcion?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <LineSeparator className="my-5" />

        {/* Información de dirección */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Dirección
          </h3>

          <div className={`grid ${isDesktop ? 'grid-cols-2' : isTablet ? 'grid-cols-1' : 'grid-cols-1'} gap-8`}>
            <div>
              <Controller
                name="estado"
                control={control}
                rules={{ required: 'El estado es requerido' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Estado"
                    type="text"
                    placeholder="Estado..."
                    icon={MapPin}
                    error={errors.estado?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="ciudad"
                control={control}
                rules={{ required: 'La ciudad es requerida' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Ciudad"
                    type="text"
                    placeholder="Ciudad..."
                    icon={MapPin}
                    error={errors.ciudad?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="municipio"
                control={control}
                rules={{ required: 'El municipio es requerido' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Municipio"
                    type="text"
                    placeholder="Municipio..."
                    icon={MapPin}
                    error={errors.municipio?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="cp"
                control={control}
                rules={{ required: 'El código postal es requerido' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Código Postal"
                    type="text"
                    placeholder="CP..."
                    error={errors.cp?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="calle"
                control={control}
                rules={{ required: 'La calle es requerida' }}
                render={({ field }) => (
                  <MessageToasty
                    label="Calle"
                    type="text"
                    placeholder="Calle y número..."
                    error={errors.calle?.message}
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
              mapId="distributor-map"
              title="Ubicación del distribuidor"
              description="Selecciona el destino del distribuidor en el mapa"
              initialAddress={distributor ? {
                estado: distributor.direccion?.estado || '',
                ciudad: distributor.direccion?.ciudad || '',
                municipio: distributor.direccion?.municipio || '',
                cp: distributor.direccion?.cp || '',
                calle: distributor.direccion?.calle || ''
              } : undefined}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Form
      title="distribuidor"
      icon={Truck}
      item={distributor ? defaultValues : null}
      enabledSection
      closeDrawer={closeDrawer}
      defaultValues={defaultValues}
      onSubmit={handleSubmitDistributor}
      isLoading={isPendingCreateDis}
      isSuccess={isSuccessCreateDis}
      isError={isErrorCreateDis}
      renderFields={renderDistributorFields}
      submitButtonText={{
        create: 'Crear distribuidor',
        edit: 'Editar distribuidor'
      }}
      submitLoadingText={{
        create: 'Creando...',
        edit: 'Editando...'
      }}
    />
  )
}

export default FormDistributors