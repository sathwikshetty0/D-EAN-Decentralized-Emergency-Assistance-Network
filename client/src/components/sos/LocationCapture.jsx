import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const LocationCapture = ({ location, setLocation }) => {
  const [manual, setManual] = useState(false);
  const [address, setAddress] = useState('');

  const handleDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast.success("Location detected automatically", { style: { background: '#10B98120', color: '#10B981' } });
        },
        (err) => {
          toast.error("Failed to detect location. Please enter manually.");
          setManual(true);
        }
      );
    }
  };

  const Recenter = ({ lat, lng }) => {
    const map = useMap();
    React.useEffect(() => {
      map.setView([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {location ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-greenSafe flex items-center gap-2"><MapPin size={16} /> Location Detected</span>
            <button onClick={() => setLocation(null)} className="text-textSecondary hover:text-white underline">Change</button>
          </div>
          <div className="h-[150px] rounded-xl overflow-hidden border border-borderActive">
            <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={[location.lat, location.lng]} />
              <Recenter lat={location.lat} lng={location.lng} />
            </MapContainer>
          </div>
        </div>
      ) : (
        <>
          <button onClick={handleDetect} className="w-full py-3 rounded-xl border border-dashed border-borderActive hover:border-blueCloud text-textSecondary hover:text-blueCloud transition-colors flex items-center justify-center gap-2 bg-bgTertiary/50">
            <MapPin size={20} /> Click to detect location
          </button>
          
          {manual ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter area or landmark" 
                className="flex-1 bg-bgTertiary border border-borderDefault rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-redSos"
              />
              <button 
                onClick={() => {
                  if(address) setLocation({ lat: 12.8703, lng: 74.8436, address }); // mock lat lng
                }} 
                className="bg-borderActive px-4 rounded-xl text-sm hover:bg-white hover:text-black transition-colors"
              >
                Set
              </button>
            </div>
          ) : (
            <button onClick={() => setManual(true)} className="text-xs text-textMuted text-center hover:text-textSecondary underline">
              Can't detect? Enter your area manually
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default LocationCapture;
