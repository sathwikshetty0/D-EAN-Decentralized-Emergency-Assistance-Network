import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { flushOfflineQueue } from '../utils/p2p';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mode, setMode] = useState(navigator.onLine ? 'cloud' : 'p2p');

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        await api.get('/health', { timeout: 5000 });
        if (!isOnline) {
          setIsOnline(true);
          setMode('cloud');
          flushOfflineQueue();
        }
      } catch (error) {
        if (isOnline) {
          setIsOnline(false);
          setMode('p2p');
        }
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      setMode('cloud');
      flushOfflineQueue();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setMode('p2p');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const interval = setInterval(checkNetwork, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  return (
    <NetworkContext.Provider value={{ isOnline, mode }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
