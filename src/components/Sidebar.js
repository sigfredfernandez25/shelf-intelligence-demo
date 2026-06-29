import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'tasks', label: 'Task Board', icon: '✅' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'promotions', label: 'Promotions', icon: '🏷️' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>🧠 Shelf Intelligence</h2>
        <p>AI Replenishment Agent</p>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div style={{ padding: '24px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          <div>Store #102 - Downtown</div>
          <div style={{ marginTop: '8px', color: '#22C55E' }}>● System Online</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;