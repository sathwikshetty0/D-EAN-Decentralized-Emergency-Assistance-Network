import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import EmergencyTypeSelector from '../../components/sos/EmergencyTypeSelector';
import LocationCapture from '../../components/sos/LocationCapture';
import SOSButton from '../../components/sos/SOSButton';
import AlertStatus from '../../components/alert/AlertStatus';
import { useAlerts } from '../../context/AlertContext';
import { Clock, Shield, AlertTriangle, Info } from 'lucide-react';

const UserDashboard = () => {
  const { activeAlert, triggerAlert } = useAlerts();
  const [selectedType, setSelectedType] = useState('medical');
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    if (!location) {
      alert("Please provide your location first.");
      return;
    }
    setLoading(true);
    try {
      await triggerAlert({
        location,
        emergencyType: selectedType,
        description
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Left Column - Main Action */}
        <div className="flex-[2] flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl font-syne font-bold text-white mb-2">Emergency Dashboard</h1>
          
          {activeAlert ? (
             <div className="flex-1 min-h-[600px]">
               <AlertStatus />
             </div>
          ) : (
            <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center min-h-[600px]">
              <div className="w-full max-w-xl mx-auto space-y-8">
                
                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-3">1. Nature of Emergency</h3>
                  <EmergencyTypeSelector selected={selectedType} onSelect={setSelectedType} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-3">2. Your Location</h3>
                  <LocationCapture location={location} setLocation={setLocation} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-3 flex justify-between">
                    <span>3. Additional Details (Optional)</span>
                    <span className="text-xs font-normal">{description.length}/500</span>
                  </h3>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    placeholder="Briefly describe your emergency..."
                    className="w-full bg-bgTertiary border border-borderDefault rounded-xl p-4 text-textPrimary focus:outline-none focus:border-redSos resize-none h-[100px]"
                  />
                </div>

                <div className="pt-8 border-t border-borderDefault flex justify-center">
                  <SOSButton onTrigger={handleSOS} loading={loading} />
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Right Column - Info & Stats */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Safety Tips based on type */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-syne font-bold mb-4 flex items-center gap-2">
              <Shield className="text-blueCloud" size={20} /> Safety Guidelines
            </h3>
            <div className="space-y-4">
              {selectedType === 'medical' && (
                <>
                  <div className="flex items-start gap-3 bg-bgTertiary p-3 rounded-lg"><Info size={16} className="mt-0.5 text-blueCloud shrink-0" /><p className="text-sm text-textSecondary">Do not move the person if a spinal injury is suspected.</p></div>
                  <div className="flex items-start gap-3 bg-bgTertiary p-3 rounded-lg"><Info size={16} className="mt-0.5 text-blueCloud shrink-0" /><p className="text-sm text-textSecondary">If bleeding heavily, apply firm, direct pressure to the wound.</p></div>
                </>
              )}
              {selectedType === 'fire' && (
                <>
                  <div className="flex items-start gap-3 bg-bgTertiary p-3 rounded-lg"><AlertTriangle size={16} className="mt-0.5 text-orangeP2p shrink-0" /><p className="text-sm text-textSecondary">Evacuate immediately. Do not use elevators.</p></div>
                  <div className="flex items-start gap-3 bg-bgTertiary p-3 rounded-lg"><Info size={16} className="mt-0.5 text-blueCloud shrink-0" /><p className="text-sm text-textSecondary">If smoke is present, stay low to the ground where air is clearer.</p></div>
                </>
              )}
              {['accident', 'crime', 'flood', 'other'].includes(selectedType) && (
                 <div className="flex items-start gap-3 bg-bgTertiary p-3 rounded-lg"><Info size={16} className="mt-0.5 text-blueCloud shrink-0" /><p className="text-sm text-textSecondary">Stay calm. Ensure your own safety first before helping others.</p></div>
              )}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="glass-card p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-syne font-bold flex items-center gap-2">
                <Clock size={20} className="text-textMuted" /> Recent History
              </h3>
            </div>
            
            {/* Mocked History */}
            <div className="space-y-3">
               <div className="bg-bgTertiary p-3 rounded-lg border border-borderDefault flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <span className="text-2xl">🏥</span>
                   <div>
                     <p className="font-semibold text-sm">Medical</p>
                     <p className="text-xs text-textMuted">Oct 12 • ☁️ Cloud</p>
                   </div>
                 </div>
                 <span className="px-2 py-1 bg-greenSafe/20 text-greenSafe text-xs font-bold rounded">Resolved</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
