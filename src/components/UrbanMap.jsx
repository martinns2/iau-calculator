import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Solución para los íconos por defecto de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function UrbanMap({ projectCoords, projectName, services }) {
  // Centro del mapa basado en el proyecto seleccionado
  const centerPosition = [projectCoords.lat, projectCoords.lng];

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">🗺️ Vista Geográfica Interactiva</h3>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">OpenStreetMap</span>
      </div>
      
      {/* Contenedor del Mapa */}
      <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-slate-200 z-10">
        <MapContainer center={centerPosition} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcador del Proyecto Inmobiliario */}
          <Marker position={centerPosition}>
            <Popup>
              <strong>{projectName}</strong> <br /> Proyecto Inmobiliario Activo.
            </Popup>
          </Marker>

          {/* Marcadores de los servicios urbanos de referencia */}
          {Object.entries(services).map(([key, service]) => (
            <Marker key={key} position={[service.lat, service.lng]}>
              <Popup>
                <strong>{service.name}</strong> <br /> Equipamiento Urbano.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}