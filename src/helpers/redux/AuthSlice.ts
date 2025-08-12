import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface AuthStateProps {
  user: any | null
  token: any | null
  mfaToken: string | null
  isAuthenticated: boolean
  showMfaSetupModal: boolean
  showMfaVerifyModal: boolean
}

const loadAuthState = (): AuthStateProps => {
  try {
    const serializedAuth = localStorage.getItem('authUser')
    if (serializedAuth === null) {
      return {
        user: null,
        token: null,
        mfaToken: null,
        isAuthenticated: false,
        showMfaSetupModal: false,
        showMfaVerifyModal: false
      }
    }
    return JSON.parse(serializedAuth)
  } catch (error) {
    return {
      user: null,
      token: null,
      mfaToken: null,
      isAuthenticated: false,
      showMfaSetupModal: false,
      showMfaVerifyModal: false
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
  isAuthenticated: false,
  showMfaSetupModal: false,
  showMfaVerifyModal: false
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
    setMfaSetupRequired: (state, action: PayloadAction<{ user: any, token: any }>) => {
      const { token, user } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = false
      state.showMfaSetupModal = true
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
      state.showMfaVerifyModal = true
      saveAuthState(state)
    },
    completeMfaSetup: state => {
      state.isAuthenticated = true
      state.showMfaSetupModal = false
      saveAuthState(state)
    },
    closeMfaSetupModal: state => {
      state.showMfaSetupModal = false
      saveAuthState(state)
    },
    closeMfaVerifyModal: state => {
      state.showMfaVerifyModal = false
      saveAuthState(state)
    },
    clearMfaToken: state => {
      state.mfaToken = null
      state.showMfaVerifyModal = false
      saveAuthState(state)
    },
    cleanCredentials: state => {
      state.user = null
      state.mfaToken = null
      state.mfaToken = null
      state.isAuthenticated = false
      state.showMfaSetupModal = false
      state.showMfaVerifyModal = false
      localStorage.removeItem('authUser')
    }
  }
})

export const {
  setCredentials,
  getCheckpoint,
  setMfaToken,
  clearMfaToken,
  cleanCredentials,
  setMfaSetupRequired,
  closeMfaSetupModal,
  closeMfaVerifyModal,
  completeMfaSetup
} = authSlice.actions

export default authSlice.reducer
