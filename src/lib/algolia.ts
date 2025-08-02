// Componente búsqueda

import { algoliasearch } from "algoliasearch"

const ALGOLIA_APP_ID = 'QEEDMKSR6U'
const ALGOLIA_SEARCH_API_KEY = 'c4499e52ac87a8a532014aa0fe0c04e3'
const ALGOLIA_WRITE_API_KEY = '30f35b04ca4cfff5e442a16f84514fe2'

// Cliente de búsqueda (solo lectura)
export const searchClient = algoliasearch(
  // import.meta.env.VITE_ALGOLIA_APP_ID,
  //import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY
)

// Cliente para escritura (para indexar datos)
export const writeClient = algoliasearch(
  // import.meta.env.VITE_ALGOLIA_APP_ID!,
  // import.meta.env.VITE_ALGOLIA_WRITE_API_KEY!
  ALGOLIA_APP_ID,
  ALGOLIA_WRITE_API_KEY
)

// Configuracion de indices
export const ALGOLIA_INDEX_NAME = 'synkros_search'

// Tipos para datos

export interface SearchableItem extends Record<string, unknown> {
  objectID: string
  title: string
  description?: string
  category?: string
  url?: string
  type?: string
  keywords: string[]
  available: boolean
  priority: number
  email?: string
  userID?: string
  status?: string
}