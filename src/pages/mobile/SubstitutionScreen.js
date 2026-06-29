import React, { useState } from 'react';
import MobileHeader from '../../components/mobile/MobileHeader';

const SubstitutionScreen = ({ onBack, onApprove }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const substitution = {
    from: {
      name: 'Chips A',
      brand: 'Premium Snacks',
      price: '$3.99',
      stock: 0,
      status: 'Out of Stock'
    },
    to: {
      name: 'Chips B',
      brand: 'Premium Snacks', 
      price: '$4.29',
      stock: 67,
      status: 'Available'
    },
    stats: {
      acceptanceRate: 78,
      marginImpact: 10,
      expectedRecovery: 85
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      onApprove();
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="mobile-app">
        <div className="mobile-loading-overlay">
          <div className="mobile-loading-card">
            <div className="mobile-loading-spinner"></div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              Implementing Substitution...
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Updating shelf layout and inventory
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-app">
      <MobileHeader 
        title="Smart Substitution"
        subtitle="AI-powered alternative solution"
        onBack={onBack}
      />

      <div className="mobile-content">
        {/* Alert Card */}
        <div className="mobile-card" style={{ 
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FEF08A 100%)',
          border: '1px solid #F59E0B'
        }}>
          <div className="mobile-card-content">
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>
              ⚠️ No Backroom Stock Available
            </div>
            <div style={{ fontSize: '14px', color: '#92400E' }}>
              AI has automatically generated an alternative solution to maintain sales.
            </div>
          </div>
        </div>

        {/* Substitution Flow */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">Recommended Substitution</div>
            <div className="mobile-card-subtitle">Maintain customer satisfaction</div>
          </div>
          <div className="substitution-flow">
            <div className="substitution-product substitution-from">
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {substitution.from.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {substitution.from.brand} • {substitution.from.price}
              </div>
              <div style={{ 
                padding: '4px 12px', 
                background: 'var(--danger)', 
                color: 'white', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {substitution.from.status}
              </div>
            </div>

            <div className="substitution-arrow">↓</div>

            <div className="substitution-product substitution-to">
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {substitution.to.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {substitution.to.brand} • {substitution.to.price}
              </div>
              <div style={{ 
                padding: '4px 12px', 
                background: 'var(--success)', 
                color: 'white', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {substitution.to.stock} units available
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">Expected Performance</div>
          </div>
          <div className="substitution-stats">
            <div className="substitution-stat">
              <div className="stat-value">{substitution.stats.acceptanceRate}%</div>
              <div className="stat-label">Customer Acceptance</div>
            </div>
            <div className="substitution-stat">
              <div className="stat-value">+{substitution.stats.marginImpact}%</div>
              <div className="stat-label">Margin Improvement</div>
            </div>
            <div className="substitution-stat">
              <div className="stat-value">{substitution.stats.expectedRecovery}%</div>
              <div className="stat-label">Revenue Recovery</div>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">🤖 AI Analysis</div>
          </div>
          <div className="mobile-card-content">
            <div style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
              <strong>Why this substitution works:</strong>
            </div>
            <ul style={{ fontSize: '13px', lineHeight: '1.6', paddingLeft: '18px', color: 'var(--text-secondary)' }}>
              <li>Same brand family - maintains customer loyalty</li>
              <li>Similar taste profile and packaging</li>
              <li>Higher margin generates additional profit</li>
              <li>78% of customers accept this alternative</li>
              <li>Sufficient inventory to last through promotion</li>
            </ul>
          </div>
        </div>

        {/* Implementation Instructions */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">Implementation Steps</div>
          </div>
          <div className="mobile-card-content">
            <ol style={{ fontSize: '13px', lineHeight: '1.6', paddingLeft: '18px' }}>
              <li>Remove "Out of Stock" signage from Chips A</li>
              <li>Move Chips B to primary shelf position</li>
              <li>Update promotional display materials</li>
              <li>Place "Alternative Available" signage</li>
              <li>Train staff on product benefits</li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '24px' }}>
          <button 
            className="mobile-btn mobile-btn-success"
            onClick={handleApprove}
          >
            ✅ Approve Substitution
          </button>
          
          <button 
            className="mobile-btn mobile-btn-outline"
            style={{ marginTop: '12px' }}
            onClick={onBack}
          >
            ❌ Decline & Wait for Restock
          </button>
        </div>

        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: 'rgba(34, 197, 94, 0.1)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '600' }}>
            💡 Smart Choice: This substitution will protect ~85% of expected revenue
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubstitutionScreen;