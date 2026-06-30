import React from 'react';

const RiskTable = ({ onSKUClick, riskData }) => {
  // Use provided risk data or fallback to empty array
  const stockRiskData = riskData || [];
  
  const riskLevels = {
    CRITICAL: { color: '#EF4444', threshold: 4, label: 'Critical' },
    HIGH: { color: '#F97316', threshold: 8, label: 'High' },
    MEDIUM: { color: '#F59E0B', threshold: 24, label: 'Medium' },
    LOW: { color: '#22C55E', threshold: Infinity, label: 'Low' }
  };
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Stock Risk Analysis</div>
        <div className="card-subtitle">Real-time stockout predictions and recommendations</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        {stockRiskData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              All Clear!
            </div>
            <div>No critical stock risks detected at this time.</div>
          </div>
        ) : (
          <table className="risk-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Store</th>
                <th>Product</th>
                <th>Stock</th>
                <th>Forecast</th>
                <th>Risk Level</th>
                <th>Time Left</th>
                <th>Recommended Action</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockRiskData.map((item) => (
                <tr key={`${item.sku}-${item.store}`}>
                  <td>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--primary)', 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={() => onSKUClick(item.sku)}
                    >
                      {item.sku}
                    </button>
                  </td>
                  <td>#{item.store}</td>
                  <td>{item.product}</td>
                  <td>
                    <strong>{item.currentStock}</strong> units
                    {item.salesIncrease > 0 && (
                      <div style={{ fontSize: '12px', color: 'var(--danger)' }}>
                        +{item.salesIncrease}% sales
                      </div>
                    )}
                  </td>
                  <td>{item.forecast}</td>
                  <td>
                    <span className={`risk-level ${item.riskLevel.toLowerCase()}`}>
                      {riskLevels[item.riskLevel]?.label || item.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: item.riskLevel === 'CRITICAL' ? 'var(--danger)' : 'var(--text-primary)',
                      fontWeight: item.riskLevel === 'CRITICAL' ? '600' : '400'
                    }}>
                      {item.timeRemaining}
                    </span>
                  </td>
                  <td>{item.recommendedAction}</td>
                  <td>
                    <button className={`btn ${item.riskLevel === 'CRITICAL' ? 'btn-danger' : 'btn-primary'}`}>
                      {item.riskLevel === 'CRITICAL' ? 'Act Now' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RiskTable;