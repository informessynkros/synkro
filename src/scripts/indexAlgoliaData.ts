import { writeClient, searchClient, ALGOLIA_INDEX_NAME } from "../lib/algolia"
import { generateSearchDataFromRoutes, getSearchStats } from "../utils/generateSearchData"


export const indexSearchData = async () => {
  try {
    // Generamos los datos automaticamente desde rutas
    const searchData = generateSearchDataFromRoutes()
    const stats = getSearchStats()

    console.log('Iniciando indexación de datos...')
    console.log('Estadísticas del índice: ', stats)

    // Subir todos los datos del índice
    const result = await writeClient.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: searchData
    })
    return result
  } catch (error) {
    console.error('Error al indexar datos: ', error)
    throw error
  }
}

// Función para buscar
export const testSearch = async (query: string) => {
  try {
    const result = await searchClient.searchSingleIndex({
      indexName: ALGOLIA_INDEX_NAME,
      searchParams: {
        query: query,
        hitsPerPage: 10,
        attributesToHighlight: ['title', 'description']
      }
    })

    console.log(`🔍 Resultados para "${query}":`, result.hits)
    return result.hits
  } catch (error) {
    console.error('Error en búsqueda:', error)
    throw error
  }
}

// Si ejecutas este archivo directamente
if (typeof window === 'undefined') {
  // Solo en Node.js/servidor
  indexSearchData()
    .then(() => {
      console.log('Indexación completada!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}
