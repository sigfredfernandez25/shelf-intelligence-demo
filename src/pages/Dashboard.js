import React, { useState } from 'react';
import KPICard from '../components/KPICard';
import AlertBanner from '../components/AlertBanner';
import AgentWorkflow from '../components/AgentWorkflow';
import RiskTable from '../components/RiskTable';
import DemandChart from '../components/DemandChart';
import RecommendationPanel from '../components/RecommendationPanel';
import { kpis } from '../data/mockData';

const Dashboard = ({ onSKUClick, onSwitchToMobile }) => {
  const [taskGenerated, setTaskGenerated] = useState(false);

  const handleGenerateTask = () => {
    setTaskGenerated(true);
  };

  const handleViewDetails = () => {
    onSKUClick('SKU001');
  };

  return (
    <div className="dashboard">
      <AlertBanner onViewDetails={handleViewDetails} />
      
      <AgentWorkflow />
      
      <div className="kpi-cards">
        <KPICard
          title="At Risk SKUs"
          value={kpis.atRiskSKUs}
          change="+3 vs yesterday"
          changeType="negative"
          icon="⚠️"
          color="var(--danger)"
        />
        <KPICard
          title="Revenue Protected"
          value={`$${kpis.revenueProtected.toLocaleString()}`}
          change="+12% this week"
          changeType="positive"
          icon="💰"
          color="var(--success)"
        />
        <KPICard
          title="Tasks Pending"
          value={taskGenerated ? kpis.tasksPending + 1 : kpis.tasksPending}
          change={taskGenerated ? "+1 new task" : "2 completed today"}
          changeType={taskGenerated ? "negative" : "positive"}
          icon="📋"
          color="var(--warning)"
        />
        <KPICard
          title="Forecast Accuracy"
          value={`${kpis.forecastAccuracy}%`}
          change="+1.2% improvement"
          changeType="positive"
          icon="🎯"
          color="var(--primary)"
        />
      </div>

      <div className="dashboard-grid">
        <RiskTable onSKUClick={onSKUClick} />
        <RecommendationPanel onGenerateTask={handleGenerateTask} />
      </div>

      <div style={{ marginTop: '24px' }}>
        <DemandChart />
      </div>

      {taskGenerated && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--success)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInUp 0.3s ease'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>
            ✓ Task Created Successfully
          </div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>
            Restock task assigned to Store Associate
          </div>
          <button 
            className="btn" 
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', fontSize: '12px' }}
            onClick={onSwitchToMobile}
          >
            View Mobile Dashboard →
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;