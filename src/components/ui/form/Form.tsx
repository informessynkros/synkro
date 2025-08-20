// Formulario

import { CircleX, SaveAll, type LucideIcon } from "lucide-react"
import { useEffect, type ReactNode } from "react"
import { useForm, type Control, type FieldValues, FormProvider } from "react-hook-form"
import Section from "../section/Section"
import ButtonCustom from "../button/ButtonCustom"
import ButtonCustomLoading from "../button/ButtonCustomLoading"


interface FormConfigProps<T extends FieldValues> {
  // Configuración básica
  title: string
  icon: LucideIcon
  // Props del item (para edición) o null (para creación)
  item?: T | null
  closeDrawer?: () => void
  // Configuración de formulario
  defaultValues: Partial<T>
  validationRules?: Record<string, any>
  // Funciones de negocio específicas
  onSubmit: (data: T, isEditing: boolean) => Promise<void>
  // Estados de loading
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  // Render function para los campos del formulario
  renderFields: (control: Control<T>, errors: any, setValue?: any) => ReactNode
  // Configuración de botones (opcional)
  submitButtonText?: {
    create: string
    edit: string
  }
  submitLoadingText?: {
    create: string
    edit: string
  }
}

function Form<T extends FieldValues>({
  title,
  icon,
  item,
  closeDrawer,
  defaultValues,
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  renderFields,
  submitButtonText = {
    create: 'Crear',
    edit: 'Editar'
  },
  submitLoadingText = {
    create: 'Creando...',
    edit: 'Editando...'
  }
}: FormConfigProps<T>) {

  const isEditing = !!item

  const methods = useForm<T>({
    defaultValues: defaultValues as any
  })

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
  } = methods

  // Reset form cuando los items cambian
  useEffect(() => {
    if (item) {
      reset(item as any)
    } else {
      reset(defaultValues as any)
    }
  }, [item, reset, defaultValues])

  // Cierra el drawer cuando isSuccess es true
  useEffect(() => {
    if (isSuccess && !isError) {
      closeDrawer?.()
    }
  }, [isSuccess, isError, closeDrawer])

  const handleFormSubmit = async (data: T) => {
    await onSubmit(data, isEditing)
  }

  return (
    <FormProvider {...methods}>
      <Section
        text={`${isEditing ? 'Edición' : 'Creación'} de ${title.toLowerCase()}`}
        icon={icon}
      />

      <div className="shadow-md p-6 rounded-md mt-6 bg-white">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col"
        >
          {/* Renderizamos los campos específicos */}
          {renderFields(control, errors, setValue)}

          {/* Boton de acción */}
          <div className="flex justify-end gap-4 mt-6">
            <ButtonCustom
              text="Cancelar"
              icon={CircleX}
              onClick={closeDrawer}
            />

            <ButtonCustomLoading
              text={isEditing ? submitButtonText.edit : submitButtonText.create}
              loadingText={isEditing ? submitLoadingText.edit : submitLoadingText.create}
              isLoading={isLoading}
              icon={SaveAll}
              type="submit"
            />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default Form
