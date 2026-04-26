import React from 'react';
import StatusPill from '../shared/StatusPill';

const AlertTable = ({ alerts, onView }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-borderDefault text-textMuted text-xs uppercase">
            <th className="p-4 font-semibold">Alert ID</th>
            <th className="p-4 font-semibold">Type</th>
            <th className="p-4 font-semibold">User</th>
            <th className="p-4 font-semibold">Location</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Mode</th>
            <th className="p-4 font-semibold">Created</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-textSecondary">
          {alerts.map(alert => (
            <tr key={alert._id} className="border-b border-borderDefault hover:bg-bgTertiary transition-colors">
              <td className="p-4 font-mono text-textPrimary">{alert.alertId}</td>
              <td className="p-4 capitalize">{alert.emergencyType}</td>
              <td className="p-4">{alert.triggeredBy?.name || 'N/A'}</td>
              <td className="p-4 truncate max-w-[150px]">{alert.location.address || `${alert.location.lat.toFixed(2)}, ${alert.location.lng.toFixed(2)}`}</td>
              <td className="p-4"><StatusPill status={alert.status} /></td>
              <td className="p-4">{alert.routingMode === 'cloud' ? '☁️ Cloud' : '📡 P2P'}</td>
              <td className="p-4">{new Date(alert.timestamps.created).toLocaleTimeString()}</td>
              <td className="p-4">
                <button onClick={() => onView(alert)} className="text-blueCloud hover:underline font-semibold">View</button>
              </td>
            </tr>
          ))}
          {alerts.length === 0 && (
            <tr><td colSpan="8" className="p-8 text-center text-textMuted">No alerts found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlertTable;
