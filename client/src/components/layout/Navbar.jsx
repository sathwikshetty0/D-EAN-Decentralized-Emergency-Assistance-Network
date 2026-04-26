import React from 'react';
import { useAuth } from '../../context/AuthContext';
import NetworkBadge from '../shared/NetworkBadge';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-borderDefault bg-bgPrimary sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-xl font-syne font-bold tracking-wider mr-4">D<span className="text-redSos">⚡</span>EAN</div>
        <h2 className="text-lg font-syne font-semibold">
          {getGreeting()}, {user.name.split(' ')[0]}
          {user.role === 'responder' && <span className="ml-2 px-2 py-0.5 text-xs bg-blueCloud/20 text-blueCloud border border-blueCloud/50 rounded-full">🦺 Responder</span>}
        </h2>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <NetworkBadge />
      </div>

      <div className="flex items-center gap-4">
        <div className="md:hidden"><NetworkBadge /></div>
        <button className="relative p-2 text-textSecondary hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-redSos rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bgTertiary border border-borderActive flex items-center justify-center text-textPrimary font-bold">
            {user.name.charAt(0)}
          </div>
          <button onClick={handleLogout} className="text-textSecondary hover:text-redSos transition-colors p-2" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
