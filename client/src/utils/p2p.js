import api from './api';

const channel = new BroadcastChannel('dean-emergency');

export const broadcastAlert = (alert) => {
  channel.postMessage({ type: 'NEW_ALERT', payload: alert, timestamp: Date.now() });
  queueOfflineAlert(alert);
};

export const listenForAlerts = (callback) => {
  channel.onmessage = (event) => {
    if (event.data.type === 'NEW_ALERT') {
      callback(event.data.payload);
    }
  };
};

export const queueOfflineAlert = (alert) => {
  const queue = JSON.parse(localStorage.getItem('dean-offline-queue') || '[]');
  queue.push({ ...alert, routingMode: 'p2p', isSynced: false });
  localStorage.setItem('dean-offline-queue', JSON.stringify(queue));
};

export const flushOfflineQueue = async () => {
  const queue = JSON.parse(localStorage.getItem('dean-offline-queue') || '[]');
  if (queue.length === 0) return;
  
  try {
    await api.post('/alerts/sync-p2p', { alerts: queue });
    localStorage.removeItem('dean-offline-queue');
  } catch (err) {
    console.error('Failed to sync offline queue', err);
  }
};
