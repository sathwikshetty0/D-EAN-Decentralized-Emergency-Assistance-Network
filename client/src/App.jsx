import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { SocketProvider } from './context/SocketContext';
import { AlertProvider } from './context/AlertContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard imports
import UserDashboard from './pages/user/UserDashboard';
// import ResponderDashboard from './pages/responder/ResponderDashboard';
// import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bgPrimary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'responder') return <Navigate to="/responder" />;
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes placeholder */}
      <Route path="/dashboard/*" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
      {/* <Route path="/responder/*" element={<ProtectedRoute allowedRoles={['responder']}><ResponderDashboard /></ProtectedRoute>} /> */}
      {/* <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} /> */}
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <NetworkProvider>
        <AuthProvider>
          <SocketProvider>
            <AlertProvider>
              <AppRoutes />
              <Toaster position="top-right" />
            </AlertProvider>
          </SocketProvider>
        </AuthProvider>
      </NetworkProvider>
    </Router>
  );
};

export default App;
