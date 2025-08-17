// Formulario de usuarios

import { useState } from "react"
import { useMvnos, useRoles, useUsers } from "../../hooks/useUsers"
import type { Mvnos, Roles, User, UserDataProps } from "../../schemas/users-schema"
import { useSelector } from "react-redux"
import { MailOpen, PhoneForwarded, User2, User2Icon, UserCog2 } from "lucide-react"
import useMediaQueries from "../../hooks/useMediaQueries"
import { Controller } from "react-hook-form"
import MessageToasty from "../ui/messages/MessageToasty"
import SelectMultiple from "../ui/select/SelectMultiple"
import Form from "../ui/form/Form"
import Switch from "../ui/switch/Switch"


interface FormUserProps {
  user: User
  closeDrawer: () => void
}

const FormUser = ({ user, closeDrawer }: FormUserProps) => {

  // Hook
  const {
    // Crear usuario
    createUser,
    isPendingCreate,
    isSuccessCreate,
    isErrorCreate,

    // Editar usuario
    updateUser,
    isPendingUpdate,
    isSuccessUpdate,
    isErrorUpdate
  } = useUsers()
  const { roles } = useRoles()
  const { mvnos } = useMvnos()
  const { isDesktop, isLaptop, isMobile } = useMediaQueries()

  const { user: usr } = useSelector((state: any) => state.authUser)

  // Estados
  const [isMFA, setIsMFA] = useState(user?.mfa_required === true)

  // Valores por defecto del formulario
  const defaultValues: UserDataProps = {
    name: user?.name || '',
    checkpoint: user?.checkpoint || '',
    phone_number: user?.phone_number || '',
    mvno_id: user?.mvno_id || '',
    role_id: user?.role_id || '',
    mfa_required: user?.mfa_required || false
  }

  // Función de envío específica para usuarios
  const handleSubmitUser = async (formData: UserDataProps, isEditing: boolean) => {
    if (isEditing && user) { // Edición
      const updateData = {
        id_user: user.id_user, // formData.id_user,
        name: formData.name,
        phone_number: formData.phone_number,
        mfa_required: isMFA,
        updated_by: usr.checkpoint,
        mvno_id: formData.mvno_id, // selectedMvno!!,
        role_id: formData.role_id // selectedRole!!
      }
      // console.log(data)
      await updateUser(updateData)
    } else { // Creación
      const createData = {
        name: formData.name,
        checkpoint: formData.checkpoint,
        phone_number: formData.phone_number,
        mvno_id: formData.mvno_id,// selectedMvno!!,
        role_id: formData.role_id,// selectedRole!!,
        mfa_required: isMFA,
        created_by: usr.checkpoint
      }
      // console.log(data)
      await createUser(createData)
    }
  }

  // Render de campos de usuarios
  const renderUserFields = (control: any, errors: any) => {
    return (
      <div>
        {/* Información general */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-5 text-gray-600">
              <UserCog2 size={20} />
              Información del usuario
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
          <div className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : isLaptop ? 'grid-cols-2' : isMobile ? 'grid-cols-1' : ''}`}>
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
                  icon={MailOpen}
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
                  icon={PhoneForwarded}
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
                    } else if (selected && typeof selected === 'object' && 'id_role' in selected) {
                      onChange(selected.id_role)
                    } else {
                      onChange("")
                    }
                  }}
                  placeholder="Selecciona el rol"
                  label="Roles"
                  labelKey="name"
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
                    } else if (selected && typeof selected === 'object' && 'mvno_id' in selected) {
                      onChange(selected.mvno_id)
                    } else {
                      onChange("")
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
      </div>
    )
  }
  return (
    <Form
      title="usuario"
      icon={User2}
      item={user ? defaultValues : null}
      closeDrawer={closeDrawer}
      defaultValues={defaultValues}
      onSubmit={handleSubmitUser}
      isLoading={isPendingCreate || isPendingUpdate}
      isSuccess={isSuccessCreate || isSuccessUpdate}
      isError={isErrorCreate || isErrorUpdate}
      renderFields={renderUserFields}
      submitButtonText={{
        create: 'Crear usuario',
        edit: 'Editar usuario'
      }}
      submitLoadingText={{
        create: 'Creando...',
        edit: 'Editando...'
      }}
    />
  )
}

export default FormUser