import React from 'react';

const EMERGENCY_TYPES = [
  { id: 'medical', icon: '🏥', label: 'Medical' },
  { id: 'fire', icon: '🔥', label: 'Fire' },
  { id: 'accident', icon: '🚗', label: 'Accident' },
  { id: 'crime', icon: '🚨', label: 'Crime' },
  { id: 'flood', icon: '🌊', label: 'Flood' },
  { id: 'other', icon: '❓', label: 'Other' },
];

const EmergencyTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex gap-3 min-w-max px-1">
        {EMERGENCY_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selected === type.id ? 'bg-red-glow/20 border-redSos text-redSos shadow-[0_0_15px_rgba(255,45,85,0.2)]' : 'bg-bgTertiary border-borderDefault text-textSecondary hover:border-white hover:text-white'}`}
          >
            <span className="text-xl">{type.icon}</span>
            <span className="font-semibold">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmergencyTypeSelector;
