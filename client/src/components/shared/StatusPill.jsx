import React from 'react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: '#FF2D5520', color: '#FF2D55' },
  accepted: { label: 'Accepted', bg: '#F59E0B20', color: '#F59E0B' },
  en_route: { label: 'En Route', bg: '#3B82F620', color: '#3B82F6' },
  resolved: { label: 'Resolved', bg: '#10B98120', color: '#10B981' },
  cancelled: { label: 'Cancelled', bg: '#47556920', color: '#475569' },
};

const StatusPill = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span 
      style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.color}` }}
      className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
    >
      {config.label}
    </span>
  );
};

export default StatusPill;
