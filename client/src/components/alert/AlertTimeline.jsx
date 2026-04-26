import React from 'react';

const AlertTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  const STATUS_MAP = {
    'ALERT_CREATED': { label: 'Alert Sent', color: 'bg-redSos' },
    'ALERT_ACCEPTED': { label: 'Responder Found', color: 'bg-orangeP2p' },
    'ACCEPTED': { label: 'Responder Found', color: 'bg-orangeP2p' },
    'EN_ROUTE': { label: 'En Route', color: 'bg-blueCloud' },
    'RESOLVED': { label: 'Help Arrived', color: 'bg-greenSafe' },
    'CANCELLED': { label: 'Alert Cancelled', color: 'bg-textMuted' },
  };

  const getStatusInfo = (action) => {
    for (const key in STATUS_MAP) {
      if (action.includes(key)) return STATUS_MAP[key];
    }
    return { label: action, color: 'bg-borderDefault' };
  };

  return (
    <div className="relative pl-6 border-l-2 border-borderDefault ml-3 space-y-6 my-6">
      {timeline.map((event, index) => {
        const info = getStatusInfo(event.action);
        return (
          <div key={index} className="relative">
            <span className={`absolute -left-[31px] w-4 h-4 rounded-full ${info.color} border-4 border-bgSecondary`}></span>
            <div>
              <p className="font-semibold text-textPrimary">{info.label}</p>
              <p className="text-xs text-textMuted">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                {event.actor !== 'System' && ` • ${event.actor}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertTimeline;
