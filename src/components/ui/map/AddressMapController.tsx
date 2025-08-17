// AddressMapController.tsx - Con debug mejorado
import { useCallback, useEffect, useRef, useState } from "react"
import { type Control, useFormContext } from "react-hook-form"
import GoogleMap from "../map/GoogleMap"
import { geocodeAddress } from "../../../utils/map/Map"

interface AddressData {
  calle: string
  municipio: string
  ciudad: string
  estado: string
  cp: string
}

interface AddressMapControllerProps {
  control: Control<any>
  fieldPrefix: string
  initialAddress?: AddressData
  defaultCenter?: [number, number]
  mapId?: string
  title?: string
  description?: string
  onAddressChange?: (address: AddressData) => void
  onCoordinatesChange?: (lat: number, lng: number) => void
}

const AddressMapController = ({
  // control,
  fieldPrefix,
  initialAddress,
  defaultCenter = [19.4326, -99.1332],
  mapId = "default",
  title = "Ubicación en mapa",
  description = "Arrastra el marcador o haz click en el mapa para seleccionar la ubicación",
  onAddressChange,
  onCoordinatesChange
}: AddressMapControllerProps) => {


  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter)
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(defaultCenter)
  const [isUpdatingFromMap, setIsUpdatingFromMap] = useState(false)

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { watch, setValue } = useFormContext()

  // Función para geocodificación directa (dirección -> coordenadas)
  const updateMapFromForm = useCallback(async () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      const formData = watch()

      // Obtener campos según el prefijo (si está vacío, usar directamente)
      const getFieldValue = (field: string) => {
        if (!fieldPrefix || fieldPrefix === '') {
          return formData[field]
        }
        const fullPath = `${fieldPrefix}.${field}`
        const value = fullPath.split('.').reduce((obj, key) => obj?.[key], formData)
        return value
      }

      const calle = getFieldValue('calle')
      const ciudad = getFieldValue('ciudad')
      const estado = getFieldValue('estado')

      if (calle && ciudad && estado) {
        const fullAddress = `${calle}, ${ciudad}, ${estado}, México`

        try {
          const coords = await geocodeAddress(fullAddress)
          if (coords) {
            // console.log('✅ Coordenadas obtenidas:', coords)
            setMapCenter(coords)
            setMarkerPosition(coords)
            onCoordinatesChange?.(coords[0], coords[1])
          } else {
            console.log('❌ No se pudieron obtener coordenadas')
          }
        } catch (error) {
          console.error('❌ Error en geocodificación:', error)
        }
      } else {
        console.log('⚠️ Faltan campos para geocodificar')
      }
    }, 1000)
  }, [watch, isUpdatingFromMap, fieldPrefix, onCoordinatesChange])

  // Observar cambios en los campos de dirección
  useEffect(() => {

    const subscription = watch(({ name }) => {

      // Si no hay prefijo, observar campos directos
      const relevantFields = ['calle', 'ciudad', 'estado', 'municipio', 'cp']
      const shouldUpdate = fieldPrefix && fieldPrefix !== ''
        ? name?.includes(fieldPrefix)
        : relevantFields.some(field => name === field)


      if (shouldUpdate) {
        updateMapFromForm()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch, updateMapFromForm, fieldPrefix])

  // Función para geocodificación inversa
  const reverseGeocode = async (lat: number, lng: number): Promise<AddressData | null> => {

    return new Promise<AddressData | null>((resolve) => {
      if (!window.google) {
        // console.error('❌ Google Maps API no está cargada')
        resolve(null)
        return
      }

      const geocoder = new google.maps.Geocoder()
      const latlng = { lat: lat, lng: lng }

      geocoder.geocode(
        {
          location: latlng,
          language: 'es',
          region: 'mx'
        },
        (results, status) => {

          if (status === 'OK' && results && results.length > 0) {
            const result = results[0]
            const components = result.address_components

            const getComponent = (types: string[]) => {
              const component = components.find((comp) =>
                comp.types.some((type) => types.includes(type))
              )
              return component?.long_name || ''
            }

            const streetNumber = getComponent(['street_number'])
            const route = getComponent(['route'])
            const calle = streetNumber && route ? `${route} ${streetNumber}` : (route || streetNumber || '')

            const addressData: AddressData = {
              calle: calle || getComponent(['premise', 'subpremise']) || '',
              municipio: getComponent(['sublocality', 'sublocality_level_1']) ||
                getComponent(['administrative_area_level_2']) || '',
              ciudad: getComponent(['locality']) ||
                getComponent(['administrative_area_level_2']) ||
                getComponent(['sublocality']) || '',
              estado: getComponent(['administrative_area_level_1']) || '',
              cp: getComponent(['postal_code']) || ''
            }

            // console.log('✅ Dirección extraída:', addressData)
            resolve(addressData)
          } else {
            // console.error('❌ Geocoding error:', status)
            resolve(null)
          }
        }
      )
    })
  }

  // Función para actualizar el formulario cuando se mueva el marcador
  const handleMarkerMove = useCallback(async (lat: number, lng: number) => {
    setIsUpdatingFromMap(true)
    setMarkerPosition([lat, lng])

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const addressData = await reverseGeocode(lat, lng)

        if (addressData) {
          // Actualizar campos usando el prefijo (si está vacío, usar directamente)
          if (fieldPrefix && fieldPrefix !== '') {
            setValue(`${fieldPrefix}.calle`, addressData.calle)
            setValue(`${fieldPrefix}.municipio`, addressData.municipio)
            setValue(`${fieldPrefix}.ciudad`, addressData.ciudad)
            setValue(`${fieldPrefix}.estado`, addressData.estado)
            setValue(`${fieldPrefix}.cp`, addressData.cp)
          } else {
            setValue('calle', addressData.calle)
            setValue('municipio', addressData.municipio)
            setValue('ciudad', addressData.ciudad)
            setValue('estado', addressData.estado)
            setValue('cp', addressData.cp)
          }

          onAddressChange?.(addressData)
        }
      } catch (error) {
        // console.error('❌ Error en geocodificación:', error)
      } finally {
        setTimeout(() => {
          // console.log('✅ Terminando actualización desde mapa')
          setIsUpdatingFromMap(false)
        }, 200)
      }
    }, 800)

    onCoordinatesChange?.(lat, lng)
  }, [setValue, fieldPrefix, onAddressChange, onCoordinatesChange])

  const handleMapClick = (lat: number, lng: number) => {
    // console.log('🖱️ Click en mapa:', { lat, lng })
    handleMarkerMove(lat, lng)
  }

  // Geocodificar dirección inicial
  const geocodeInitialAddress = useCallback(async () => {
    if (!initialAddress) {
      // console.log('ℹ️ No hay dirección inicial')
      return
    }

    const { calle, ciudad, estado, cp } = initialAddress
    if (!calle || !ciudad || !estado) {
      // console.log('⚠️ Dirección inicial incompleta:', initialAddress)
      return
    }

    const fullAddress = `${calle}, ${ciudad}, ${estado}, ${cp ? cp + ', ' : ''}México`
    // console.log('🏠 Geocodificando dirección inicial:', fullAddress)

    try {
      const coords = await geocodeAddress(fullAddress)
      if (coords) {
        // console.log('✅ Coordenadas iniciales:', coords)
        setMapCenter(coords)
        setMarkerPosition(coords)
        onCoordinatesChange?.(coords[0], coords[1])
      }
    } catch (error) {
      console.error('❌ Error geocodificando dirección inicial:', error)
    }
  }, [initialAddress, onCoordinatesChange])

  useEffect(() => {
    if (initialAddress) {
      const timer = setTimeout(() => {
        geocodeInitialAddress()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [initialAddress, geocodeInitialAddress])

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <GoogleMap
        center={mapCenter}
        markerPosition={markerPosition}
        onMarkerDragEnd={handleMarkerMove}
        onMapClick={handleMapClick}
        key={`map-${mapId}`}
      />

      {/* Debug info */}
      {/* <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <strong>Debug:</strong> fieldPrefix="{fieldPrefix}", mapId="{mapId}"
      </div> */}
    </div>
  )
}

export default AddressMapController