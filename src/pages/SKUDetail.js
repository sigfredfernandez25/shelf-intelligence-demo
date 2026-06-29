import React, { useState } from 'react';
import { products, substitutions } from '../data/mockData';

const SKUDetail = ({ sku, onBack, onGenerateRecommendation }) => {
  const [showSubstitution, setShowSubstitution] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const product = products.find(p => p.id === sku);
  const substitution = substitutions.find(s => s.originalSKU === sku);

  if (!product) {
    return (
      <div className="dashboard">
        <div className="card">
          <div className="card-content">
            <h2>Product not found</h2>
            <button className="btn btn-primary" onClick={onBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateRecommendation = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      onGenerateRecommendation();
    }, 2000);
  };

  const handleShowSubstitution = () => {
    setShowSubstitution(true);
  };

  const shelfUtilization = (product.currentStock / product.shelfCapacity) * 100;
  const marginDollars = (product.price - product.cost).toFixed(2);

  return (
    <div className="dashboard">
      <div style={{ marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Product Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Product Details</div>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
              <img 
                src={product.image} 
                alt={product.name}
                style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)' }}
              />
              <div>
                <h2 style={{ marginBottom: '4px' }}>{product.name}</h2>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{product.brand}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  ${product.price}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Margin: ${marginDollars} ({product.margin}%)
                </div>
              </div>
            </div>

            {product.promotion?.active && (
              <div style={{
                background: 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: 'var(--radius)',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: '600' }}>🏷️ Active Promotion</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>
                  {product.promotion.type} • +{product.promotion.lift}% sales lift
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  CURRENT STOCK
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>{product.currentStock} units</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  BACKROOM STOCK
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: product.backroomStock === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {product.backroomStock} units
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shelf Analytics */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Shelf Analytics</div>
          </div>
          <div className="card-content">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                SHELF UTILIZATION
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, background: 'var(--neutral)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${shelfUtilization}%`, 
                      height: '100%', 
                      background: shelfUtilization < 30 ? 'var(--danger)' : shelfUtilization < 70 ? 'var(--warning)' : 'var(--success)',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {shelfUtilization.toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  SHELF CAPACITY
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{product.shelfCapacity} units</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  CATEGORY
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{product.category}</div>
              </div>
            </div>

            {shelfUtilization < 50 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '14px' }}>
                  ⚠️ Low Shelf Utilization
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Current stock level is critically low for ongoing promotion
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stockout Prediction */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">AI Stockout Prediction</div>
          </div>
          <div className="card-content">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                margin: '0 auto 16px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--neutral)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--danger)"
                    strokeWidth="8"
                    strokeDasharray="314"
                    strokeDashoffset="31.4"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div style={{ 
                  position: 'absolute',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--danger)' }}>96%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>CONFIDENCE</div>
                </div>
              </div>
              
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: 'var(--danger)', 
                marginBottom: '8px' 
              }}>
                Stockout in 2h 15m
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Based on current sales velocity
              </div>
            </div>

            <div style={{
              background: 'var(--neutral-light)',
              padding: '12px',
              borderRadius: 'var(--radius)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                DEPLETION FACTORS
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                • Promotion driving 65% sales increase<br/>
                • Weekend shopping surge expected<br/>
                • No backroom inventory available<br/>
                • Current rate: 17 units/hour
              </div>
            </div>

            {!loading && (
              <button 
                className="btn btn-danger" 
                onClick={handleGenerateRecommendation}
                style={{ width: '100%' }}
              >
                🧠 Generate AI Recommendation
              </button>
            )}

            {loading && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <span>AI analyzing optimal solution...</span>
              </div>
            )}
          </div>
        </div>

        {/* Substitution Analysis */}
        {substitution && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Substitution Analysis</div>
            </div>
            <div className="card-content">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Recommended Substitute
                </div>
                <div style={{ display: 'flex', align: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📦</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>Chips B</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Premium Snacks</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--neutral-light)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
                    {substitution.acceptanceRate}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Acceptance Rate</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--neutral-light)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
                    +{substitution.marginImpact}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Margin Impact</div>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleShowSubstitution}
                style={{ width: '100%' }}
                disabled={product.backroomStock > 0}
              >
                {product.backroomStock > 0 ? 'Restock Available' : 'View Substitution Plan'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showSubstitution && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Substitution Recommendation</h2>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                <span style={{ padding: '8px 16px', background: 'var(--danger)', color: 'white', borderRadius: 'var(--radius)' }}>
                  Chips A
                </span>
                <span style={{ margin: '0 16px', fontSize: '24px' }}>→</span>
                <span style={{ padding: '8px 16px', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius)' }}>
                  Chips B
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>Expected Outcomes:</h4>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>78% customer acceptance rate</li>
                <li>+10% margin improvement</li>
                <li>85% revenue recovery</li>
                <li>Maintains customer satisfaction</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-success" 
                style={{ flex: 1 }}
                onClick={() => {
                  setShowSubstitution(false);
                  alert('Substitution plan activated! Task assigned to store associate.');
                }}
              >
                ✓ Approve Substitution
              </button>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => setShowSubstitution(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SKUDetail;