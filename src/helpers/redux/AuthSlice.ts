import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface AuthStateProps {
  user: any | null
  token: any | null
  mfaToken: string | null
  isAuthenticated: boolean
}

const loadAuthState = (): AuthStateProps => {
  try {
    const serializedAuth = localStorage.getItem('authUser')
    if (serializedAuth === null) {
      return {
        user: null,
        token: null,
        mfaToken: null,
        isAuthenticated: false
      }
    }
    return JSON.parse(serializedAuth)
  } catch (error) {
    return {
      user: null,
      token: null,
      mfaToken: null,
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
  mfaToken: null,
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
    },
    setMfaToken: (state, action: PayloadAction<{ mfa_token: string | null }>) => {
      const { mfa_token } = action.payload
      state.mfaToken = mfa_token
      saveAuthState(state)
    },
    clearMfaToken: (state) => {
      state.mfaToken = null
      saveAuthState(state)
    },
    cleanCredentials: state => {
      state.user = null
      state.mfaToken = null
      state.mfaToken = null
      state.isAuthenticated = false
      localStorage.removeItem('authUser')
    }
  }
})


export const { setCredentials, getCheckpoint, setMfaToken, clearMfaToken, cleanCredentials } = authSlice.actions
export default authSlice.reducer
