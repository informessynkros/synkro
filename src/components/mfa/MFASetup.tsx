// Contenido modal de SETUP MFA

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import useAuth from "../../hooks/useAuth"
import QRCode from 'qrcode'
import { ArrowLeft, BadgeCheck, Copy, CopyCheckIcon, QrCode, Shield, Smartphone } from "lucide-react"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import ButtonCustom from "../ui/button/ButtonCustom"
import { Controller, useForm } from "react-hook-form"
import type { VerifyFomrData } from "../../schemas/auth-schema"
import VerificationCodeInput from "../ui/input/VerificationCodeInput"


interface MFASetupProps {
  onComplete: () => void
}

const MFASetup = ({ onComplete }: MFASetupProps) => {

  const [qrImage, setQrImage] = useState('')
  const [step, setStep] = useState<'setup' | 'verify'>('setup')

  const { token } = useSelector((state: any) => state.authUser)
  // Hooks
  const {
    // Setup MFA
    setupMFA,
    isPendingSetupMFA,
    setupMFAData,
    verifyMFAMutation,

    // Verify MFA
    verifyMFA,
    isPendingVerifyMFA,
  } = useAuth()

  const { control, handleSubmit, formState: { errors }, watch } = useForm<VerifyFomrData>({
    defaultValues: {
      confirmationCode: ''
    }
  })

  const confirmationCode = watch('confirmationCode')

  // Función para iniciar setup MFA
  const handleStartSetup = async () => {
    if (token) { // Si hay token
      await setupMFA(token)
    }
  }

  // Función para verificar código
  const handleVerifyCode = async (data: VerifyFomrData) => {
    if (token && data.confirmationCode.length === 6) {
      await verifyMFA({ token, code: data.confirmationCode })
      if (verifyMFAMutation.data?.status === 200) {
        onComplete()
      }
    }
  }

  // Generamos el QR
  useEffect(() => {
    if (setupMFAData?.qr_uri) { // Si hay qr generado
      QRCode.toDataURL(setupMFAData.qr_uri)
        .then(url => setQrImage(url))
        .catch(err => console.warn(err))
    }
  }, [setupMFAData])

  // Manejar los renderizados en el paso
  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <QrCode className="mx-auto h-16 text-blu-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700"> Configurar autenticación de dos factores </h2>
          <p className="text-gray-600 mt-2">Mejora la seguridad de tu cuenta con MFA</p>
        </div>

        {!setupMFAData ? (
          <ButtonCustomLoading
            text="Iniciar configuración"
            icon={BadgeCheck}
            isLoading={isPendingSetupMFA}
            loadingText="Configurando..."
            large="w-auto"
            onClick={handleStartSetup}
          />
        ) : (
          // Mostrar QR y opciones
          <div className="space-y-4">
            {qrImage && (
              <div className="text-center">
                <img src={qrImage} alt="QR Code" className="mx-auto mb-4" />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2"> Clave manual: </p>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                {setupMFAData.manual_entry_key}
              </code>
              <button
                className="ml-2 text-sky-600 hover:text-sky-700"
              >
                <Copy size={16} />
              </button>
            </div>

            <ButtonCustom
              text="Ya escaneé el código"
              onClick={() => setStep('verify')}
              icon={CopyCheckIcon}
              large="w-auto"
              className="mt-4"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center relative">
        <button
          onClick={() => setStep('setup')}
          className="absolute left-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer hover:bg-gray-100 rounded"
        >
          <ArrowLeft size={20} />
        </button>

        <Shield className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Verificar código MFA
        </h2>
        <p className="text-gray-600 mt-2">
          Ingresa el código de 6 dígitos de tu app autenticadora
        </p>
      </div>

      {/* Instrucciones */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Smartphone className="w-5 h-5 text-sky-600 mt-0.5" />
          <div className="text-sm text-sky-800">
            <p className="font-medium mb-1">¿Dónde encuentro el código?</p>
            <p>Abre tu app autenticadora (Google Authenticator, Authy, etc.) y busca la entrada para <strong>Synkros</strong>.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleVerifyCode)} className="space-y-4">
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

        <ButtonCustomLoading
          text="Activar MFA"
          icon={BadgeCheck}
          isLoading={isPendingVerifyMFA}
          loadingText="Verificando código..."
          large="w-auto"
          type="submit"
          className={confirmationCode.length === 6
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        />
      </form>

      {/* Footer informativo */}
      <div className="text-center text-xs text-gray-500">
        <p>Una vez activado, necesitarás tu código MFA en cada inicio de sesión</p>
      </div>
    </div>
  )
}

export default MFASetup
