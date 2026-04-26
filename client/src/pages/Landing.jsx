import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-borderDefault">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-syne font-bold tracking-wider">D<span className="text-redSos">⚡</span>EAN</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-textSecondary hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-gradient-to-r from-redSos to-[#CC0033] px-6 py-2 rounded-full font-semibold shadow-[0_0_20px_rgba(255,45,85,0.4)] hover:scale-105 transition-transform">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-syne font-extrabold leading-tight mb-4">
            Emergency Help,<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-redSos to-orangeP2p">
              When Networks Fail.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-textSecondary mb-8 max-w-[500px]">
            D-EAN connects you to nearby community responders instantly — cloud or peer-to-peer, your SOS always gets through.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-gradient-to-r from-redSos to-[#CC0033] px-8 py-4 rounded-full font-bold text-center shadow-lg hover:shadow-red-glow transition-all text-lg hover:scale-105">
              Trigger SOS as User
            </Link>
            <Link to="/register?role=responder" className="border-2 border-borderDefault hover:border-white px-8 py-4 rounded-full font-bold text-center transition-all text-lg hover:scale-105">
              Become a Responder
            </Link>
          </div>
        </motion.div>

        {/* Visual Mockup */}
        <motion.div 
          className="flex-1 w-full max-w-md relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-blue-glow blur-[100px] rounded-full"></div>
          <div className="glass-card p-6 relative z-10 aspect-square flex flex-col items-center justify-center border-borderActive">
             <div className="sos-button scale-75 cursor-default hover:scale-75 hover:shadow-none pointer-events-none mb-8">
               <span>SOS</span>
             </div>
             <div className="flex justify-between w-full px-8 opacity-80">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#1E3A5F] border-2 border-blueCloud flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">☁️</div>
                  <span className="text-xs font-bold text-blueCloud">CLOUD</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#3D2B00] border-2 border-orangeP2p flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">📡</div>
                  <span className="text-xs font-bold text-orangeP2p">P2P</span>
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* How it works */}
      <section className="py-20 px-6 md:px-12 bg-bgSecondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-syne font-bold text-center mb-12">Two paths. One goal.</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="glass-card p-8 border-t-4 border-t-blueCloud hover:-translate-y-2 transition-transform">
              <h3 className="text-xl font-syne font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">☁️</span> Cloud Mode
              </h3>
              <p className="text-textSecondary">When internet is available, alerts route instantly via our secure high-speed servers to all responders in your city.</p>
            </div>
            <div className="glass-card p-8 border-t-4 border-t-orangeP2p hover:-translate-y-2 transition-transform">
              <h3 className="text-xl font-syne font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📡</span> P2P Mode
              </h3>
              <p className="text-textSecondary">Internet down? D-EAN uses local broadcast networks to find nearby devices and relays your SOS to local responders.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
