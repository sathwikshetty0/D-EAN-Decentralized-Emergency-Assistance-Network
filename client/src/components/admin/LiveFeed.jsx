import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';

const LiveFeed = () => {
  const { socket } = useSocket();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('new-log-entry', (log) => {
        setLogs(prev => [log, ...prev].slice(0, 20)); // Keep last 20
      });
    }
    return () => {
      if (socket) socket.off('new-log-entry');
    };
  }, [socket]);

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-syne font-bold mb-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-redSos rounded-full animate-pulse"></span> Live Activity
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar pr-2">
        {logs.map((log, index) => (
          <div key={index} className="bg-bgTertiary p-3 rounded border border-borderDefault text-sm flex gap-3 animate-[slideIn_0.3s_ease-out]">
            <span className="text-textMuted w-16 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex-1">
              <span className={`font-semibold ${log.action.includes('CREATED') ? 'text-redSos' : log.action.includes('RESOLVED') ? 'text-greenSafe' : 'text-blueCloud'}`}>
                {log.action}
              </span>
              <span className="text-textSecondary ml-2">- {log.alertId}</span>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-textMuted mt-10">Waiting for live events...</div>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
