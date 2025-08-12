// Endpoints de usuarios

import { handleApiError } from "../helpers/errorHandler"
import type { UserDataProps, UserDataUpdateProps } from "../schemas/users-schema"
import api from "../utils/axios"

// ------------------------- Usuarios -------------------------

// - Obtención de usuarios
export const getUsers = async () => {
  try {
    const { data } = await api.get('/get-users')
    return data.users
  } catch (error) {
    handleApiError(error)
  }
}


// - Creación de usuarios
export const createUser = async (dataUser: UserDataProps) => {
  try {
    const { data } = await api.post('/create-user', dataUser)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// - Actualización de usuarios
export const updateUser = async (dataUser: UserDataUpdateProps) => {
  try {
    const { data } = await api.put('/updated-users', dataUser)
    return data
  } catch (error) {
    handleApiError(error)
  }
}


// ------------------------- Roles -------------------------

// - Obtención de roles
export const getRoles = async () => {
  try {
    const { data } = await api.get('/get-roles')
    return data.roles
  } catch (error) {
    handleApiError(error)
  }
}


// ------------------------- mvnos -------------------------

// - Obtención de mvnos
export const getMvnos = async () => {
  try {
    const { data } = await api.get('/get-mvnos')
    return data.mvnos
  } catch (error) {
    handleApiError(error)
  }
}
