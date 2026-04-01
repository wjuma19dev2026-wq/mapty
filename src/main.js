import './sanitize.css'
import './layout.css'
import './utilities.css'
import './style.css'

// 1. Importar CSS de Leaflet
import 'leaflet/dist/leaflet.css'
// 2. Importar la librería
import L from 'leaflet'
// 3. FIX para iconos en Webpack (Obligatorio)
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
})

import { $ } from '@utils/dom.js'
import { store } from '@state/store.js'

function init() {
  store.subscribe((state) => {
    console.log('State updated:', state)
  })
}

init()

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { longitude: lng, latitude: lat } = pos.coords

    const mapContainer = $('#map')
    if (mapContainer) {
      const map = L.map(mapContainer).setView([lat, lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      L.marker([lat, lng]).addTo(map).bindPopup('¡Aquí estás!').openPopup()
    } else {
      console.error('No se encontró el contenedor del mapa')
    }
  })
} else {
  console.log('Tu navegador no soporta Geoposition')
}
