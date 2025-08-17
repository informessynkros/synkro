// Geocode
export const geocodeAddress = async (address: string) => {
  return new Promise<[number, number] | null>(resolve => {
    if (!window.google) {
      console.error('Google Maps API no está cargada')
      resolve(null)
      return
    }

    const geocoder = new google.maps.Geocoder()

    geocoder.geocode(
      { address: address, language: 'es', region: 'mx', componentRestrictions: { country: 'MX' } },
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location
          resolve([location.lat(), location.lng()])
        } else {
          console.error('Geocoding error: ', status)
          resolve(null)
        }
      }
    )
  })
}


