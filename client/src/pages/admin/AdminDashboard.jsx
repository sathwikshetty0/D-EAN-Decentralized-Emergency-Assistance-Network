import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import StatsCard from '../../components/admin/StatsCard';
import LiveFeed from '../../components/admin/LiveFeed';
import SystemStatusBar from '../../components/admin/SystemStatusBar';
import api from '../../utils/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="pl-64 min-h-screen bg-bgPrimary flex items-center justify-center">Loading...</div>;

  const COLORS = ['#FF2D55', '#F59E0B', '#3B82F6', '#10B981', '#A855F7'];

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 max-w-[1400px] w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-syne font-bold">Admin Overview</h1>
        </div>

        <div className="mb-8"><SystemStatusBar /></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Active Alerts" value={stats.activeAlerts} icon="🔴" colorClass="border-l-redSos" trend={12} />
          <StatsCard title="Resolved Today" value={stats.resolvedToday} icon="✅" colorClass="border-l-greenSafe" trend={5} />
          <StatsCard title="Online Responders" value={stats.onlineResponders} icon="🦺" colorClass="border-l-blueCloud" />
          <StatsCard title="P2P Events" value={stats.p2pEvents} icon="📡" colorClass="border-l-orangeP2p" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-lg font-syne font-bold mb-4">Alerts Overview (Last 7 Days)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.alertsPerDay}>
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ backgroundColor: '#232D40', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="count" stroke="#FF2D55" strokeWidth={3} dot={{ fill: '#FF2D55', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-syne font-bold mb-4">Emergency Types</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.alertTypesDistribution} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {stats.alertTypesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#232D40', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-textSecondary mt-2">
               {stats.alertTypesDistribution.slice(0,3).map((t, i) => (
                 <div key={t.name} className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></span> {t.name}
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3"><LiveFeed /></div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
