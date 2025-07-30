// Componente búsqueda

import { algoliasearch } from "algoliasearch"

// Cliente de búsqueda (solo lectura)
export const searchClient = algoliasearch(
  import.meta.env.VITE_PUBLIC_ALGOLIA_APP_ID,
  import.meta.env.VITE_PUBLIC_ALGOLIA_SEARCH_API_KEY
)

// Cliente para escritura (para indexar datos)
export const writeClient = algoliasearch(
  import.meta.env.VITE_PUBLIC_ALGOLIA_APP_ID!,
  import.meta.env.VITE_PUBLIC_ALGOLIA_WRITE_API_KEY!
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