// Archivo que contiene la base url de apis

import axios from "axios"

const api = axios.create({
  baseURL: 'https://tbxjk23sr9.execute-api.us-east-1.amazonaws.com/dev'
})

export default api