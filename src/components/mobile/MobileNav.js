import React from 'react';

const MobileNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <div className="mobile-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <div className="mobile-nav-icon">{item.icon}</div>
          <div className="mobile-nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default MobileNav;