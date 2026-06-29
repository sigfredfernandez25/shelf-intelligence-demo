import React from 'react';
import { agentWorkflow } from '../data/mockData';

const AgentWorkflow = () => {
  const getStepIcon = (step, status) => {
    const stepIcons = {
      'Observe': '👁️',
      'Analyze': '🧮',
      'Predict': '🔮',
      'Recommend': '💡',
      'Assign': '📋',
      'Execute': '⚡',
      'Measure': '📊'
    };
    
    if (status === 'completed') return '✓';
    if (status === 'active') return stepIcons[step];
    return stepIcons[step];
  };

  return (
    <div className="workflow">
      {agentWorkflow.map((step, index) => (
        <React.Fragment key={step.step}>
          <div className="workflow-step">
            <div className={`workflow-icon ${step.status}`}>
              {getStepIcon(step.step, step.status)}
            </div>
            <div className="workflow-label">{step.step}</div>
            <div className="workflow-description">{step.description}</div>
          </div>
          {index < agentWorkflow.length - 1 && (
            <div className="workflow-connector" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AgentWorkflow;