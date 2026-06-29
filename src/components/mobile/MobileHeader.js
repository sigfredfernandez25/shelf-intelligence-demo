import React from 'react';

const MobileHeader = ({ title, subtitle, onBack, notificationCount = 0 }) => {
  return (
    <div className="mobile-header">
      <div className="mobile-header-top">
        <div>
          {onBack && (
            <button className="mobile-back-btn" onClick={onBack}>
              ← Back
            </button>
          )}
          <h1>{title}</h1>
        </div>
        {notificationCount > 0 && (
          <div className="notification-badge">{notificationCount}</div>
        )}
      </div>
      {subtitle && (
        <div className="mobile-header-info">{subtitle}</div>
      )}
    </div>
  );
};

export default MobileHeader;