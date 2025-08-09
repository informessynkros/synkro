import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface AuthStateProps {
  user: any | null
  token: string | null
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
    setCredentials: (state, action: PayloadAction<{ user: any, token: string }>) => {
      const { token, user } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      saveAuthState(state)
    }
  }
})


export const { setCredentials } = authSlice.actions
export default authSlice.reducer
