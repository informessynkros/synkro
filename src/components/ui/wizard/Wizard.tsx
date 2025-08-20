// Validación de steps

import gsap from "gsap"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useState, type ComponentType, type ReactNode, useRef, useEffect } from "react"


interface ValidationRule {
  required?: boolean
  message?: string
  validate?: (value: any, formData: Record<string, any>) => string | null
}

interface ValidationSchema {
  [stepNumber: number]: {
    [fieldName: string]: ValidationRule
  }
}

interface StepComponentProps {
  formData: Record<string, any>
  onInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
  isLoading: boolean
}

interface WizardStep {
  stepTitle?: string
  stepDescription?: string
  title?: string
  description?: string
  component?: ComponentType<StepComponentProps>
  render?: (props: StepComponentProps) => ReactNode
  onNext?: (formData: Record<string, any>) => Promise<boolean | void> | boolean | void
  validate?: (formData: Record<string, any>) => Record<string, string>
  nextButtonText?: string
  prevButtonText?: string
  loadingText?: string
}

interface GenericWizardProps {
  steps: WizardStep[]
  onComplete?: (formData: Record<string, any>) => Promise<void> | void
  onStepChange?: (step: number, formData: Record<string, any>) => void
  initialValues?: Record<string, any>
  validationSchema?: ValidationSchema
  className?: string
  showProgress?: boolean
  animationDuration?: number
}

const Wizard = ({
  steps,
  onComplete,
  onStepChange,
  initialValues = {},
  validationSchema = {},
  className = "",
  showProgress = true,
  animationDuration = 0.6
}: GenericWizardProps) => {

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<Record<string, any>>(initialValues)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Refs para animaciones
  const progressLineRef = useRef<HTMLDivElement>(null)
  const stepIndicatorsRef = useRef<(HTMLDivElement | null)[]>([])

  // Animación cuando cambia el step
  useEffect(() => {
    if (!showProgress) return

    const tl = gsap.timeline()

    // Animar línea en progreso
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100
    tl.to(progressLineRef.current, {
      width: `${progressPercentage}%`,
      duration: animationDuration,
      ease: "power2.out"
    })

    // Animar indicadores de step
    stepIndicatorsRef.current.forEach((indicator, index) => {
      if (!indicator) return

      const stepNumber = index + 1
      const isActive = currentStep >= stepNumber

      tl.to(indicator, {
        backgroundColor: isActive ? '#2563eb' : '#e5e7eb',
        color: isActive ? '#ffffff' : '#6b7280',
        scale: isActive ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.4")
    })
  }, [currentStep, showProgress, animationDuration, steps.length])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error de validación si existe
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateCurrentStep = (): boolean => {
    const currentStepConfig = steps[currentStep - 1]
    const stepValidation = validationSchema[currentStep] || {}
    const errors: Record<string, string> = {}

    // Ejecutar validaciones del step actual
    Object.keys(stepValidation).forEach(field => {
      const rules = stepValidation[field]
      const value = formData[field]

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field] = rules.message || `${field} es requerido`
      }

      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value, formData)
        if (customError) {
          errors[field] = customError
        }
      }
    })

    // Validación personalizado del step si existe
    if (currentStepConfig.validate && typeof currentStepConfig.validate === 'function') {
      const stepErrors = currentStepConfig.validate(formData)
      Object.assign(errors, stepErrors)
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = async (): Promise<void> => {
    const currentStepConfig = steps[currentStep - 1]

    // Validat step actual
    if (!validateCurrentStep()) {
      return
    }

    // Ejecutar onNext del step actual si existe
    if (currentStepConfig.onNext) {
      setIsLoading(true)
      try {
        const canProceed = await currentStepConfig.onNext(formData)
        if (canProceed === false) {
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error('Error in onNext: ', error)
        setIsLoading(false)
        return
      }
      setIsLoading(false)
    }

    if (currentStep < steps.length) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)

      if (onStepChange) {
        onStepChange(newStep, formData)
      }
    } else {
      // Último step - completar wizard
      if (onComplete) {
        setIsLoading(true)
        try {
          setIsLoading(true)
        } catch (error) {
          console.error('Error completing wizard: ', error)
        }
        setIsLoading(false)
      }
    }
  }

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)

      // Callback de cambio de step
      if (onStepChange) {
        onStepChange(newStep, formData)
      }
    }
  }

  const currentStepConfig: WizardStep = steps[currentStep - 1]

  return (
    <div className={`max-w-4xl mx-auto p-6 bg-white ${className}`}>
      {/* Header del Wizard */}
      {(currentStepConfig.title || currentStepConfig.description) && (
        <div className="mb-8">
          {currentStepConfig.title && (
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepConfig.title}
            </h1>
          )}
          {currentStepConfig.description && (
            <p className="text-gray-600">{currentStepConfig.description}</p>
          )}
        </div>
      )}

      {/* Stepper Progress */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    ref={el => { stepIndicatorsRef.current[index] = el; }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: currentStep >= (index + 1) ? '#44556F' : '#e5e7eb',
                      color: currentStep >= (index + 1) ? '#ffffff' : '#6b7280'
                    }}
                  >
                    {currentStep > (index + 1) ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {step.stepTitle || `Paso ${index + 1}`}
                    </div>
                    {step.stepDescription && (
                      <div className="text-xs text-gray-500">{step.stepDescription}</div>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="relative w-24 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      ref={progressLineRef}
                      className="absolute top-0 left-0 h-full bg-teal-600 rounded-full"
                      style={{ width: currentStep > (index + 1) ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido del Step Actual */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-96">
        {currentStepConfig.component && (
          <currentStepConfig.component
            formData={formData}
            onInputChange={handleInputChange}
            validationErrors={validationErrors}
            isLoading={isLoading}
          />
        )}

        {currentStepConfig.render && currentStepConfig.render({
          formData,
          onInputChange: handleInputChange,
          validationErrors,
          isLoading
        })}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium transition-colors
            ${currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStepConfig.prevButtonText || 'Anterior'}
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {currentStepConfig.loadingText || 'Procesando...'}
            </>
          ) : (
            <>
              {currentStepConfig.nextButtonText || (currentStep === steps.length ? 'Finalizar' : 'Siguiente')}
              {currentStep < steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Wizard
