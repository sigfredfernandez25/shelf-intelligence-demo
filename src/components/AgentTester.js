import React, { useState } from 'react';

const AgentTester = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, method = 'GET', body = null) => {
    const key = `${method} ${endpoint}`;
    setLoading(true);
    
    try {
      const startTime = Date.now();
      
      const options = {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : null
      };
      
      const response = await fetch(endpoint, options);
      const data = await response.json();
      const endTime = Date.now();
      
      setTestResults(prev => ({
        ...prev,
        [key]: {
          status: response.ok ? 'success' : 'error',
          data,
          responseTime: endTime - startTime,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [key]: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAll = async () => {
    setTestResults({});
    
    // Test all endpoints
    await testEndpoint('/api/health');
    await testEndpoint('/api/dashboard?storeId=102');
    await testEndpoint('/api/sku/CHIPS_A?storeId=102');
    await testEndpoint('/api/forecast', 'POST', { storeId: '102', skuId: 'CHIPS_A' });
    await testEndpoint('/api/recommend-substitute', 'POST', { storeId: '102', skuId: 'CHIPS_A' });
    await testEndpoint('/api/create-task', 'POST', { 
      storeId: '102', 
      skuId: 'CHIPS_A', 
      action: 'restock', 
      priority: 'Critical' 
    });
  };

  return (
    <div style={{ padding: '24px', background: 'white', margin: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>
        🧪 AI Agent System Tester
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <button 
          className="btn btn-primary" 
          onClick={testAll}
          disabled={loading}
          style={{ marginRight: '12px' }}
        >
          {loading ? '🔄 Testing...' : '🚀 Test All Agents'}
        </button>
        
        <button 
          className="btn btn-outline" 
          onClick={() => setTestResults({})}
        >
          Clear Results
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Test Results:</h3>
          
          {Object.entries(testResults).map(([endpoint, result]) => (
            <div key={endpoint} style={{ 
              marginBottom: '16px', 
              padding: '16px', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              background: result.status === 'success' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '8px' 
              }}>
                <strong>{endpoint}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {result.responseTime && (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      ⏱️ {result.responseTime}ms
                    </span>
                  )}
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: '600',
                    background: result.status === 'success' ? 'var(--success)' : 'var(--danger)',
                    color: 'white'
                  }}>
                    {result.status === 'success' ? '✅ SUCCESS' : '❌ ERROR'}
                  </span>
                </div>
              </div>
              
              {result.data?.metadata && (
                <div style={{ 
                  marginBottom: '8px', 
                  padding: '8px', 
                  background: 'rgba(37, 99, 235, 0.1)',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <strong>🤖 Agents:</strong> {result.data.metadata.agentsExecuted?.join(', ')} | 
                  <strong> ⏱️ Agent Time:</strong> {result.data.metadata.executionTime}ms
                </div>
              )}
              
              <details>
                <summary style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '8px' }}>
                  📊 View Response Data
                </summary>
                <pre style={{ 
                  fontSize: '11px', 
                  background: 'var(--neutral-light)', 
                  padding: '12px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        background: 'var(--neutral-light)', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4 style={{ marginBottom: '8px' }}>📋 What This Tests:</h4>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Agent Health:</strong> Checks if all 5 AI agents are working</li>
          <li><strong>Dashboard API:</strong> Tests full agent orchestration</li>
          <li><strong>SKU Analysis:</strong> Tests complete product intelligence</li>
          <li><strong>Demand Forecast:</strong> Tests sales velocity predictions</li>
          <li><strong>Recommendations:</strong> Tests substitution intelligence</li>
          <li><strong>Task Creation:</strong> Tests task orchestrator agent</li>
        </ul>
      </div>
    </div>
  );
};

export default AgentTester;