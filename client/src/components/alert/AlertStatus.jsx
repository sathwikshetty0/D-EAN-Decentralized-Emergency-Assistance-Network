import React from 'react';
import StatusPill from '../shared/StatusPill';
import AlertMap from './AlertMap';
import AlertTimeline from './AlertTimeline';
import api from '../../utils/api';
import { useAlerts } from '../../context/AlertContext';
import { User, Phone } from 'lucide-react';

const AlertStatus = () => {
  const { activeAlert, setActiveAlert } = useAlerts();

  if (!activeAlert) return null;

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this emergency alert?')) {
      try {
        await api.patch(`/alerts/${activeAlert.alertId}/cancel`);
        setActiveAlert(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-syne font-bold flex items-center gap-2">
            <span className="capitalize">{activeAlert.emergencyType}</span> Emergency
          </h2>
          <p className="text-sm text-textMuted font-mono mt-1">{activeAlert.alertId}</p>
        </div>
        <StatusPill status={activeAlert.status} />
      </div>

      <div className="mb-6">
        <p className="text-sm text-textSecondary flex items-center gap-2 mb-4">
          📍 {activeAlert.location.address || 'Location Details'}
        </p>
        <AlertMap userLocation={activeAlert.location} responderLocation={activeAlert.responderLocation} height="200px" />
      </div>

      <AlertTimeline timeline={activeAlert.timeline} />

      {activeAlert.assignedResponder && (
        <div className="mt-auto bg-bgTertiary rounded-xl p-4 border border-borderDefault">
          <p className="text-xs text-textMuted font-bold uppercase mb-3 tracking-wider">Assigned Responder</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blueCloud/20 text-blueCloud flex items-center justify-center font-bold text-lg border border-blueCloud/50">
                {activeAlert.assignedResponder.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-textPrimary">{activeAlert.assignedResponder.name}</p>
                <p className="text-xs text-textSecondary truncate max-w-[150px]">
                  {activeAlert.assignedResponder.skills?.join(', ')}
                </p>
              </div>
            </div>
            {activeAlert.assignedResponder.phone && (
               <a href={`tel:${activeAlert.assignedResponder.phone}`} className="p-3 bg-greenSafe/20 text-greenSafe rounded-full hover:bg-greenSafe hover:text-white transition-colors">
                 <Phone size={18} />
               </a>
            )}
          </div>
        </div>
      )}

      {['pending', 'accepted', 'en_route'].includes(activeAlert.status) && (
        <button 
          onClick={handleCancel}
          className="mt-6 py-3 w-full rounded-full border border-redSos/50 text-redSos hover:bg-redSos/10 transition-colors font-semibold"
        >
          Cancel Alert
        </button>
      )}
    </div>
  );
};

export default AlertStatus;
