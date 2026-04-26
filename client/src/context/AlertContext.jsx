import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';
import { broadcastAlert, listenForAlerts } from '../utils/p2p';
import toast from 'react-hot-toast';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { mode } = useNetwork();

  // Load initial active alert for users and missions for responders
  useEffect(() => {
    if (!user) return;
    
    const fetchActive = async () => {
      try {
        if (user.role === 'user') {
          const res = await api.get('/alerts/active');
          if (res.data) setActiveAlert(res.data);
        } else if (user.role === 'responder') {
          // If responder has an accepted alert
          const res = await api.get('/alerts');
          const myMission = res.data.find(a => a.assignedResponder?._id === user._id && ['accepted', 'en_route'].includes(a.status));
          if (myMission) setActiveAlert(myMission);
          
          const pendings = res.data.filter(a => a.status === 'pending');
          setPendingAlerts(pendings);
        }
      } catch (err) {
        console.error('Failed to load active alert');
      }
    };
    fetchActive();
  }, [user]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !user) return;

    if (user.role === 'responder') {
      socket.on('new-alert', (alert) => {
        setPendingAlerts(prev => [alert, ...prev]);
        toast(`🆘 New ${alert.emergencyType} Emergency!`, {
          icon: '🚨',
          style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' }
        });
      });

      socket.on('alert-cancelled', ({ alertId }) => {
        setPendingAlerts(prev => prev.filter(a => a.alertId !== alertId));
        if (activeAlert?.alertId === alertId) {
          setActiveAlert(null);
          toast.error('Mission cancelled by user', {
            style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' }
          });
        }
      });
    }

    if (user.role === 'user') {
      socket.on('alert-accepted', (payload) => {
        if (activeAlert?.alertId === payload.alertId) {
          setActiveAlert(prev => ({ ...prev, status: 'accepted', assignedResponder: payload.responder }));
          toast.success('A responder has accepted your SOS!', {
             style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' }
          });
        }
      });

      socket.on('alert-en_route', (payload) => {
        if (activeAlert?.alertId === payload.alertId) {
          setActiveAlert(prev => ({ ...prev, status: 'en_route' }));
          toast('Responder is en route!', { icon: '🏃', style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' } });
        }
      });

      socket.on('alert-resolved', (payload) => {
        if (activeAlert?.alertId === payload.alertId) {
          setActiveAlert(prev => ({ ...prev, status: 'resolved' }));
          toast.success('Emergency resolved. Stay safe!', { style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' } });
          setTimeout(() => setActiveAlert(null), 5000);
        }
      });

      socket.on('responder-location-update', (payload) => {
        if (activeAlert?.alertId === payload.alertId) {
          setActiveAlert(prev => ({ ...prev, responderLocation: { lat: payload.lat, lng: payload.lng } }));
        }
      });
    }

    return () => {
      socket.off('new-alert');
      socket.off('alert-cancelled');
      socket.off('alert-accepted');
      socket.off('alert-en_route');
      socket.off('alert-resolved');
      socket.off('responder-location-update');
    };
  }, [socket, user, activeAlert]);

  // P2P Listeners
  useEffect(() => {
    if (user?.role === 'responder') {
      listenForAlerts((alert) => {
        setPendingAlerts(prev => {
          if (!prev.find(a => a.alertId === alert.alertId)) {
            toast(`📡 P2P: New ${alert.emergencyType} Emergency!`, {
              icon: '🚨',
              style: { background: '#3D2B00', color: 'var(--orange-p2p)', border: '1px solid var(--orange-p2p)' }
            });
            return [alert, ...prev];
          }
          return prev;
        });
      });
    }
  }, [user]);

  const triggerAlert = async (alertData) => {
    const fullAlert = {
      ...alertData,
      routingMode: mode,
      alertId: `DEAN-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      timestamps: { created: new Date() }
    };

    if (mode === 'cloud') {
      try {
        const res = await api.post('/alerts', alertData);
        setActiveAlert(res.data);
        if (socket) {
           socket.emit('alert-created', { alertId: res.data.alertId, location: alertData.location, type: alertData.emergencyType, userId: user._id });
        }
        return res.data;
      } catch (err) {
        throw err;
      }
    } else {
      broadcastAlert(fullAlert);
      setActiveAlert(fullAlert);
      return fullAlert;
    }
  };

  return (
    <AlertContext.Provider value={{ activeAlert, setActiveAlert, pendingAlerts, setPendingAlerts, triggerAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
