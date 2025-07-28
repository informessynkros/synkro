// Vista para crear un inventario

import { Box, Building, CircleX, Globe, Hash, Home, MapPin, Notebook, PersonStanding, Pin, SaveAll, Truck } from "lucide-react"
import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import MessageToasty from "../ui/messages/MessageToasty"
import useMediaQueries from "../../hooks/useMediaQueries"
import type { RadioOption } from "../ui/button/radioButton/RadioButtonGroup"
import RadioButtonGroup from "../ui/button/radioButton/RadioButtonGroup"
import ButtonCustom from "../ui/button/ButtonCustom"
import useNavigation from "../../hooks/useNavigation"
import ButtonCustomLoading from "../ui/button/ButtonCustomLoading"
import LineSeparator from "../ui/lineSeparator/LineSeparator"
import Section from "../ui/section/Section"
import type { AlmacenFormData } from "../../schemas/warehouse-schema"
// import Map from "../ui/map/Map"
import DynamicInputArray from "../ui/input/DynamicInputArray"
import useWarehouses from "../../hooks/useWarehouses"
import GoogleMap from "../ui/map/GoogleMap"

interface AddressData {
  calle: string
  municipio: string
  ciudad: string
  estado: string
  cp: string
}

const CreateInventory = () => {

  // Hooks
  const { isDesktop, isTablet, isMobile } = useMediaQueries()
  const { goBack } = useNavigation()
  const {
    createWarehouse,
    isPendingCreateWh,
  } = useWarehouses('BE001')

  // Estados
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.4326, -99.1332])
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([19.4326, -99.1332])
  const [isUpdatingFromMap, setIsUpdatingFromMap] = useState(false)

  // Refs
  const debounceTimeout = useRef<number>(0)

  const defaultValues = useMemo(
    // Valores del documento
    () => ({
      almacenes: {
        nombre: '',
        tipo_inventario: 'FISICO' as 'FISICO' | 'VIRTUAL',
        descripcion: '',
        operador_logistico: '',
        ubicacion_interna: [],
        direccion: {
          calle: '',
          municipio: '',
          cp: '',
          ciudad: '',
          estado: ''
        }
      }
    }),
    []
  )

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<AlmacenFormData>({ defaultValues })

  const tipoInventarioOptions: RadioOption<'FISICO' | 'VIRTUAL'>[] = [
    {
      label: 'Inventario Físico',
      value: 'FISICO',
    },
    {
      label: 'Inventario Virtual',
      value: 'VIRTUAL',
    }
  ]

  // Función que me ayuda con la sincronización para el mapa
  const geocodeAddress = async (address: string) => {
    return new Promise<[number, number] | null>((resolve) => {
      if (!window.google) {
        console.error('Google Maps API no está cargada')
        resolve(null)
        return
      }
  
      const geocoder = new google.maps.Geocoder()
  
      geocoder.geocode(
        { 
          address: address,
          language: 'es',
          region: 'mx',
          componentRestrictions: { country: 'MX' }
        },
        (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            const location = results[0].geometry.location
            resolve([location.lat(), location.lng()])
          } else {
            console.error('Geocoding error:', status)
            resolve(null)
          }
        }
      )
    })
  }


  // Función que me ayuda con la actualización del mapa cuando cambian los campos (campos de dirección)
  const updateMapFromForm = useCallback(async () => {
    if (isUpdatingFromMap) return

    // Limpiar timeout anterior
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Crear nuevo timeout
    debounceTimeout.current = setTimeout(async () => {
      const formData = watch()
      const direccion = formData.almacenes?.direccion

      if (direccion?.calle && direccion?.ciudad && direccion?.estado) {
        const fullAddress = `${direccion.calle}, ${direccion.ciudad}, ${direccion.estado}, México`
        const coords = await geocodeAddress(fullAddress)

        if (coords) {
          setMapCenter(coords)
          setMarkerPosition(coords)
        }
      }
    }, 1000) // Esperar 1 segundo antes de hacer la búsqueda
  }, [watch, isUpdatingFromMap])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      console.log(value)
      if (name?.includes('direccion')) {
        updateMapFromForm()
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, isUpdatingFromMap])

  // Función para geocodificación inversa (coordendas -> dirección)
  const reverseGeocode = async (lat: number, lng: number): Promise<AddressData | null> => {
    return new Promise<AddressData | null>((resolve) => {
      if (!window.google) {
        console.error('Google Maps API no está cargada')
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
  
            // Función helper para extraer componentes
            const getComponent = (types: string[]) => {
              const component = components.find((comp) => 
                comp.types.some((type) => types.includes(type))
              )
              return component?.long_name || ''
            }
  
            // Extraer información específica para México
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
  
            resolve(addressData)
          } else {
            console.error('Geocoding error:', status)
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

    // Limpiar timeout anterior
    clearTimeout(debounceTimeout.current)

    // Crear nuevo timeout para geocodificación inversa
    debounceTimeout.current = setTimeout(async () => {
      try {
        const addressData = await reverseGeocode(lat, lng)

        if (addressData) {
          setValue('almacenes.direccion.calle', addressData.calle)
          setValue('almacenes.direccion.municipio', addressData.municipio)
          setValue('almacenes.direccion.ciudad', addressData.ciudad)
          setValue('almacenes.direccion.estado', addressData.estado)
          setValue('almacenes.direccion.cp', addressData.cp)
        }
      } catch (error) {
        console.error('Error en geocodificación:', error)
      } finally {
        setTimeout(() => setIsUpdatingFromMap(false), 200)
      }
    }, 800) // Esperar 800ms antes de hacer la geocodificación inversa

  }, [setValue])

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeout.current)
    }
  }, [])

  // Función para cuando se haga click en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    handleMarkerMove(lat, lng)
  }

  // Envio de información
  const handleDataSubmit = async (formData: AlmacenFormData) => {
    try {
      const { almacenes } = formData
      const data = {
        id_be: 'BE001', // formData.id_be,
        almacenes: {
          nombre: almacenes.nombre,
          tipo_inventario: almacenes.tipo_inventario,
          descripcion: almacenes.descripcion,
          operador_logistico: almacenes.operador_logistico,
          direccion: {
            calle: almacenes.direccion.calle,
            municipio: almacenes.direccion.municipio,
            cp: almacenes.direccion.cp,
            ciudad: almacenes.direccion.ciudad,
            estado: almacenes.direccion.estado
          },
          ubicacion_interna: [
            "Piso 1",
            "Zona A"
          ]
        }
      }
      console.log('Enviando data: ', data)
      await createWarehouse(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <Section
        text="Inventario - Alta almacén"
        icon={Box}
      />

      <div className="bg-white shadow-md p-6 rounded-md mt-6">
        <form
          onSubmit={handleSubmit(handleDataSubmit)}
          className={`flex flex-col`}
        >
          {/* Información general */}
          <div>
            <div className="flex items-center gap-3 mb-5 text-gray-600">
              <Notebook />
              <h1 className={`font-semibold ${isDesktop ? 'text-2xl' : isTablet ? 'text-xl' : isMobile ? 'text-base' : 'font-normal text-base'}`}> Información general </h1>
            </div>
            <div className={`grid ${isDesktop ? 'grid-cols-2 gap-x-8' : isTablet ? 'grid-cols-1' : ''}`}>
              <Controller
                name="almacenes.nombre"
                control={control}
                rules={{
                  required: 'El nombre es requerido'
                }}
                render={({ field }) => (
                  <MessageToasty
                    label="Nombre"
                    type="text"
                    placeholder="Nombre de almacén..."
                    icon={PersonStanding}
                    error={errors.almacenes?.nombre?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="almacenes.tipo_inventario"
                control={control}
                rules={{
                  required: 'Debes seleccionar un tipo de inventario'
                }}
                render={({ field }) => (
                  <RadioButtonGroup
                    label="Tipo de Inventario"
                    name="tipoInventario"
                    options={tipoInventarioOptions}
                    value={field.value as 'fisico' | 'virtual' | undefined}
                    onChange={value => {
                      field.onChange(value)
                    }}
                    error={errors.almacenes?.tipo_inventario?.message}
                    required
                  />
                )}
              />

              <Controller
                name="almacenes.descripcion"
                control={control}
                rules={{
                  required: 'Agrega una breve descripción'
                }}
                render={({ field }) => (
                  <MessageToasty
                    label="Descripción"
                    type="textarea"
                    error={errors.almacenes?.descripcion?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="almacenes.ubicacion_interna"
                control={control}
                rules={{
                  required: 'Ingresa una ubicación interna',
                  validate: value => {
                    if (!value || value.length === 0) {
                      return 'Debe tener al menos una ubicación interna'
                    }
                    if (value.some(item => !item || item.trim() === '')) {
                      return 'No puede haber ubicaciones vacías'
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <DynamicInputArray
                    label="Ubicación interna"
                    placeholder="Piso / Localización"
                    icon={MapPin}
                    values={field.value || []}
                    onChange={field.onChange}
                    error={errors.almacenes?.ubicacion_interna?.message}
                    required
                    maxItems={5}
                  />
                )}
              />

              <Controller
                name="almacenes.operador_logistico"
                control={control}
                render={({ field }) => (
                  <MessageToasty
                    label="Operador logistico"
                    type="text"
                    icon={Truck}
                    error={errors.almacenes?.operador_logistico?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <LineSeparator className="my-5" />

          {/* Dirección */}
          <div>
            <div className="flex items-center gap-3 mb-5 text-gray-600">
              <Pin />
              <h1 className={`font-semibold ${isDesktop ? 'text-2xl' : isTablet ? 'text-xl' : isMobile ? 'text-base' : 'font-normal text-base'}`}> Dirección </h1>
            </div>
            <div className={`grid ${isDesktop ? 'grid-cols-2' : isTablet ? 'grid-cols-1' : 'grid-cols-1'} gap-8`}>
              {/* Formulario */}
              <div>
                <Controller
                  name="almacenes.direccion.calle"
                  control={control}
                  rules={{
                    required: 'La calle es requerida'
                  }}
                  render={({ field }) => (
                    <MessageToasty
                      label="Dirección (calle)"
                      type="text"
                      icon={Building}
                      error={errors.almacenes?.direccion?.calle?.message}
                      required
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="almacenes.direccion.municipio"
                  control={control}
                  rules={{
                    required: 'Ingresa una delegación'
                  }}
                  render={({ field }) => (
                    <MessageToasty
                      label="Delegación"
                      type="text"
                      icon={Home}
                      error={errors.almacenes?.direccion?.municipio?.message}
                      required
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="almacenes.direccion.cp"
                  control={control}
                  rules={{
                    required: 'Ingresa un código postal'
                  }}
                  render={({ field }) => (
                    <MessageToasty
                      label="Código postal"
                      type="text"
                      icon={Hash}
                      error={errors.almacenes?.direccion?.cp?.message}
                      required
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="almacenes.direccion.ciudad"
                  control={control}
                  rules={{
                    required: 'Ingresa una ciudad'
                  }}
                  render={({ field }) => (
                    <MessageToasty
                      label="Ciudad"
                      type="text"
                      icon={Globe}
                      error={errors.almacenes?.direccion?.ciudad?.message}
                      required
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="almacenes.direccion.estado"
                  control={control}
                  rules={{
                    required: 'Ingresa un estado'
                  }}
                  render={({ field }) => (
                    <MessageToasty
                      label="Estado"
                      type="text"
                      icon={MapPin}
                      error={errors.almacenes?.direccion?.estado?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Mapa */}
              <div>
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2"> Ubicación en mapa </h3>
                  <p className="text-sm text-gray-500">
                    Arrastra el marcador o haz click en el mapa para seleccionar la ubicación
                  </p>
                </div>

                {/* <Map
                  center={mapCenter}
                  markerPosition={markerPosition}
                  onMarkerDragEnd={handleMarkerMove}
                  onMapClick={handleMapClick}
                /> */}
                <GoogleMap
                  center={mapCenter}
                  markerPosition={markerPosition}
                  onMarkerDragEnd={handleMarkerMove}
                  onMapClick={handleMapClick}
                />
              </div>
            </div>
          </div>

          <LineSeparator className="my-5" />

          <div className="flex justify-end gap-4">
            <ButtonCustom
              text="Cancelar"
              icon={CircleX}
              onClick={goBack}
            />

            <ButtonCustomLoading
              text="Crear almacén"
              loadingText="Creando..."
              isLoading={isPendingCreateWh}
              icon={SaveAll}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateInventory
