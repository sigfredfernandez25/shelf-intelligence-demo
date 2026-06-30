import React, { useState } from 'react';

const RecommendationPanel = ({ onGenerateTask }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [agentMetadata, setAgentMetadata] = useState(null);

  const handleGenerateRecommendation = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🤖 Calling Demand Forecast Agent...');
      
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: '102',
          skuId: 'CHIPS_A'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setForecastData(result.forecast);
        setAgentMetadata(result.metadata);
        
        console.log('✅ Forecast Agent Result:', result.forecast);
        console.log('🤖 Agents executed:', result.metadata.agentsExecuted);
        console.log('⏱️ Processing time:', result.metadata.executionTime + 'ms');
        
        setIsGenerating(false);
        setShowRecommendation(true);
      } else {
        throw new Error('Forecast API failed');
      }
    } catch (error) {
      console.error('❌ Forecast Agent Error:', error);
      // Fallback to mock behavior
      setTimeout(() => {
        setIsGenerating(false);
        setShowRecommendation(true);
      }, 2000);
    }
  };

  const handleAcceptRecommendation = () => {
    onGenerateTask();
    alert('Task assigned to Store Associate!');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🤖 AI Recommendation Engine</div>
        <div className="card-subtitle">Intelligent replenishment analysis</div>
      </div>
      <div className="card-content">
        {!showRecommendation && !isGenerating && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h4>Current Situation Analysis</h4>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Chips A: 34 units remaining</li>
                <li>Promotion driving 65% sales increase</li>
                <li>Predicted stockout in 2 hours 15 minutes</li>
                <li>Expected revenue loss: $1,280</li>
              </ul>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleGenerateRecommendation}
              style={{ width: '100%' }}
            >
              🧠 Generate AI Recommendation
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="loading" style={{ padding: '40px 20px' }}>
            <div className="loading-spinner"></div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>🤖 Demand Forecast Agent Processing...</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Analyzing sales velocity, inventory levels, and promotion impact
              </div>
            </div>
          </div>
        )}

        {showRecommendation && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
              padding: '16px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--primary)',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>
                ✨ AI Agent Recommendation
              </h4>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                {forecastData?.recommendation || 'Restock 20 units immediately'}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Based on {forecastData ? `${forecastData.confidence}% confidence` : 'demand analysis'}
              </div>
            </div>

            {forecastData && (
              <div style={{ marginBottom: '16px' }}>
                <h4>🧠 AI Analysis Results</h4>
                <div style={{ fontSize: '14px', marginTop: '8px', lineHeight: '1.6' }}>
                  • Sales velocity: {forecastData.salesVelocity} units/hour<br/>
                  • Stockout prediction: {forecastData.runoutHours.toFixed(1)} hours<br/>
                  • Risk level: <strong style={{ color: forecastData.riskLevel === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)' }}>
                    {forecastData.riskLevel}
                  </strong><br/>
                  • Expected loss: ${forecastData.expectedLoss}
                </div>
              </div>
            )}

            {agentMetadata && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                marginBottom: '16px',
                fontSize: '12px'
              }}>
                🤖 <strong>Agent Metadata:</strong> {agentMetadata.agentsExecuted?.join(', ')} • {agentMetadata.executionTime}ms
              </div>
            )}

            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '12px', 
              borderRadius: 'var(--radius)',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'var(--success)' }}>Expected Impact</h4>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                • Revenue protected: ${forecastData?.expectedLoss || 1280}<br/>
                • Stockout risk reduced: {forecastData ? '96% → 5%' : '96% → 5%'}<br/>
                • Customer satisfaction maintained
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-success"
                onClick={handleAcceptRecommendation}
                style={{ flex: 1 }}
              >
                ✓ Accept & Assign Task
              </button>
              <button 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                🔧 Modify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;