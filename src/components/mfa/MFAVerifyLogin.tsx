// Verificación de login con MFA

import { useForm, Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import useAuth from "../../hooks/useAuth"
import { Shield, Smartphone, BadgeCheck } from "lucide-react"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import VerificationCodeInput from "../ui/input/VerificationCodeInput"


interface MFAVerifyLoginProps {
  onComplete: () => void
}

interface VerifyLoginFormData {
  confirmationCode: string
}

const MFAVerifyLogin = ({ onComplete }: MFAVerifyLoginProps) => {
  const { mfaToken } = useSelector((state: any) => state.authUser)

  const {
    verifyLoginMFA,
    isPendingVerifyLoginMFA,
  } = useAuth()

  // Form para la verificación
  const { control, handleSubmit, formState: { errors } } = useForm<VerifyLoginFormData>({
    defaultValues: {
      confirmationCode: ''
    }
  })

  // Función para verificar código de login
  const handleVerifyLoginCode = async (data: VerifyLoginFormData) => {
    if (mfaToken && data.confirmationCode.length === 6) {
      await verifyLoginMFA({
        mfa_token: mfaToken,
        code: data.confirmationCode
      })

      onComplete()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Shield className="mx-auto h-16 w-16 text-sky-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Verificación de seguridad
        </h2>
        <p className="text-gray-600 mt-2">
          Ingresa tu código de autenticación para continuar
        </p>
      </div>

      {/* Instrucciones */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Smartphone className="w-5 h-5 text-sky-600 mt-0.5" />
          <div className="text-sm text-sky-800">
            <p className="font-medium mb-1">Tu código de seguridad</p>
            <p>
              Abre tu app autenticadora y busca el código de 6 dígitos para
              <strong> Synkros</strong>.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleVerifyLoginCode)} className="space-y-6">
        <Controller
          name="confirmationCode"
          control={control}
          rules={{
            required: 'El código de verificación es requerido',
            validate: value => value.length === 6 || 'El código debe tener 6 dígitos'
          }}
          render={({ field }) => (
            <VerificationCodeInput
              onChange={field.onChange}
              error={errors.confirmationCode?.message}
            />
          )}
        />

        {/* Botón de verificar */}
        <ButtonCustomLoading
          text="Iniciar sesión"
          icon={BadgeCheck}
          isLoading={isPendingVerifyLoginMFA}
          loadingText="Verificando..."
          type="submit"
        />
      </form>

      {/* Footer informativo */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="text-center text-xs text-gray-600">
          <p className="font-medium mb-1">¿Problemas con tu código?</p>
          <p>Asegúrate de que la hora en tu dispositivo esté sincronizada</p>
        </div>
      </div>
    </div>
  )
}

export default MFAVerifyLogin
