import React, { useState, useEffect } from 'react';
import AlertMap from '../../components/alert/AlertMap';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import { useAlerts } from '../../context/AlertContext';
import toast from 'react-hot-toast';
import { MapPin, CheckCircle, Phone } from 'lucide-react';

const ActiveMission = ({ mission }) => {
  const { setActiveAlert } = useAlerts();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(false);
  const [responderPos, setResponderPos] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Mission Timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Watch responder location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setResponderPos(newPos);
          if (socket) {
            socket.emit('responder-location', { alertId: mission.alertId, lat: newPos.lat, lng: newPos.lng });
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [socket, mission.alertId]);

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    try {
      const res = await api.patch(`/alerts/${mission.alertId}/${status}`);
      setActiveAlert(res.data);
      if (socket) {
        socket.emit('alert-status-update', { alertId: mission.alertId, status, responderId: mission.assignedResponder?._id || mission.assignedResponder });
      }
      if (status === 'resolve') {
        toast.success("Mission Accomplished! 🎉", {
          style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' }
        });
        setTimeout(() => setActiveAlert(null), 3000);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-syne font-bold text-redSos flex items-center gap-2 animate-pulse">
          ACTIVE MISSION <span className="text-sm font-mono text-textMuted bg-bgTertiary px-2 py-1 rounded ml-2 border border-borderDefault">{mission.alertId}</span>
        </h2>
        <div className="bg-bgTertiary px-4 py-2 rounded-lg font-mono font-bold border border-borderDefault">
          ⏱ {formatTime(timer)}
        </div>
      </div>

      <div className="flex-1 min-h-[300px] mb-6 border border-borderActive rounded-xl overflow-hidden">
        <AlertMap userLocation={mission.location} responderLocation={responderPos} height="100%" />
      </div>

      <div className="bg-bgTertiary rounded-xl p-4 border border-borderDefault mb-6">
        <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3">Distressed User</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{mission.triggeredBy?.name || 'Unknown User'}</p>
            <p className="text-sm text-textSecondary flex items-center gap-1 mt-1">
              <span className="capitalize">{mission.emergencyType}</span> • {mission.location.address || 'No address provided'}
            </p>
          </div>
          {mission.triggeredBy?.phone && (
             <a href={`tel:${mission.triggeredBy.phone}`} className="p-3 bg-blueCloud/20 text-blueCloud rounded-full hover:bg-blueCloud hover:text-white transition-colors">
               <Phone size={20} />
             </a>
          )}
        </div>
        {mission.description && (
          <div className="mt-4 p-3 bg-bgSecondary rounded border border-borderDefault">
            <p className="text-sm italic">"{mission.description}"</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {mission.status === 'accepted' && (
          <button 
            onClick={() => handleStatusUpdate('en-route')}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blueCloud to-[#2563EB] py-4 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <MapPin /> I'm En Route
          </button>
        )}
        
        <button 
          onClick={() => handleStatusUpdate('resolve')}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-greenSafe to-[#059669] py-4 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle /> Mark as Resolved
        </button>
      </div>
    </div>
  );
};

export default ActiveMission;
