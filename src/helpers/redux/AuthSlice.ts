import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface AuthStateProps {
  user: any | null
  token: any | null
  isAuthenticated: boolean
}

const loadAuthState = (): AuthStateProps => {
  try {
    const serializedAuth = localStorage.getItem('authUser')
    if (serializedAuth === null) {
      return {
        user: null,
        token: null,
        isAuthenticated: false
      }
    }
    return JSON.parse(serializedAuth)
  } catch (error) {
    return {
      user: null,
      token: null,
      isAuthenticated: false
    }
  }
}

// Función que guarda la información del usuario
const saveAuthState = (state: any) => {
  try {
    const serializedAuth = JSON.stringify(state)
    localStorage.setItem('authUser', serializedAuth)
  } catch (error) {
    return undefined
  }
}

// Datos iniciales
const initialState = loadAuthState() || {
  user: null,
  token: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: { // Funciones
    setCredentials: (state, action: PayloadAction<{ user: any, token: any }>) => {
      const { token, user } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      saveAuthState(state)
    },
    getCheckpoint: (state, action: PayloadAction<{ checkpoint: string }>) => {
      const { checkpoint } = action.payload
      state.user = { checkpoint }
      state.token = null
      state.isAuthenticated = false
      saveAuthState(state)
    }
  }
})


export const { setCredentials, getCheckpoint } = authSlice.actions
export default authSlice.reducer
