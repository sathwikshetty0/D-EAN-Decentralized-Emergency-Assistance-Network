import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NetworkBadge from '../components/shared/NetworkBadge';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Login successful!');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'responder') navigate('/responder');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bgPrimary">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex w-[40%] bg-bgSecondary flex-col justify-center items-center p-12 relative overflow-hidden border-r border-borderDefault">
        <div className="absolute top-0 inset-x-0 h-64 bg-red-glow blur-[100px] opacity-30"></div>
        <h2 className="text-4xl font-syne font-bold text-center z-10 leading-snug">
          "Your SOS,<br/>always heard."
        </h2>
        <div className="mt-12 z-10">
           <NetworkBadge />
        </div>
        <p className="absolute bottom-8 text-textMuted text-sm font-semibold">Serving Mangaluru & surroundings</p>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center items-center p-6 md:p-12 relative">
        <Link to="/" className="absolute top-6 left-6 text-xl font-syne font-bold">D<span className="text-redSos">⚡</span>EAN</Link>
        <div className="absolute top-6 right-6 lg:hidden"><NetworkBadge /></div>

        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-syne font-bold mb-2">Welcome back</h1>
          <p className="text-textSecondary mb-8">Login to your account to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-redSos transition-colors"
              />
            </div>
            <div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-redSos transition-colors"
              />
            </div>
            
            <div className="flex justify-end">
              <span className="text-sm text-textSecondary cursor-pointer hover:text-white transition-colors">Forgot password?</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-redSos to-[#CC0033] py-3 rounded-full font-bold shadow-lg hover:shadow-red-glow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-borderDefault"></div>
            <span className="text-textMuted text-sm">or</span>
            <div className="flex-1 h-px bg-borderDefault"></div>
          </div>

          <p className="text-center mt-6 text-textSecondary">
            Don't have an account? <Link to="/register" className="text-white font-semibold hover:text-redSos transition-colors">Create new account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
