// Activación de cuenta

import { Controller, useForm } from "react-hook-form"
import useAuth from "../../hooks/useAuth"
import type { ActivateAccountApiProps, ActivateAccountProps } from "../../schemas/auth-schema"
import MessageToasty from "../../components/ui/messages/MessageToasty"
import { BadgeCheck, LockOpenIcon, MailOpen } from "lucide-react"
import { useSelector } from "react-redux"
import ButtonCustomLoading from "../../components/ui/button/ButtonCustomLoading"



const ActivateAccount = () => {

  // Hook
  const {
    acAccount,
    isPendingAccount,
    isErrorAccount,
    errorAccount
  } = useAuth()

  const { user } = useSelector((state: any) => state.authUser)

  const { control, handleSubmit, formState: { errors }, watch } = useForm<ActivateAccountProps>({
    defaultValues: {
      email: user?.checkpoint || '',
    }
  })

  const password_confirmed = watch("new_password")

  const activateAcSubmit = async (formData: ActivateAccountApiProps) => {
    const data = {
      email: formData.email,
      temp_password: formData.temp_password,
      new_password: formData.new_password,
    }

    await acAccount(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex">
          <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12">
            {/* <div className="mx-auto w-full max-w-sm"> */}
            <div className="mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-600">
                  Activación de cuenta
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Activa tú cuenta para poder acceder al sistema
                </p>
                {isErrorAccount && (
                  <div className="bg-red-100 text-red-600 m-4 py-2 rounded text-sm font-semibold">
                    {errorAccount?.message}
                  </div>
                )}
              </div>

              <div className="py-4 px-3">
                <form onSubmit={handleSubmit(activateAcSubmit)} className="space-y-6">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: 'Coloca un correo electrónico' }}
                    render={({ field }) => (
                      <MessageToasty
                        label="Correo electrónico"
                        type="email"
                        placeholder="example@gmail.com"
                        icon={MailOpen}
                        error={errors.email?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="temp_password"
                    control={control}
                    rules={{
                      required: "La contraseña no puede ir vacía",
                      pattern: {
                        value: /^(?!.*(?:123|abc|def))(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                        message: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número, un carácter especial y no contener secuencias como 123, abc o def",
                      },
                    }}
                    render={({ field }) => (
                      <MessageToasty
                        label="Contraseña"
                        type="password"
                        placeholder="********"
                        icon={LockOpenIcon}
                        error={errors.temp_password?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="new_password"
                    control={control}
                    rules={{
                      required: "La contraseña no puede ir vacía",
                      pattern: {
                        value: /^(?!.*(?:123|abc|def))(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                        message: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número, un carácter especial y no contener secuencias como 123, abc o def",
                      },
                    }}
                    render={({ field }) => (
                      <MessageToasty
                        label="Contraseña nueva"
                        type="password"
                        placeholder="********"
                        icon={LockOpenIcon}
                        error={errors.new_password?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="confirm_password"
                    control={control}
                    rules={{
                      required: "La contraseña no puede ir vacía",
                      validate: value => value === password_confirmed || 'Las contraseñas no coinciden'
                    }}
                    render={({ field }) => (
                      <MessageToasty
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="********"
                        icon={LockOpenIcon}
                        error={errors.confirm_password?.message}
                        {...field}
                      />
                    )}
                  />

                  <div className="flex justify-end">
                    <a
                      href="/auth/forgot-password"
                      className="text-sm text-gray-600 hover:text-gray-500 underline underline-offset-4"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <ButtonCustomLoading
                    text="Activar cuenta"
                    icon={BadgeCheck}
                    loadingText="Activando cuenta..."
                    type="submit"
                    isLoading={isPendingAccount}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivateAccount
