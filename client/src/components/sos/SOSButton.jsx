import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { Radio } from 'lucide-react';

const SOSButton = ({ onTrigger, loading }) => {
  const { mode } = useNetwork();
  
  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={onTrigger}
        disabled={loading}
        className={`sos-button ${mode === 'p2p' ? 'p2p-mode' : ''} ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <span className="text-xl">SENDING...</span>
        ) : (
          <>
            <span>SOS</span>
          </>
        )}
      </button>
      
      {mode === 'p2p' && (
        <div className="mt-8 flex items-center gap-2 text-orange-400">
          <Radio size={16} />
          <span className="text-sm font-semibold">P2P Mode Active</span>
        </div>
      )}
      
      <p className="text-sm text-text-muted mt-4 max-w-[250px] text-center">
        Alert will be sent to all available responders in your area
      </p>
    </div>
  );
};

export default SOSButton;
