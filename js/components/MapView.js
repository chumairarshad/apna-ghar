import { formatPKR } from '../utils/formatters.js';

let leafletMapInstance = null;

export function initLeafletMap(properties, onPropertySelect) {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement) return;

  // Cleanup existing map if re-rendering
  if (leafletMapInstance) {
    leafletMapInstance.remove();
    leafletMapInstance = null;
  }

  // Default Center: Islamabad / Pakistan center
  const defaultCoords = [31.4722, 74.4371]; // Lahore center
  
  if (window.L) {
    leafletMapInstance = L.map('leaflet-map').setView(defaultCoords, 11);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap & ApnaGhar.pk'
    }).addTo(leafletMapInstance);

    const bounds = L.latLngBounds();

    properties.forEach(prop => {
      if (prop.coords && prop.coords.length === 2) {
        bounds.extend(prop.coords);

        const customPriceMarker = L.divIcon({
          className: 'custom-map-icon',
          html: `<div class="map-price-badge">${formatPKR(prop.price)}</div>`,
          iconSize: [80, 26],
          iconAnchor: [40, 13]
        });

        const popupContent = `
          <div class="map-popup-card">
            <img src="${prop.images && prop.images[0] ? prop.images[0] : ''}" class="map-popup-img" />
            <div class="map-popup-info">
              <div class="map-popup-price">${formatPKR(prop.price)}</div>
              <div class="map-popup-title">${prop.title}</div>
              <div class="map-popup-location">${prop.location}, ${prop.city}</div>
              <button class="btn btn-primary btn-sm popup-view-btn" data-id="${prop.id}" style="width:100%; padding:0.3rem; font-size:0.75rem;">View Property</button>
            </div>
          </div>
        `;

        const marker = L.marker(prop.coords, { icon: customPriceMarker }).addTo(leafletMapInstance);
        marker.bindPopup(popupContent);
      }
    });

    if (properties.length > 0) {
      leafletMapInstance.fitBounds(bounds, { padding: [40, 40] });
    }
  }
}
