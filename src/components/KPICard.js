import React, { useState, useEffect } from 'react';

const KPICard = ({ title, value, change, changeType, icon, color = 'var(--primary)' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val > 1000) {
        return `${(val / 1000).toFixed(1)}k`;
      }
      if (val % 1 !== 0) {
        return val.toFixed(1);
      }
    }
    return val;
  };

  return (
    <div className="kpi-card">
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div 
        className="kpi-value" 
        style={{ 
          color: color,
          transition: 'all 0.3s ease',
          transform: animatedValue ? 'scale(1)' : 'scale(0.8)'
        }}
      >
        {formatValue(animatedValue)}
      </div>
      <div className="kpi-label">{title}</div>
      {change && (
        <div className={`kpi-change ${changeType}`}>
          {changeType === 'positive' ? '↗' : '↘'} {change}
        </div>
      )}
    </div>
  );
};

export default KPICard;