import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchLogs();
    
    if (socket) {
      socket.on('new-log-entry', (log) => {
        setLogs(prev => [log, ...prev]);
      });
    }

    return () => {
      if (socket) socket.off('new-log-entry');
    };
  }, [socket]);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.open('http://localhost:5000/api/admin/export/logs', '_blank');
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-[1400px] w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-syne font-bold">System Logs</h1>
          <button onClick={handleExport} className="bg-bgTertiary border border-borderDefault px-4 py-2 rounded-lg text-sm font-semibold hover:text-white transition-colors">
            Export CSV
          </button>
        </div>

        <div className="glass-card p-6 min-h-[500px]">
          {loading ? (
             <div className="text-center py-12 text-textMuted">Loading logs...</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-borderDefault text-textMuted text-xs uppercase bg-bgTertiary/50">
                    <th className="p-4 font-semibold">Timestamp</th>
                    <th className="p-4 font-semibold">Action</th>
                    <th className="p-4 font-semibold">Actor</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Alert ID</th>
                    <th className="p-4 font-semibold">Mode</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  {logs.map(log => (
                    <tr key={log._id} className="border-b border-borderDefault/50 hover:bg-bgTertiary transition-colors">
                      <td className="p-4 text-textMuted">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                      <td className={`p-4 font-bold ${log.action.includes('CREATED') ? 'text-redSos' : log.action.includes('RESOLVED') ? 'text-greenSafe' : 'text-blueCloud'}`}>{log.action}</td>
                      <td className="p-4 text-textPrimary">{log.actor?.name || 'System'}</td>
                      <td className="p-4 text-textSecondary">{log.actorRole || 'System'}</td>
                      <td className="p-4 text-textSecondary">{log.alertId || '-'}</td>
                      <td className="p-4 text-textSecondary">{log.routingMode === 'cloud' ? '☁️ Cloud' : log.routingMode === 'p2p' ? '📡 P2P' : '-'}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr><td colSpan="6" className="p-8 text-center text-textMuted font-sans">No system logs found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SystemLogs;
