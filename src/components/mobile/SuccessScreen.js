import React, { useEffect } from 'react';
import MobileHeader from '../../components/mobile/MobileHeader';

const SuccessScreen = ({ onBackToHome, type = 'restock' }) => {
  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      onBackToHome();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onBackToHome]);

  const getSuccessContent = () => {
    switch(type) {
      case 'substitution':
        return {
          title: 'Substitution Implemented!',
          subtitle: 'Alternative solution activated',
          icon: '🔄',
          message: 'Chips B successfully positioned as primary offering',
          impact: [
            { label: 'Revenue Protected', value: '$1,088', color: 'var(--success)' },
            { label: 'Customer Satisfaction', value: '78%', color: 'var(--success)' },
            { label: 'Margin Improvement', value: '+10%', color: 'var(--primary)' }
          ]
        };
      default:
        return {
          title: 'Task Completed!',
          subtitle: 'Shelf successfully restocked',
          icon: '✅',
          message: 'Premium Chips A inventory replenished - New total: 74 units (added 40)',
          impact: [
            { label: 'Revenue Protected', value: '$1,280', color: 'var(--success)' },
            { label: 'Stockout Risk Reduced', value: '96% → 5%', color: 'var(--success)' },
            { label: 'Safety Buffer Created', value: '3 hours', color: 'var(--primary)' }
          ]
        };
    }
  };

  const content = getSuccessContent();

  return (
    <div className="mobile-app">
      <MobileHeader 
        title="Success"
        subtitle="Task completed successfully"
      />

      <div className="mobile-content">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-icon">
            {content.icon}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {content.title}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {content.subtitle}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '32px', lineHeight: '1.5' }}>
            {content.message}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">Business Impact</div>
            <div className="mobile-card-subtitle">Measurable results from your action</div>
          </div>
          <div className="mobile-card-content">
            {content.impact.map((metric, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: index < content.impact.length - 1 ? '16px' : '0'
              }}>
                <span style={{ fontSize: '14px' }}>{metric.label}</span>
                <strong style={{ fontSize: '16px', color: metric.color }}>
                  {metric.value}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">Your Performance</div>
          </div>
          <div className="mobile-card-content">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--success)', marginBottom: '4px' }}>
                Excellent!
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Task completed efficiently and accurately
              </div>
            </div>

            <div style={{ 
              background: 'var(--neutral-light)', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px' }}>Time to Complete</span>
                <strong style={{ fontSize: '13px' }}>12 minutes</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px' }}>Accuracy Score</span>
                <strong style={{ fontSize: '13px', color: 'var(--success)' }}>100%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>Efficiency Rating</span>
                <strong style={{ fontSize: '13px', color: 'var(--success)' }}>A+</strong>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              padding: '12px', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '600' }}>
                🎯 Great job! Your quick action prevented a critical stockout.
              </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <div className="mobile-card-title">What's Next?</div>
          </div>
          <div className="mobile-card-content">
            <div style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
              The system will continue monitoring shelf levels and alert you if additional action is needed.
            </div>
            
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              • Automated inventory tracking activated<br/>
              • Sales performance monitoring enabled<br/>
              • Next restock prediction: 6-8 hours<br/>
              • Promotion performance: being tracked
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '24px' }}>
          <button 
            className="mobile-btn mobile-btn-primary"
            onClick={onBackToHome}
          >
            🏠 Back to Dashboard
          </button>
          
          <div style={{ 
            marginTop: '16px', 
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            Redirecting automatically in a few seconds...
          </div>
        </div>

        {/* Achievement Badge */}
        <div style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--warning)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          animation: 'slideInUp 0.5s ease',
          zIndex: 1000
        }}>
          🏆 Achievement: Crisis Averted!
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;