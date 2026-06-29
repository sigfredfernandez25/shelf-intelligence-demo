import React, { useState } from 'react';
import MobileHeader from '../../components/mobile/MobileHeader';

const TaskDetail = ({ taskId, onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quantity, setQuantity] = useState(20);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    { id: 'review', title: 'Review Task', icon: '👀' },
    { id: 'restock', title: 'Restock Shelf', icon: '📦' },
    { id: 'verify', title: 'Verify & Complete', icon: '✓' }
  ];

  const task = {
    id: 'T001',
    title: 'Restock Chips A',
    priority: 'Critical',
    location: 'Aisle 3, Section A',
    timeEstimate: '15 min',
    instructions: 'Move 20 units from backroom to shelf. Update promotional display.',
    product: 'Chips A',
    currentStock: 34,
    recommendedQuantity: 20
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Simulate task completion
    setTimeout(() => {
      setIsCompleting(false);
      onComplete();
    }, 2000);
  };

  const renderStepContent = () => {
    switch(steps[currentStep].id) {
      case 'review':
        return (
          <div>
            <div className="mobile-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">Task Details</div>
              </div>
              <div className="mobile-card-content">
                <div className="task-priority priority-critical" style={{ marginBottom: '16px' }}>
                  {task.priority} Priority
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {task.instructions}
                  </div>
                </div>

                <div className="task-meta" style={{ marginBottom: '16px' }}>
                  <div className="task-location">📍 {task.location}</div>
                  <div className="task-time">⏱️ {task.timeEstimate}</div>
                </div>

                <div style={{ 
                  background: 'var(--neutral-light)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Current Situation:
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    • Current shelf stock: {task.currentStock} units<br/>
                    • Promotion causing 65% sales increase<br/>
                    • Predicted stockout in 2h 15m<br/>
                    • Expected revenue loss: $1,280
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-card">
              <div className="mobile-card-content">
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--success)' }}>
                  ✨ AI Recommendation: Restock {task.recommendedQuantity} units immediately
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  This will provide a 3-hour safety buffer and maintain optimal shelf capacity.
                </div>
              </div>
            </div>
          </div>
        );

      case 'restock':
        return (
          <div>
            <div className="mobile-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">Restocking {task.product}</div>
                <div className="mobile-card-subtitle">Adjust quantity if needed</div>
              </div>
              <div className="mobile-card-content">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    Current Shelf Stock
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--danger)' }}>
                    {task.currentStock} units
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Critically low
                  </div>
                </div>

                <div className="quantity-input">
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <div>
                    <div className="quantity-display">{quantity}</div>
                    <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Units to add
                    </div>
                  </div>
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div style={{ 
                  background: 'var(--neutral-light)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    New Total Stock
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>
                    {task.currentStock + quantity} units
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {quantity === 20 ? 'Optimal quantity' : quantity < 20 ? 'Below recommendation' : 'Above recommendation'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-card">
              <div className="mobile-card-content">
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  📋 Restocking Instructions:
                </div>
                <ol style={{ fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px' }}>
                  <li>Go to backroom storage area</li>
                  <li>Locate Chips A inventory</li>
                  <li>Transport {quantity} units to {task.location}</li>
                  <li>Arrange products on shelf neatly</li>
                  <li>Update promotional display if needed</li>
                  <li>Verify shelf appearance</li>
                </ol>
              </div>
            </div>
          </div>
        );

      case 'verify':
        return (
          <div>
            <div className="mobile-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">Task Verification</div>
                <div className="mobile-card-subtitle">Confirm completion details</div>
              </div>
              <div className="mobile-card-content">
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Task Summary:
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    • Restocked: {quantity} units<br/>
                    • Location: {task.location}<br/>
                    • New total stock: {task.currentStock + quantity} units<br/>
                    • Shelf utilization: {Math.round(((task.currentStock + quantity) / 48) * 100)}%
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--success)', marginBottom: '8px' }}>
                    ✅ Expected Impact:
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    • Revenue protected: $1,280<br/>
                    • Stockout risk: 96% → 5%<br/>
                    • Safety buffer: ~3 hours<br/>
                    • Customer satisfaction maintained
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  By completing this task, you've helped prevent stockout during a critical promotion period.
                </div>

                <div style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', 
                  padding: '16px' 
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                    ✓ Checklist:
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                    ✅ Products moved to shelf<br/>
                    ✅ Promotional display updated<br/>
                    ✅ Shelf appearance verified<br/>
                    ✅ Safety protocols followed
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleting) {
    return (
      <div className="mobile-app">
        <div className="mobile-loading-overlay">
          <div className="mobile-loading-card">
            <div className="mobile-loading-spinner"></div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              Completing Task...
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Updating inventory and shelf status
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-app">
      <MobileHeader 
        title={steps[currentStep].title}
        subtitle={`Step ${currentStep + 1} of ${steps.length}`}
        onBack={onBack}
      />

      {/* Progress Steps */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`progress-step ${index <= currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {steps.map((step, index) => (
            <div key={step.id} style={{ textAlign: 'center', flex: 1 }}>
              <div>{step.icon}</div>
              <div>{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-content">
        {renderStepContent()}

        <div style={{ marginTop: '24px' }}>
          <button 
            className="mobile-btn mobile-btn-primary"
            onClick={handleNext}
          >
            {currentStep < steps.length - 1 ? 'Next Step →' : '✅ Complete Task'}
          </button>
          
          {currentStep > 0 && (
            <button 
              className="mobile-btn mobile-btn-outline"
              style={{ marginTop: '12px' }}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              ← Previous Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;