import React from 'react';
import { useNetwork } from '../../context/NetworkContext';

const NetworkBadge = () => {
  const { mode } = useNetwork();

  return (
    <div className={`network-badge ${mode}`}>
      <span className="dot" />
      <span>{mode === 'cloud' ? 'ONLINE — Cloud Mode' : 'OFFLINE — P2P Active'}</span>
    </div>
  );
};

export default NetworkBadge;
