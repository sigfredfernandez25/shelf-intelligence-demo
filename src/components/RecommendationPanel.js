import React, { useState } from 'react';

const RecommendationPanel = ({ onGenerateTask }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleGenerateRecommendation = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
      setShowRecommendation(true);
    }, 2000);
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
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>AI Processing...</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Analyzing demand patterns, inventory levels, and promotion impact
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
                ✨ Recommended Action
              </h4>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Restock 20 units immediately
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Based on demand velocity and promotion duration
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4>AI Reasoning</h4>
              <div style={{ fontSize: '14px', marginTop: '8px', lineHeight: '1.6' }}>
                • Current depletion rate: 17 units/hour<br/>
                • Promotion continues for 48 hours<br/>
                • 20 units ensures 3-hour safety buffer<br/>
                • Optimal shelf capacity utilization: 85%
              </div>
            </div>

            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '12px', 
              borderRadius: 'var(--radius)',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'var(--success)' }}>Expected Impact</h4>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                • Revenue protected: $1,280<br/>
                • Stockout risk reduced: 96% → 5%<br/>
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