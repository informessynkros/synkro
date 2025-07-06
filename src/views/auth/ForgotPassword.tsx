// Vista de olvidaste password

import { MailOpen, Send } from "lucide-react"
import ButtonCustomLoading from "../../components/ui/button/ButtonCustomLoading"
import { Controller, useForm } from "react-hook-form"
import type { ForgoPassProps } from "../../schemas/forgoPass-schema"
import MessageToasty from "../../components/ui/messages/MessageToasty"
import { Link } from "react-router-dom"



const ForgotPassword = () => {

  const { control, handleSubmit, formState: { errors } } = useForm<ForgoPassProps>()

  // Envío de información
  const handleDataAuth = async (formData: ForgoPassProps) => {
    const data = {
      mail: formData.mail
    }
    console.log('Data envíada al backend: ', data)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-3">
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center my-8 text-2xl font-bold">
          <div className="flex gap-3 items-center">
            <span>@</span>
            <span>Synkros</span>
          </div>
        </div>

        <div className="text-3xl font-semibold text-[#333]">
          Bienvenido a Synkros
        </div>
        <div className="text-sm text-[#777] pt-3">
          Inicia sesión para poder acceder al sistema
        </div>
      </div>
      <div className="w-full max-w-xl md:w-1/2 bg-white py-14 px-8 rounded-xl shadow-md mt-7">
        <form onSubmit={handleSubmit(handleDataAuth)}>
          <Controller
            name="mail"
            control={control}
            rules={{ required: 'Coloca un correo electrónico' }}
            render={({ field }) => (
              <MessageToasty
                label="Correo electrónico"
                type="email"
                placeholder="example@gmail.com"
                icon={MailOpen}
                error={errors.mail?.message}
                {...field}
              />
            )}
          />

          <ButtonCustomLoading
            text="Send"
            icon={Send}
            loadingText="Sending..."
            type="submit"
            isLoading={false}
          />

          <div className="flex justify-center pt-7 gap-1.5">
            <span className="text-gray-400"> Cuentas con sesión? </span>
            <Link
              to='/auth/login'
              className="underline underline-offset-4 text-[#333]"> Iniciar sesión </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
