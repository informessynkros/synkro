// Schema de autenticacion

export interface AuthDataProps {
  checkpoint: string
  cipher: string
}

// Schema de activación de cuenta
export interface ActivateAccountProps { // Este me ayuda con la comparación de las contraseñas
  email: string
  temp_password: string
  new_password: string
  confirm_password: string
}

export interface ActivateAccountApiProps { // Este schema es el que enviamos al backend
  email: string
  temp_password: string
  new_password: string
}

export interface VerifyFomrData {
  confirmationCode: string
}