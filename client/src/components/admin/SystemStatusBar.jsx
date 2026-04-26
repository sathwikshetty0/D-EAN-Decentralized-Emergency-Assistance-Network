import React from 'react';

const SystemStatusBar = () => {
  return (
    <div className="bg-[#1C2333] border border-borderDefault rounded-xl px-6 py-3 flex items-center justify-between text-sm">
      <div className="flex gap-8">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-greenSafe rounded-full"></span> <span className="text-textSecondary">System:</span> <span className="font-bold text-white">OPERATIONAL</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-greenSafe rounded-full"></span> <span className="text-textSecondary">Database:</span> <span className="font-bold text-white">Connected</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blueCloud rounded-full"></span> <span className="text-textSecondary">Mode:</span> <span className="font-bold text-white">Hybrid Cloud/P2P</span></div>
      </div>
    </div>
  );
};

export default SystemStatusBar;
