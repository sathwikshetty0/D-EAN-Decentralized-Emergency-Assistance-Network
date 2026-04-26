import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const responderIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AutoFitBounds = ({ userPos, responderPos }) => {
  const map = useMap();
  useEffect(() => {
    if (userPos && responderPos) {
      const bounds = L.latLngBounds([userPos, responderPos]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userPos) {
      map.setView(userPos, 15);
    }
  }, [userPos, responderPos, map]);
  return null;
};

const AlertMap = ({ userLocation, responderLocation, height = '300px' }) => {
  const defaultPos = [12.8703, 74.8436]; // Mangaluru
  const userPos = userLocation ? [userLocation.lat, userLocation.lng] : null;
  const responderPos = responderLocation ? [responderLocation.lat, responderLocation.lng] : null;

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={userPos || defaultPos} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
        
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>Emergency Location</Popup>
          </Marker>
        )}

        {responderPos && (
          <Marker position={responderPos} icon={responderIcon}>
            <Popup>Responder Location</Popup>
          </Marker>
        )}

        {userPos && responderPos && (
          <Polyline 
            positions={[userPos, responderPos]} 
            color="#3B82F6" 
            weight={3} 
            dashArray="10, 10" 
          />
        )}

        <AutoFitBounds userPos={userPos} responderPos={responderPos} />
      </MapContainer>
    </div>
  );
};

export default AlertMap;
