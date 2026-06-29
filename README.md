# Shelf Intelligence & Predictive Replenishment Agent

A comprehensive React.js demo application showcasing an AI-powered retail inventory management system. This prototype demonstrates the complete workflow from stockout prediction to task execution across both desktop and mobile platforms.

![Demo Application](https://img.shields.io/badge/Demo-React%20App-blue)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-green)
![Platform](https://img.shields.io/badge/Platform-Desktop%20%7C%20Mobile-lightgray)

## 🎯 Overview

The Shelf Intelligence system demonstrates how AI can predict stockout risks and automatically orchestrate replenishment actions in retail environments. Built for presentation purposes, it simulates the complete decision-making flow from detection through execution.

## 🚀 Features

### Desktop Dashboard (Manager/Analyst View)
- **Real-time KPI Monitoring**: At-risk SKUs, revenue protection, task management
- **AI Alert System**: Critical stockout warnings with countdown timers
- **Agent Workflow Visualization**: Step-by-step AI decision process
- **Demand Forecasting**: Interactive charts showing sales vs inventory trends
- **SKU Detail Analysis**: Deep-dive into individual product performance
- **Recommendation Engine**: AI-powered restocking suggestions

### Mobile Application (Store Associate View)
- **Task Management**: Prioritized action items with step-by-step guidance
- **Progressive Workflow**: Multi-step task completion with progress tracking
- **Smart Substitution**: Alternative product recommendations when stock unavailable
- **Success Tracking**: Performance metrics and business impact visualization
- **Responsive Design**: Optimized for mobile devices and touch interfaces

### AI Agent Capabilities
- **Demand Prediction**: Forecasts stockout timing based on sales velocity
- **Intelligent Recommendations**: Suggests optimal restock quantities and timing
- **Smart Substitution**: Alternative products with acceptance rates and margin impact
- **Automated Task Assignment**: Creates and prioritizes work for store associates
- **Impact Measurement**: Tracks revenue protection and performance metrics

## 🎪 Demo Scenario

**Store #102 - Weekend Promotion Crisis**
- **Product**: Chips A (Buy 1 Get 1 Free promotion)
- **Current Stock**: 34 units
- **Sales Increase**: +65% due to promotion
- **AI Prediction**: Stockout in 2 hours 15 minutes (96% confidence)
- **Expected Loss**: $1,280 in revenue
- **Recommended Action**: Restock 20 units immediately
- **Fallback Strategy**: Substitute with Chips B (78% acceptance rate, +10% margin)

## 🛠️ Technology Stack

- **Frontend**: React.js 18+ with functional components and hooks
- **Styling**: Pure CSS with CSS Variables (no external frameworks)
- **Icons**: Unicode emojis for universal compatibility
- **State Management**: React useState and useEffect
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animations**: CSS animations and transitions
- **Data**: Mock JSON objects (no backend required)

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The application will open at `http://localhost:3000`

## 📱 How to Use

### Desktop Experience
1. **Start at Dashboard**: View KPI cards and critical alerts
2. **Explore AI Workflow**: See the agent decision process visualization  
3. **Click SKU001**: Deep-dive into the critical product analysis
4. **Generate Recommendation**: Watch AI processing and recommendation generation
5. **Accept Recommendation**: See task creation and mobile handoff

### Mobile Experience
1. **View Critical Tasks**: See urgent actions requiring attention
2. **Start Task**: Follow step-by-step restocking workflow
3. **Handle Exceptions**: Experience smart substitution when stock unavailable
4. **Complete Tasks**: Track success metrics and business impact

### Key Interactions
- Click any SKU in the risk table for detailed analysis
- Generate AI recommendations to see intelligent decision-making
- Switch between desktop and mobile views using the toggle buttons
- Follow the complete workflow from detection to resolution

## 📊 Mock Data Structure

```javascript
// Example risk data
const stockRiskData = [
  {
    sku: 'SKU001',
    product: 'Chips A',
    currentStock: 34,
    riskLevel: 'CRITICAL',
    timeRemaining: '2h 15m',
    confidence: 96,
    expectedLoss: 1280,
    salesIncrease: 65
  }
];
```

## 🎨 Design System

### Color Palette
- **Primary**: `#2563EB` (Blue) - Actions and highlights
- **Success**: `#22C55E` (Green) - Positive outcomes
- **Warning**: `#F59E0B` (Orange) - Caution states  
- **Danger**: `#EF4444` (Red) - Critical alerts
- **Neutral**: `#F3F4F6` (Gray) - Background and borders

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Headings**: 600-700 weight for hierarchy
- **Body Text**: 400 weight with good line height
- **Data Display**: Monospace for numbers where appropriate

### Component Architecture
- **Reusable Components**: Consistent UI patterns across views
- **Responsive Grid**: CSS Grid and Flexbox for layouts
- **Card-based Design**: Information grouped in digestible containers
- **Progressive Enhancement**: Works without JavaScript for core content

## 🔧 Customization

### Adding New Products
```javascript
// In src/data/mockData.js
const newProduct = {
  id: 'SKU003',
  name: 'New Product',
  currentStock: 45,
  // ... other properties
};
```

### Modifying KPI Cards
```javascript
// In src/pages/Dashboard.js
<KPICard
  title="Your Metric"
  value={yourValue}
  icon="📈"
  color="var(--primary)"
/>
```

### Customizing Mobile Workflow
```javascript
// In src/pages/mobile/TaskDetail.js
const steps = [
  { id: 'custom', title: 'Custom Step', icon: '🎯' },
  // ... additional steps
];
```

## 🎭 Presentation Tips

1. **Start with Desktop**: Show the manager's analytical view
2. **Highlight AI Decision**: Emphasize the intelligent workflow visualization
3. **Demonstrate Mobile Handoff**: Show seamless transition to execution
4. **Showcase Substitution**: Handle the "no backroom stock" scenario
5. **Emphasize Impact**: Point out revenue protection and efficiency gains

## 🔮 Future Enhancements

- **Real-time Data Integration**: Connect to actual POS and inventory systems
- **Advanced Analytics**: Machine learning model integration
- **Multi-store Management**: Scale across retail chain operations
- **Voice Commands**: Hands-free mobile operation
- **AR Guidance**: Augmented reality shelf navigation
- **Predictive Maintenance**: Equipment and fixture monitoring

## 📄 License

This is a demo application created for presentation purposes. All code is provided as-is for educational and demonstration use.

## 👨‍💻 Development

Built with modern React patterns:
- Functional components with hooks
- Responsive CSS-in-JS approach
- Mobile-first responsive design
- Accessibility considerations
- Performance optimizations

## 🤝 Contributing

This is a demo application, but suggestions for improvements are welcome! Focus areas:
- Enhanced animations and transitions
- Additional mobile interaction patterns
- Improved accessibility features
- Extended demo scenarios

---

**🧠 Shelf Intelligence Demo** - Showcasing the future of AI-powered retail operations