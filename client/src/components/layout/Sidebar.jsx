import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart2, ShieldAlert, Users, HardHat, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <BarChart2 size={20} /> },
    { name: 'Alert Monitor', path: '/admin/alerts', icon: <ShieldAlert size={20} /> },
    { name: 'Responders', path: '/admin/responders', icon: <HardHat size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'System Logs', path: '/admin/logs', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-bgSecondary border-r border-borderDefault h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <span className="text-2xl font-syne font-bold tracking-wider">D<span className="text-redSos">⚡</span>EAN</span>
        <span className="ml-2 text-xs text-textMuted bg-bgTertiary px-2 py-1 rounded">ADMIN</span>
      </div>

      <nav className="flex-1 mt-6 flex flex-col gap-2 px-4">
        {navItems.map(item => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            end={item.path === '/admin'}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-red-glow/10 text-redSos border-l-2 border-redSos' : 'text-textSecondary hover:bg-bgTertiary hover:text-white'}`}
          >
            {item.icon}
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-borderDefault mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blueCloud/20 text-blueCloud flex items-center justify-center font-bold">A</div>
             <div>
               <p className="text-sm font-bold text-textPrimary">{user?.name}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="text-textSecondary hover:text-redSos" title="Logout"><LogOut size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-greenSafe animate-pulse"></span>
           <span className="text-xs text-textMuted">System Operational</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
