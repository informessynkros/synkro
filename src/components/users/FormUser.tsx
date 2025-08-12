// Componente que maneja la edición, detalles de usuario

import { CircleX, Mail, NotebookTabs, Phone, SaveAll, User2Icon, Users2 } from "lucide-react"
import type { Mvnos, Roles, User, UserDataProps, UserDataUpdateProps } from "../../schemas/users-schema"
import Section from "../ui/section/Section"
import { Controller, useForm } from "react-hook-form"
import { useMvnos, useRoles, useUsers } from "../../hooks/useUsers"
import useMediaQueries from "../../hooks/useMediaQueries"
import MessageToasty from "../ui/messages/MessageToasty"
import SelectMultiple from "../ui/select/SelectMultiple"
import { useEffect, useState } from "react"
import Switch from "../ui/switch/Switch"
import ButtonCustom from "../ui/button/ButtonCustom"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import { useSelector } from "react-redux"


interface FormUser {
  user: User
  closeDrawer?: () => void
}

const FormUser = ({ user, closeDrawer }: FormUser) => {

  // Hooks
  const {
    // Creación de usuario
    createUser,
    isPendingCreate,
    isErrorCreate,
    isSuccessCreate,

    // Actualización de usuarios
    updateUser,
    isPendingUpdate,
    isErrorUpdate,
    isSuccessUpdate
  } = useUsers()
  const { mvnos } = useMvnos()
  const { roles } = useRoles()
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  // Redux
  const { user: usr } = useSelector((state: any) => state.authUser)

  // Estados
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedMvno, setSelectedMvno] = useState<string | null>(null)
  const [isMFA, setIsMFA] = useState(user?.mfa_required === true)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<UserDataProps>()

  // Resetear los campos
  useEffect(() => {
    reset({
      name: user?.name || '',
      checkpoint: user?.checkpoint || '',
      phone_number: user?.phone_number || '',
      mvno_id: user?.mvno_id || '',
      role_id: user?.role_id || '',
    })

    const mfaValue = user?.mfa_required === true
    setIsMFA(mfaValue)
  }, [user, reset])

  // Actualización de usuario
  const handleSubmitUpdate = async (formData: UserDataUpdateProps) => {
    const data = {
      id_user: user.id_user, // formData.id_user,
      name: formData.name,
      phone_number: formData.phone_number,
      mfa_required: isMFA,
      updated_by: usr.checkpoint,
      mvno_id: formData.mvno_id, // selectedMvno!!,
      role_id: formData.role_id // selectedRole!!
    }
    // console.log(data)
    await updateUser(data)
  }


  // Creación de usuario
  const handleSubmitCreate = async (formData: UserDataProps) => {
    const data = {
      name: formData.name,
      checkpoint: formData.checkpoint,
      phone_number: formData.phone_number,
      mvno_id: selectedMvno!!,
      role_id: selectedRole!!,
      mfa_required: isMFA,
      created_by: usr.checkpoint
    }
    // console.log(data)
    await createUser(data)
  }

  const handleSubmitData = (formData: any) => {
    if (user) { // Edición
      handleSubmitUpdate(formData)
    } else { // Creación
      handleSubmitCreate(formData)
    }
  }

  useEffect(() => {
    if (isSuccessCreate && !isErrorCreate || isSuccessUpdate && !isErrorUpdate) {
      closeDrawer?.()
    }
  }, [
    isSuccessCreate,
    isErrorCreate,
    isSuccessUpdate,
    isErrorUpdate,
    closeDrawer
  ])

  return (
    <>
      <Section
        text={`${user ? 'Edición de usuario' : 'Creación de usuario'}`}
        icon={Users2}
      />

      <div className="shadow-md p-6 rounded-md mt-6">
        <form
          onSubmit={handleSubmit(handleSubmitData)}
          className="flex flex-col"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-5 text-gray-600">
                <NotebookTabs />
                <h1 className={`font-semibold ${isDesktop ? 'text-2xl' : isTablet ? 'text-xl' : isMobile ? 'text-base' : 'font-normal text-base'}`}> Información general </h1>
              </div>
              <div>
                <Switch
                  label="MFA"
                  checked={isMFA}
                  onChange={setIsMFA}
                  color="#059669"
                  size="sm"
                  id="mfa"
                />
              </div>
            </div>

            <div className={`grid ${isDesktop ? 'grid-cols-3 gap-x-8' : isTablet ? 'grid-cols-2 gap-x-6' : isMobile ? 'grid-cols-1' : ''}`}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'El nombre es requerido'
                }}
                render={({ field }) => (
                  <MessageToasty
                    label="Nombre"
                    type="text"
                    placeholder="Nombre de usuario..."
                    icon={User2Icon}
                    error={errors.name?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="checkpoint"
                control={control}
                rules={{
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[\w\.-]+@[\w\.-]+\.\w+$/,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <MessageToasty
                    label="Correo electrónico"
                    type='email'
                    icon={Mail}
                    disabled={user ? true : false}
                    placeholder="john.doe@example.com"
                    error={errors.checkpoint?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="phone_number"
                control={control}
                render={({ field }) => (
                  <MessageToasty
                    label="Teléfono"
                    type='text'
                    icon={Phone}
                    {...field}
                  />
                )}
              />

              {/* Combos */}
              <Controller
                name="role_id"
                control={control}
                rules={{
                  required: 'Por favor, selecciona un rol'
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <SelectMultiple
                    options={roles}
                    initialValue={value ? roles.find((rol: Roles) => rol.id_role === value) : null}
                    onSelect={selected => {
                      if (Array.isArray(selected) && selected.length > 0) {
                        onChange(selected[0].id_role)
                        setSelectedRole(selected[0].id_role)
                      } else if (selected && typeof selected === 'object' && 'id_role' in selected) {
                        onChange(selected.id_role)
                        setSelectedRole(selected.id_role)
                      } else {
                        onChange("")
                        setSelectedRole(null)
                      }
                    }}
                    placeholder="Selecciona el rol"
                    label="Roles"
                    labelKey="nombre"
                    valueKey='id_role'
                    extraInfo={rol => rol.id_role}
                    multiple={false}
                    error={error?.message}
                    required
                  />
                )}
              />

              {/* Combos */}
              <Controller
                name="mvno_id"
                control={control}
                rules={{
                  required: 'Por favor, selecciona un mvno'
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <SelectMultiple
                    options={mvnos}
                    initialValue={value ? mvnos.find((mvno: Mvnos) => mvno.mvno_id === value) : null}
                    onSelect={selected => {
                      if (Array.isArray(selected) && selected.length > 0) {
                        onChange(selected[0].mvno_id)
                        setSelectedMvno(selected[0].mvno_id)
                      } else if (selected && typeof selected === 'object' && 'mvno_id' in selected) {
                        onChange(selected.mvno_id)
                        setSelectedMvno(selected.mvno_id)
                      } else {
                        onChange("")
                        setSelectedMvno(null)
                      }
                    }}
                    placeholder="Selecciona mvno"
                    label="Mvno"
                    labelKey="nombre"
                    valueKey='mvno_id'
                    extraInfo={mvno => mvno.mvno_id}
                    multiple={false}
                    error={error?.message}
                    required
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <ButtonCustom
              text="Cancelar"
              icon={CircleX}
              onClick={closeDrawer}
            />

            <ButtonCustomLoading
              text={`${user ? 'Editar usuario' : 'Crear usuario'}`}
              loadingText={`${user ? 'Editando...' : 'Creando...'}`}
              isLoading={isPendingCreate || isPendingUpdate}
              icon={SaveAll}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default FormUser
