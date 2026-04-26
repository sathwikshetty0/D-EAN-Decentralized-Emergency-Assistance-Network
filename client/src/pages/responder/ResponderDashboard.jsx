import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import AlertCard from '../../components/alert/AlertCard';
import ActiveMission from './ActiveMission';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Activity, Clock, Award, ShieldCheck, Check } from 'lucide-react';

const ResponderDashboard = () => {
  const { user, updateAvailability } = useAuth();
  const { pendingAlerts, setPendingAlerts, activeAlert, setActiveAlert } = useAlerts();
  const { socket } = useSocket();
  const [stats, setStats] = useState({ totalResponses: 0, thisWeek: 0, avgResponseTime: '-', successRate: '-' });
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/responders/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [activeAlert]);

  const toggleAvailability = async () => {
    try {
      const newState = await updateAvailability();
      setIsAvailable(newState);
      toast.success(newState ? 'You are now online' : 'You are now offline');
    } catch (err) {
      toast.error('Failed to update availability');
    }
  };

  const handleAccept = async (alertId) => {
    try {
      const res = await api.patch(`/alerts/${alertId}/accept`);
      setActiveAlert(res.data);
      setPendingAlerts(prev => prev.filter(a => a.alertId !== alertId));
      if (socket) {
        socket.emit('alert-status-update', { alertId, status: 'accepted', responderId: user._id });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept alert');
      // If someone else accepted it, remove it from the list
      setPendingAlerts(prev => prev.filter(a => a.alertId !== alertId));
    }
  };

  const handleDecline = (alertId) => {
    setPendingAlerts(prev => prev.filter(a => a.alertId !== alertId));
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col">
      <Navbar />

      {/* Availability Toggle */}
      <div className="w-full bg-bgSecondary border-b border-borderDefault py-4 px-6 md:px-12 flex justify-center">
        <button 
          onClick={toggleAvailability}
          className={`flex items-center gap-3 px-6 py-2 rounded-full font-bold transition-all border-2 ${isAvailable ? 'bg-greenSafe/10 border-greenSafe text-greenSafe shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-bgTertiary border-textMuted text-textMuted'}`}
        >
          {isAvailable ? (
            <> <span className="w-2.5 h-2.5 bg-greenSafe rounded-full animate-pulse"></span> ⚡ AVAILABLE — Receiving Alerts </>
          ) : (
            <> <span className="w-2.5 h-2.5 bg-textMuted rounded-full"></span> ⏸ UNAVAILABLE — On Break </>
          )}
        </button>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column - Active Mission or Pending Alerts */}
        <div className="flex-[2] flex flex-col gap-6">
          {activeAlert ? (
             <ActiveMission mission={activeAlert} />
          ) : (
             <div className="flex flex-col gap-4">
               <h2 className="text-2xl font-syne font-bold">Incoming Alerts</h2>
               {pendingAlerts.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {pendingAlerts.map(alert => (
                     <AlertCard key={alert.alertId} alert={alert} onAccept={handleAccept} onDecline={handleDecline} />
                   ))}
                 </div>
               ) : (
                 <div className="glass-card flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                   <ShieldCheck size={64} className="text-greenSafe/50 mb-4" />
                   <h3 className="text-xl font-bold text-textPrimary mb-2">All clear</h3>
                   <p className="text-textSecondary max-w-sm">No active alerts in your zone right now. Keep your availability on to receive notifications.</p>
                 </div>
               )}
             </div>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-syne font-bold mb-6">Your Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bgTertiary p-4 rounded-xl border border-borderDefault">
                <Activity size={24} className="text-blueCloud mb-2" />
                <p className="text-2xl font-bold">{stats.totalResponses}</p>
                <p className="text-xs text-textMuted uppercase tracking-wide">Total Responses</p>
              </div>
              <div className="bg-bgTertiary p-4 rounded-xl border border-borderDefault">
                <Clock size={24} className="text-orangeP2p mb-2" />
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-xs text-textMuted uppercase tracking-wide">This Week</p>
              </div>
              <div className="bg-bgTertiary p-4 rounded-xl border border-borderDefault">
                <span className="text-2xl mb-2 block">⚡</span>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                <p className="text-xs text-textMuted uppercase tracking-wide">Avg Time</p>
              </div>
              <div className="bg-bgTertiary p-4 rounded-xl border border-borderDefault">
                <Award size={24} className="text-greenSafe mb-2" />
                <p className="text-2xl font-bold">{stats.successRate}</p>
                <p className="text-xs text-textMuted uppercase tracking-wide">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ResponderDashboard;
