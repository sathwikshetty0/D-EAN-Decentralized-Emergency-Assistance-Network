import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import AlertTable from '../../components/admin/AlertTable';
import api from '../../utils/api';

const AlertMonitor = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/admin/alerts');
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleExport = () => {
    window.open('http://localhost:5000/api/admin/export/alerts', '_blank');
  };

  const filteredAlerts = alerts.filter(a => 
    a.alertId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.location.address && a.location.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-[1400px] w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-syne font-bold">Alert Monitor</h1>
          <button onClick={handleExport} className="bg-bgTertiary border border-borderDefault px-4 py-2 rounded-lg text-sm font-semibold hover:text-white transition-colors">
            Export CSV
          </button>
        </div>

        <div className="glass-card p-6 min-h-[500px]">
          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Search by ID or Location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bgTertiary border border-borderDefault px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-redSos min-w-[300px]"
            />
            {/* Additional filters would go here */}
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-textMuted">Loading alerts...</div>
          ) : (
            <AlertTable alerts={filteredAlerts} onView={(alert) => console.log(alert)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AlertMonitor;
