import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ResponderManagement = () => {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponders();
  }, []);

  const fetchResponders = async () => {
    try {
      const res = await api.get('/admin/responders');
      setResponders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/responders/${id}/toggle`);
      setResponders(responders.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r));
      toast.success("Responder status updated");
    } catch (err) {
      toast.error("Failed to update responder");
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-[1400px] w-full">
        <h1 className="text-3xl font-syne font-bold mb-8">Responders</h1>
        
        {loading ? (
           <div className="text-center py-12 text-textMuted">Loading responders...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responders.map(r => (
              <div key={r._id} className="glass-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4 border-b border-borderDefault pb-4">
                  <div className="w-12 h-12 rounded-full bg-blueCloud/20 text-blueCloud flex items-center justify-center font-bold text-lg">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{r.name}</h3>
                    <p className="text-sm text-textSecondary">{r.email}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p><span className="text-textMuted">Zone:</span> {r.zone || 'N/A'}</p>
                  <p className="mt-1"><span className="text-textMuted">Skills:</span> {r.skills?.join(', ') || 'None'}</p>
                  <p className="mt-1"><span className="text-textMuted">Responses:</span> {r.totalAlertsResponded || 0}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-textMuted">Status:</span> 
                    <span className={`flex items-center gap-1 ${r.isAvailable ? 'text-greenSafe' : 'text-textMuted'}`}>
                       <span className={`w-2 h-2 rounded-full ${r.isAvailable ? 'bg-greenSafe' : 'bg-textMuted'}`}></span>
                       {r.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  <button 
                    onClick={() => handleToggle(r._id)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${r.isActive ? 'border border-redSos/50 text-redSos hover:bg-redSos/10' : 'bg-greenSafe text-white hover:bg-[#059669]'}`}
                  >
                    {r.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="flex-1 border border-borderDefault py-2 rounded-lg text-sm font-semibold hover:bg-bgTertiary transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResponderManagement;
