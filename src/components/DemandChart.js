import React from 'react';
import { demandForecastData } from '../data/mockData';

const DemandChart = () => {
  const maxValue = Math.max(...demandForecastData.sales, ...demandForecastData.inventory);
  const chartHeight = 200;

  const getBarHeight = (value) => {
    return (value / maxValue) * chartHeight;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Demand Forecast - Chips A</div>
        <div className="card-subtitle">Sales trend vs Inventory levels</div>
      </div>
      <div className="card-content">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: chartHeight + 40 }}>
          {demandForecastData.labels.map((label, index) => (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '8px' }}>
                {/* Sales Bar */}
                <div
                  style={{
                    width: '16px',
                    height: `${getBarHeight(demandForecastData.sales[index])}px`,
                    background: index >= 5 ? 'var(--danger)' : 'var(--primary)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Sales: ${demandForecastData.sales[index]}`}
                />
                {/* Inventory Bar */}
                <div
                  style={{
                    width: '16px',
                    height: `${getBarHeight(demandForecastData.inventory[index])}px`,
                    background: demandForecastData.inventory[index] < 50 ? 'var(--warning)' : 'var(--success)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Inventory: ${demandForecastData.inventory[index]}`}
                />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '16px', display: 'flex', gap: '24px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div>
            Sales
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '2px' }}></div>
            Inventory
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--danger)', borderRadius: '2px' }}></div>
            Critical Period
          </div>
        </div>
        
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <strong style={{ color: 'var(--danger)' }}>⚠️ Critical Insight:</strong>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>
            Sales spike of 65% during promotion will deplete inventory by Saturday. 
            Immediate restocking required to maintain availability.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandChart;