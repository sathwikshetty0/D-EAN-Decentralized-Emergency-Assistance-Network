import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Check, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const SKILLS = ['First Aid', 'CPR', 'Fire Safety', 'Flood Response', 'Trauma Support', 'Vehicle Rescue'];

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'responder' ? 'responder' : 'user';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    skills: [],
    zone: '',
    location: null,
    terms: false
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
          toast.success("Location captured");
        },
        (err) => toast.error("Could not get location. Enter zone manually.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!formData.terms && step === 3) {
      return toast.error("You must agree to the terms");
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData);
      toast.success('Account created successfully! 🎉');
      setTimeout(() => {
        if (user.role === 'responder') navigate('/responder');
        else navigate('/dashboard');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-6 left-6 text-xl font-syne font-bold">D<span className="text-redSos">⚡</span>EAN</Link>
      
      <div className="w-full max-w-[480px]">
        {/* Progress bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= i ? 'bg-redSos text-white' : 'bg-bgTertiary text-textMuted'}`}>
                {step > i ? <Check size={16} /> : i}
              </div>
              {i < 3 && <div className={`h-1 w-12 rounded ${step > i ? 'bg-redSos' : 'bg-bgTertiary'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <motion.div className="glass-card p-8 border-borderActive">
          <AnimatePresence mode="wait">
            <motion.form 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-syne font-bold mb-2">Create Account</h2>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 focus:outline-none focus:border-redSos" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 focus:outline-none focus:border-redSos" />
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Phone (+91)" className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 focus:outline-none focus:border-redSos" />
                  <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 focus:outline-none focus:border-redSos" />
                  <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 focus:outline-none focus:border-redSos" />
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-syne font-bold mb-2">Choose Role</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div onClick={() => setFormData({...formData, role: 'user'})} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.role === 'user' ? 'border-redSos bg-red-glow/10' : 'border-borderDefault bg-bgTertiary'}`}>
                      <span className="text-3xl">🙋</span>
                      <span className="font-bold">I need help</span>
                    </div>
                    <div onClick={() => setFormData({...formData, role: 'responder'})} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.role === 'responder' ? 'border-redSos bg-red-glow/10' : 'border-borderDefault bg-bgTertiary'}`}>
                      <span className="text-3xl">🦺</span>
                      <span className="font-bold">I can help</span>
                    </div>
                  </div>

                  {formData.role === 'responder' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 flex flex-col gap-4">
                      <p className="text-sm text-textSecondary font-semibold">Select your skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS.map(skill => (
                          <span key={skill} onClick={() => handleSkillToggle(skill)} className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${formData.skills.includes(skill) ? 'bg-blueCloud border-blueCloud text-white' : 'border-borderDefault text-textSecondary'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      <input type="text" name="zone" required={formData.role === 'responder'} value={formData.zone} onChange={handleChange} placeholder="Coverage Zone (e.g. Kadri)" className="w-full bg-bgTertiary border border-borderDefault rounded-xl px-4 py-3 focus:outline-none focus:border-redSos mt-2" />
                      <p className="text-xs text-orange-400">Note: Your responder profile will require admin verification.</p>
                    </motion.div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-syne font-bold mb-2">Location setup</h2>
                  
                  <button type="button" onClick={requestLocation} className="w-full py-3 rounded-xl border-2 border-borderDefault flex justify-center items-center gap-2 hover:border-white transition-colors">
                    <MapPin size={20} /> Allow location access
                  </button>

                  {formData.location && (
                    <div className="h-32 rounded-xl overflow-hidden mt-2">
                      <MapContainer center={[formData.location.lat, formData.location.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        <Marker position={[formData.location.lat, formData.location.lng]} />
                      </MapContainer>
                    </div>
                  )}

                  <label className="flex items-center gap-3 mt-4 cursor-pointer text-sm text-textSecondary">
                    <input type="checkbox" name="terms" checked={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.checked})} className="w-5 h-5 rounded accent-redSos bg-bgTertiary border-borderDefault" />
                    I agree to be contacted in emergencies and accept the terms of service.
                  </label>
                </>
              )}

              <div className="flex gap-4 mt-4">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-full border border-borderDefault hover:bg-bgTertiary transition-colors">
                    Back
                  </button>
                )}
                <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-redSos to-[#CC0033] py-3 rounded-full font-bold shadow-lg hover:shadow-red-glow transition-all hover:scale-[1.02] disabled:opacity-70">
                  {loading ? 'Processing...' : step === 3 ? 'Complete Registration' : 'Continue'}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </motion.div>
        
        {step === 1 && (
          <p className="text-center mt-6 text-textSecondary">
            Already have an account? <Link to="/login" className="text-white font-semibold hover:text-redSos transition-colors">Login</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
