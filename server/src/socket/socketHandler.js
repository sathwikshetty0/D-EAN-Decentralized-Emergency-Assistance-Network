const socketIo = require('socket.io');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*', // for development
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join as responder
    socket.on('join-as-responder', ({ userId, zone }) => {
      socket.join('responders');
      socket.userId = userId;
      console.log(`Responder ${userId} joined room 'responders'`);
    });

    // Join as user
    socket.on('join-as-user', ({ userId }) => {
      socket.join(`user-${userId}`);
      socket.userId = userId;
      console.log(`User ${userId} joined room 'user-${userId}'`);
    });

    // Join admin
    socket.on('join-admin', ({ adminId }) => {
      socket.join('admin');
      console.log(`Admin ${adminId} joined room 'admin'`);
    });

    // Alert created
    socket.on('alert-created', (payload) => {
      // payload: { alertId, location, type, userId }
      socket.join(`alert-${payload.alertId}`);
      io.to('responders').emit('new-alert', payload);
      io.to('admin').emit('new-log-entry', {
        timestamp: new Date(),
        action: 'ALERT_CREATED',
        alertId: payload.alertId,
        routingMode: 'cloud'
      });
    });

    // Responder location update
    socket.on('responder-location', (payload) => {
      // payload: { alertId, lat, lng }
      io.to(`alert-${payload.alertId}`).emit('responder-location-update', payload);
    });

    // Alert status update (accepted, en-route, resolved, cancelled)
    socket.on('alert-status-update', (payload) => {
      // payload: { alertId, status, responderId }
      io.to(`alert-${payload.alertId}`).emit(`alert-${payload.status}`, payload);
      
      // If accepted, add responder to alert room
      if (payload.status === 'accepted') {
        socket.join(`alert-${payload.alertId}`);
      }
      
      io.to('admin').emit('new-log-entry', {
        timestamp: new Date(),
        action: `ALERT_${payload.status.toUpperCase()}`,
        alertId: payload.alertId,
        routingMode: 'cloud'
      });
    });

    // P2P Alert Broadcast (just passing it through if needed, or logging it if admin wants to see it)
    socket.on('p2p-alert-broadcast', (payload) => {
      io.to('admin').emit('new-log-entry', {
        timestamp: new Date(),
        action: 'ALERT_CREATED_P2P',
        alertId: payload.alertId || 'P2P',
        routingMode: 'p2p'
      });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initSocket };
