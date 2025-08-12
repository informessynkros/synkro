// Vista de autenticacion

import { Controller, useForm } from "react-hook-form"
import type { AuthDataProps } from "../../schemas/auth-schema"
import MessageToasty from "../../components/ui/messages/MessageToasty"
import { LockIcon, LogIn, Package, Truck } from "lucide-react"
import ButtonCustomLoading from "../../components/ui/button/ButtonCustomLoading"
import useAuth from "../../hooks/useAuth"
import MFASetup from "../../components/mfa/MFASetup"
import MFAModal from "../../components/mfa/MFAModal"
import MFAVerifyLogin from "../../components/mfa/MFAVerifyLogin"
import { useDispatch, useSelector } from "react-redux"
import { closeMfaSetupModal, closeMfaVerifyModal } from "../../helpers/redux/AuthSlice"


const Login = () => {

  // Hook
  const {
    login,
    isPendingLogin
  } = useAuth()

  const dispatch = useDispatch()

  const showMfaSetupModal = useSelector((state: any) => state.authUser.showMfaSetupModal)
  const showMfaVerifyModal = useSelector((state: any) => state.authUser.showMfaVerifyModal)

  const { control, handleSubmit, formState: { errors } } = useForm<AuthDataProps>()

  const handleCloseMfaSetup = () => {
    dispatch(closeMfaSetupModal())
  }

  const handleCloseMfaVerify = () => {
    dispatch(closeMfaVerifyModal())
  }

  // Envío de información
  const handleDataAuth = async (formData: AuthDataProps) => {
    const data = {
      checkpoint: formData.checkpoint,
      cipher: formData.cipher
    }

    await login(data)
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12">
              {/* <div className="mx-auto w-full max-w-sm"> */}
              <div className="mx-auto w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-600">
                    Bienvenido a Synkros
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Inicia sesión para poder acceder al sistema
                  </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-200">
                  <form onSubmit={handleSubmit(handleDataAuth)} className="space-y-6">
                    <Controller
                      name="checkpoint"
                      control={control}
                      rules={{ required: 'Coloca un correo electrónico' }}
                      render={({ field }) => (
                        <MessageToasty
                          label="Correo electrónico"
                          type="email"
                          placeholder="example@gmail.com"
                          icon={LogIn}
                          disabled={isPendingLogin}
                          error={errors.checkpoint?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="cipher"
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
                          icon={LockIcon}
                          disabled={isPendingLogin}
                          error={errors.cipher?.message}
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
                      text="Iniciar Sesión"
                      icon={LogIn}
                      loadingText="Iniciando sesión..."
                      type="submit"
                      isLoading={isPendingLogin}
                    />
                  </form>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative flex-1 min-h-[600px]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('/delivery_truck.svg')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-gray-800/20"></div>

                <div className="relative h-full flex flex-col justify-center items-center text-white px-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center">
                    <div className="flex justify-center space-x-4 mb-6">
                      <div className="bg-slate-100 p-3 rounded-full">
                        <Truck className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <Package className="w-6 h-6 text-green-600" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-white">
                      ¡Accede al sistema!
                    </h3>
                    <p className="text-lg text-white/90 leading-relaxed mb-6">
                      Revisa la información de tus almacenes, gestiona tu inventario y optimiza tu logística desde un solo lugar.
                    </p>

                    <div className="space-y-3 text-sm text-white/80">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                        <span>Gestión completa de inventario</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Seguimiento en tiempo real</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Reportes y análisis avanzados</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMfaSetupModal && (
        <MFAModal
          isOpen={showMfaSetupModal}
          onClose={handleCloseMfaSetup}
          title="Configuración MFA"
        >
          <MFASetup onComplete={handleCloseMfaSetup} />
        </MFAModal>
      )}

      {showMfaVerifyModal && (
        <MFAModal
          isOpen={showMfaVerifyModal}
          onClose={handleCloseMfaVerify}
          title="Verificación MFA"
        >
          <MFAVerifyLogin onComplete={handleCloseMfaVerify} />
        </MFAModal>
      )}
    </>
  )
}

export default Login
