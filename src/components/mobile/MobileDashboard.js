import React, { useState } from 'react';
import MobileHeader from '../../components/mobile/MobileHeader';
import MobileNav from '../../components/mobile/MobileNav';
import '../../styles/mobile.css';

const MobileDashboard = ({ onTaskClick, onProductClick }) => {
  const [activeTab, setActiveTab] = useState('home');

  const criticalTasks = [
    {
      id: 'T001',
      title: 'Restock Chips A',
      priority: 'Critical',
      location: 'Aisle 3-A',
      timeEstimate: '15 min',
      urgency: 'critical'
    }
  ];

  const atRiskProducts = [
    {
      id: 'SKU001',
      name: 'Chips A',
      risk: 'Critical',
      timeRemaining: '2h 15m',
      stock: 34
    },
    {
      id: 'SKU002', 
      name: 'Chips B',
      risk: 'Low',
      timeRemaining: '8h 30m',
      stock: 67
    }
  ];

  const renderHomeTab = () => (
    <div className="mobile-content">
      {/* Critical Alert */}
      <div className="mobile-card critical-alert">
        <div className="mobile-card-content">
          <div className="mobile-card-title">🚨 Critical Stockout Alert</div>
          <div className="mobile-card-subtitle">Chips A - Store #102</div>
          <div style={{ marginTop: '16px', fontSize: '14px' }}>
            <div>Stock remaining: <strong>34 units</strong></div>
            <div>Time until stockout: <strong>2h 15m</strong></div>
            <div>Promotion active: Buy 1 Get 1 Free</div>
          </div>
          <button 
            className="mobile-btn mobile-btn-outline"
            style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', border: 'none' }}
            onClick={() => onTaskClick('T001')}
          >
            View Task →
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <div className="mobile-card-title">Today's Overview</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '20px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--danger)' }}>1</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Critical Tasks</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--warning)' }}>3</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>At-Risk Items</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>7</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completed</div>
          </div>
        </div>
      </div>

      {/* Critical Tasks */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <div className="mobile-card-title">Critical Tasks</div>
          <div className="mobile-card-subtitle">Immediate attention required</div>
        </div>
        {criticalTasks.map(task => (
          <div key={task.id} className="at-risk-product" style={{ cursor: 'pointer' }} onClick={() => onTaskClick(task.id)}>
            <div style={{ fontSize: '24px' }}>⚡</div>
            <div className="product-info">
              <div className="product-name">{task.title}</div>
              <div className="product-status">
                📍 {task.location} • ⏱️ {task.timeEstimate}
              </div>
            </div>
            <div className="risk-indicator risk-critical">
              {task.priority}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <div className="mobile-card-title">Quick Actions</div>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button className="mobile-btn mobile-btn-primary">
            📋 View All Tasks
          </button>
          <button className="mobile-btn mobile-btn-outline">
            📦 Scan Product
          </button>
        </div>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="mobile-content">
      <div className="mobile-card task-card">
        <div className="mobile-card-content">
          <div className="task-priority priority-critical">Critical</div>
          <div className="mobile-card-title">Restock Chips A</div>
          <div className="task-meta">
            <div className="task-location">📍 Aisle 3, Section A</div>
            <div className="task-time">⏱️ 15 min</div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Move 20 units from backroom to shelf. Update promotional display.
          </div>
          <button 
            className="mobile-btn mobile-btn-danger"
            onClick={() => onTaskClick('T001')}
          >
            🚀 Start Task
          </button>
        </div>
      </div>

      <div className="mobile-card">
        <div className="mobile-card-content">
          <div className="task-priority priority-high">High</div>
          <div className="mobile-card-title">Verify Shelf Display</div>
          <div className="task-meta">
            <div className="task-location">📍 Aisle 3, Section B</div>
            <div className="task-time">⏱️ 10 min</div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Verify promotional display is properly arranged.
          </div>
          <button className="mobile-btn mobile-btn-primary">
            ▶️ Start Task
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="mobile-content">
      <div className="mobile-card">
        <div className="mobile-card-header">
          <div className="mobile-card-title">At-Risk Products</div>
          <div className="mobile-card-subtitle">Items requiring attention</div>
        </div>
        {atRiskProducts.map(product => (
          <div 
            key={product.id} 
            className="at-risk-product" 
            style={{ cursor: 'pointer' }}
            onClick={() => onProductClick(product.id)}
          >
            <div className="product-image">📦</div>
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-status">
                {product.stock} units • {product.timeRemaining} remaining
              </div>
            </div>
            <div className={`risk-indicator ${product.risk === 'Critical' ? 'risk-critical' : 'risk-high'}`}>
              {product.risk}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="mobile-content">
      <div className="mobile-card">
        <div className="mobile-card-content" style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 auto 16px'
          }}>
            JD
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>John Doe</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Store Associate</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Store #102 - Downtown</div>
        </div>
      </div>

      <div className="mobile-card">
        <div className="mobile-card-header">
          <div className="mobile-card-title">Today's Performance</div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Tasks Completed</span>
            <strong>7/8</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Efficiency Score</span>
            <strong style={{ color: 'var(--success)' }}>94%</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Revenue Protected</span>
            <strong style={{ color: 'var(--success)' }}>$2,450</strong>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return renderHomeTab();
      case 'tasks': return renderTasksTab();
      case 'products': return renderProductsTab();
      case 'profile': return renderProfileTab();
      default: return renderHomeTab();
    }
  };

  return (
    <div className="mobile-app">
      <MobileHeader 
        title="Shelf Intelligence" 
        subtitle="Store #102 - Downtown"
        notificationCount={1}
      />
      
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {renderContent()}
    </div>
  );
};

export default MobileDashboard;