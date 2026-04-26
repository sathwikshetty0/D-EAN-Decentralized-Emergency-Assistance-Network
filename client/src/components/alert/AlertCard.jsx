import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const AlertCard = ({ alert, onAccept, onDecline }) => {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 animate-[slideIn_0.3s_ease-out]">
      <div className="flex justify-between items-start border-b border-borderDefault pb-4">
        <div>
          <h3 className="text-xl font-syne font-bold flex items-center gap-2">
            <span className="text-2xl">
              {alert.emergencyType === 'medical' ? '🏥' : 
               alert.emergencyType === 'fire' ? '🔥' : 
               alert.emergencyType === 'accident' ? '🚗' : 
               alert.emergencyType === 'crime' ? '🚨' : 
               alert.emergencyType === 'flood' ? '🌊' : '❓'}
            </span>
            <span className="capitalize">{alert.emergencyType} Emergency</span>
          </h3>
          <p className="text-textSecondary mt-1">📍 {alert.location.address || 'Location Details'}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-mono bg-bgTertiary px-2 py-1 rounded text-textMuted border border-borderDefault">
            {alert.alertId}
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded bg-bgTertiary">
            {alert.routingMode === 'cloud' ? '☁️ Cloud' : '📡 P2P'}
          </span>
        </div>
      </div>

      {alert.description && (
        <div className="bg-bgTertiary p-3 rounded-lg border border-borderDefault">
          <p className="text-sm italic text-textSecondary">"{alert.description}"</p>
        </div>
      )}

      <div className="h-[150px] rounded-xl overflow-hidden border border-borderActive">
        <MapContainer center={[alert.location.lat, alert.location.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <Marker position={[alert.location.lat, alert.location.lng]} />
        </MapContainer>
      </div>

      <div className="flex gap-4 mt-2">
        <button onClick={() => onAccept(alert.alertId)} className="flex-1 bg-gradient-to-r from-greenSafe to-[#059669] py-3 rounded-full font-bold shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02]">
          ✓ Accept Alert
        </button>
        <button onClick={() => onDecline(alert.alertId)} className="flex-1 border border-borderDefault hover:bg-bgTertiary py-3 rounded-full font-bold transition-all">
          ✕ Decline
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
