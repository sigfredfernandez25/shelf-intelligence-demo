import React, { useState, useEffect } from 'react';

const AlertBanner = ({ onViewDetails }) => {
  const [timeRemaining, setTimeRemaining] = useState(135); // 2h 15m in minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute for demo

    return () => clearInterval(timer);
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="alert-banner">
      <div className="alert-content">
        <h3>🚨 Critical Stockout Detected</h3>
        <p>Chips A promotion causing rapid depletion - Store #102</p>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🏷️ Buy 1 Get 1 Free Active</span>
          <span className="confidence-badge">96% Confidence</span>
        </div>
      </div>
      
      <div className="countdown-timer">
        <div className="countdown-time">{formatTime(timeRemaining)}</div>
        <div className="countdown-label">Until Stockout</div>
        <button 
          className="btn btn-outline" 
          style={{ marginTop: '8px', background: 'rgba(255,255,255,0.2)', border: 'none' }}
          onClick={onViewDetails}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;