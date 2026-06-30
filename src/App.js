import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SKUDetail from './pages/SKUDetail';
import AgentTester from './components/AgentTester';
import MobileDashboard from './pages/mobile/MobileDashboard';
import TaskDetail from './pages/mobile/TaskDetail';
import SubstitutionScreen from './pages/mobile/SubstitutionScreen';
import SuccessScreen from './pages/mobile/SuccessScreen';
import './styles/App.css';
import './styles/mobile.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSKU, setSelectedSKU] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [completionType, setCompletionType] = useState('restock');

  const handleSKUClick = (sku) => {
    setSelectedSKU(sku);
    setCurrentView('sku-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSKU(null);
  };

  const handleGenerateRecommendation = () => {
    alert('🤖 AI Recommendation Generated!\n\n' +
          'Recommended Action: Restock 20 units immediately\n\n' +
          'Expected Impact:\n' +
          '• Revenue Protected: $1,280\n' +
          '• Stockout Risk: 96% → 5%\n' +
          '• Customer Satisfaction: Maintained\n\n' +
          'Task has been assigned to Store Associate!');
    
    // Switch to mobile to show the workflow
    setIsMobileMode(true);
  };

  const handleTaskClick = (taskId) => {
    setSelectedTask(taskId);
    setCurrentView('task-detail');
  };

  const handleTaskComplete = () => {
    setCompletionType('restock');
    setCurrentView('success');
  };

  const handleSubstitutionApprove = () => {
    setCompletionType('substitution');
    setCurrentView('success');
  };

  const handleBackToMobileHome = () => {
    setCurrentView('mobile-dashboard');
    setSelectedTask(null);
  };

  const handleSwitchToDesktop = () => {
    setIsMobileMode(false);
    setCurrentView('dashboard');
  };

  const handleSwitchToMobile = () => {
    setIsMobileMode(true);
    setCurrentView('mobile-dashboard');
  };

  const renderDesktopView = () => {
    return (
      <div className="app">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="main-content">
          <Navbar currentView={activeView} />
          
          {currentView === 'dashboard' && (
            <Dashboard 
              onSKUClick={handleSKUClick}
              onSwitchToMobile={handleSwitchToMobile}
            />
          )}
          
          {currentView === 'sku-detail' && selectedSKU && (
            <SKUDetail
              sku={selectedSKU}
              onBack={handleBackToDashboard}
              onGenerateRecommendation={handleGenerateRecommendation}
            />
          )}
          
          {activeView !== 'dashboard' && currentView === 'dashboard' && (
            <div style={{ padding: '32px' }}>
              {activeView === 'analytics' ? (
                <AgentTester />
              ) : (
                <div className="card">
                  <div className="card-content" style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚧</div>
                    <h2 style={{ marginBottom: '12px' }}>Feature Coming Soon</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                      This {activeView} section is being developed. 
                      Try the main Dashboard for the complete demo experience.
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setActiveView('dashboard')}
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Desktop to Mobile Switch Button */}
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '300px',
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '600'
        }} onClick={handleSwitchToMobile}>
          📱 Switch to Mobile View
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    switch(currentView) {
      case 'mobile-dashboard':
        return (
          <MobileDashboard 
            onTaskClick={handleTaskClick}
            onProductClick={(productId) => {
              // For demo, show substitution screen if no backroom stock
              if (productId === 'SKU001') {
                setCurrentView('substitution');
              }
            }}
          />
        );
      
      case 'task-detail':
        return (
          <TaskDetail
            taskId={selectedTask}
            onBack={handleBackToMobileHome}
            onComplete={handleTaskComplete}
          />
        );
      
      case 'substitution':
        return (
          <SubstitutionScreen
            onBack={handleBackToMobileHome}
            onApprove={handleSubstitutionApprove}
          />
        );
      
      case 'success':
        return (
          <SuccessScreen
            onBackToHome={handleBackToMobileHome}
            type={completionType}
          />
        );
      
      default:
        return (
          <MobileDashboard 
            onTaskClick={handleTaskClick}
            onProductClick={(productId) => {
              if (productId === 'SKU001') {
                setCurrentView('substitution');
              }
            }}
          />
        );
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {isMobileMode ? (
        <>
          {renderMobileView()}
          {/* Mobile to Desktop Switch Button */}
          <div style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            zIndex: 2000,
            fontSize: '12px',
            fontWeight: '600'
          }} onClick={handleSwitchToDesktop}>
            🖥️ Desktop
          </div>
        </>
      ) : (
        renderDesktopView()
      )}
    </div>
  );
}

export default App;