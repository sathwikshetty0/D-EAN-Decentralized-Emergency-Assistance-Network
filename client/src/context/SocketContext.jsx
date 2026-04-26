import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io({
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      if (user.role === 'responder') {
        newSocket.emit('join-as-responder', { userId: user._id, zone: user.zone });
      } else if (user.role === 'admin') {
        newSocket.emit('join-admin', { adminId: user._id });
      } else {
        newSocket.emit('join-as-user', { userId: user._id });
      }
    });

    return () => newSocket.close();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
