import React from 'react';

const StatsCard = ({ title, value, icon, colorClass, trend }) => {
  return (
    <div className={`glass-card p-6 border-l-4 ${colorClass}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-textSecondary font-semibold">{title}</span>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-syne font-bold">{value}</span>
        {trend && (
          <span className={`text-sm mb-1 ${trend > 0 ? 'text-greenSafe' : 'text-textMuted'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
