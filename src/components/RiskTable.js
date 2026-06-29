import React from 'react';
import { stockRiskData, riskLevels } from '../data/mockData';

const RiskTable = ({ onSKUClick }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Stock Risk Analysis</div>
        <div className="card-subtitle">Real-time stockout predictions and recommendations</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
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
                    {riskLevels[item.riskLevel].label}
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
      </div>
    </div>
  );
};

export default RiskTable;