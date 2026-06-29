import React from 'react';

const Navbar = ({ currentView }) => {
  const getViewTitle = (view) => {
    switch(view) {
      case 'dashboard': return 'AI Dashboard';
      case 'analytics': return 'Analytics & Forecasting';
      case 'tasks': return 'Task Management';
      case 'inventory': return 'Inventory Overview';
      case 'promotions': return 'Promotion Performance';
      case 'reports': return 'Reports & Insights';
      case 'settings': return 'System Settings';
      default: return 'Shelf Intelligence';
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>{getViewTitle(currentView)}</h1>
      </div>
      
      <div className="navbar-right">
        <select className="store-selector">
          <option>Store #102 - Downtown</option>
          <option>Store #103 - Mall</option>
          <option>Store #104 - Suburban</option>
        </select>
        
        <div className="user-avatar">
          JD
        </div>
      </div>
    </div>
  );
};

export default Navbar;