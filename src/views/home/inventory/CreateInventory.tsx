// Vista para crear un inventario

import { Box, PersonStanding } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import MessageToasty from "../../../components/messages/MessageToasty"


const CreateInventory = () => {

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
      tipoInventario: 0,
      descripcion: '',
      ubicacion: ''
    }),
    []
  )

  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues })

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
        <form action="" onSubmit={handleSubmit(handleDataSubmit)}>
          <Controller
            name="nombre"
            control={control}
            rules={{
              required: 'Coloca un correo electrónico'
            }}
            render={({ field }) => (
              <MessageToasty
                label="Correo electrónico"
                type="email"
                placeholder="example@gmail.com"
                icon={PersonStanding}
                error={errors.nombre?.message}
                {...field}
              />
            )}
          />
        </form>
      </div>
    </>
  )
}

export default CreateInventory
