// Wrapper del wizard para carga de inventario - CON HOOK CENTRALIZADO

import { useState, useEffect, useRef } from "react"
import { CheckCircle } from "lucide-react"
import { gsap } from "gsap"
import ChargeInventory from "./ChargeInventory"
import PreviewStep from "./PreviewStep"
import { useChargeInventory } from "../../hooks/useInventories"
import type { InventoryUploadData } from "../../schemas/inventory-schema"

const InventoryWizard = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<InventoryUploadData | null>(null)
  const [validationData, setValidationData] = useState<any>(null)

  const {
    // Para validación
    validateInv,
    isPendingValidateInv,
    isSuccessValidateInv,
    isErrorValidateInv,
    validationData: hookValidationData,

    // Para carga final
    loadInventory,
    isPendingloadInv,
    isSuccessloadInv,
    isErrorloadInv,
  } = useChargeInventory()

  // Refs para animaciones GSAP
  const progressLineRef = useRef<HTMLDivElement>(null)
  const stepIndicatorsRef = useRef<(HTMLDivElement | null)[]>([])

  const steps = [
    {
      number: 1,
      title: 'Información General',
      description: 'Datos básicos del inventario'
    },
    {
      number: 2,
      title: 'Confirmación',
      description: 'Revisar y confirmar'
    }
  ]

  useEffect(() => {
    if (isSuccessValidateInv && hookValidationData && formData) {
      // Si la validación fue exitosa, ir al siguiente step
      if (hookValidationData.valid) {
        setValidationData(hookValidationData)
        setCurrentStep(2)
      }
      // Si hay errores, quedarse en el step actual
    }
  }, [isSuccessValidateInv, hookValidationData, formData])

  // Animación cuando cambia el step
  useEffect(() => {
    const tl = gsap.timeline()

    // Animar línea de progreso
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100
    tl.to(progressLineRef.current, {
      width: `${progressPercentage}%`,
      duration: 0.6,
      ease: "power2.out"
    })

    // Animar indicadores de step
    stepIndicatorsRef.current.forEach((indicator, index) => {
      if (!indicator) return

      const stepNumber = index + 1
      const isActive = currentStep >= stepNumber

      tl.to(indicator, {
        backgroundColor: isActive ? '#44556F' : '#e5e7eb',
        color: isActive ? '#ffffff' : '#6b7280',
        scale: isActive ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.4")
    })

  }, [currentStep, steps.length])

  const handleNext = (data: InventoryUploadData) => {
    setFormData(data)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleEdit = () => {
    setCurrentStep(1)
  }

  // Scroll suave al cambiar de step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className="mx-auto p-6 bg-white min-h-scree rounded-lg shadow">

      {/* Header del Wizard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-600 mb-2">
          Asistente de Carga de Inventario
        </h1>
        <p className="text-gray-600">
          Sigue estos pasos para cargar un nuevo inventario al almacén de forma segura
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-center space-x-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  ref={el => {
                    stepIndicatorsRef.current[index] = el
                  }}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2"
                  style={{
                    backgroundColor: currentStep >= step.number ? '#44556F' : '#e5e7eb',
                    color: currentStep >= step.number ? '#ffffff' : '#6b7280',
                    borderColor: currentStep >= step.number ? '#44556F' : '#e5e7eb'
                  }}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-3 text-center max-w-32">
                  <div className="text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="relative w-32 h-2 mx-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    ref={index === 0 ? progressLineRef : null}
                    className="absolute top-0 left-0 h-full bg-[#44556F] rounded-full transition-all duration-600"
                    style={{ width: currentStep > step.number ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del Step Actual */}
      <div className="transition-all duration-500 ease-in-out">
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <ChargeInventory
              onNext={handleNext}
              wizardMode={true}
              validateInv={validateInv}
              isPendingValidateInv={isPendingValidateInv}
              isSuccessValidateInv={isSuccessValidateInv}
              isErrorValidateInv={isErrorValidateInv}
              validationData={hookValidationData}
            />
          </div>
        )}

        {currentStep === 2 && formData && (
          <div className="animate-fade-in">
            <PreviewStep
              formData={formData}
              validationData={validationData}
              onBack={handleBack}
              onEdit={handleEdit}
              loadInventory={loadInventory}
              isPendingloadInv={isPendingloadInv}
              isSuccessloadInv={isSuccessloadInv}
              isErrorloadInv={isErrorloadInv}
            />
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-sky-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-sky-800">
                Información importante
              </h3>
              <p className="mt-1 text-sm text-sky-700">
                Asegúrate de que el archivo CSV tenga el formato correcto antes de continuar.
                Una vez confirmada la carga, el proceso no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryWizard