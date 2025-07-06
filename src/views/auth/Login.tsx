// Vista de autenticacion

import { Controller, useForm } from "react-hook-form"
import type { AuthProps } from "../../schemas/auth-schema"
import MessageToasty from "../../components/ui/messages/MessageToasty"
import { LockIcon, LogInIcon, MailOpen } from "lucide-react"
import ButtonCustomLoading from "../../components/ui/button/ButtonCustomLoading"
import { Link } from "react-router-dom"


const Login = () => {

  const { control, handleSubmit, formState: { errors } } = useForm<AuthProps>()

  // Envío de información
  const handleDataAuth = async (formData: AuthProps) => {
    const data = {
      mail: formData.mail,
      checkpoint: formData.checkpoint
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

          <Controller
            name="checkpoint"
            control={control}
            rules={{
              required: "La contraseña no puede ir vacía",
              pattern: {
                value:
                  /^(?!.*(?:123|abc|def))(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                message: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número, un carácter especial y no contener secuencias como 123, abc o def",
              },
            }}
            render={({ field }) => (
              <MessageToasty
                label="Contraseña"
                type="password"
                placeholder="********"
                icon={LockIcon}
                error={errors.checkpoint?.message}
                {...field}
              />
            )}
          />

          <Link
            to='/auth/forgot-password'
            className="text-sm py-3 flex justify-end underline underline-offset-4 text-gray-400">
            Forgot password?
          </Link>

          <ButtonCustomLoading
            text="Sign In"
            icon={LogInIcon}
            loadingText="Sign in..."
            type="submit"
            isLoading={false}
          />
        </form>
      </div>
    </div>
  )
}

export default Login
