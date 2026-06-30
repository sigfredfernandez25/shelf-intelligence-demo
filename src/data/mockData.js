// Legacy compatibility layer for UI components
// This file provides the same data structure as before but sources from JSON files

// Import JSON files directly for client-side use
import warehouseData from './warehouse.json';
import posData from './pos.json';
import promotionData from './promotions.json';
import taskData from './tasks.json';
import planogramData from './planogram.json';

// Client-side database manager
class ClientDatabase {
  getProduct(skuId, storeId = '102') {
    const product = warehouseData.products.find(p => p.id === skuId);
    if (!product) return undefined;

    // Get inventory data for this store
    const inventory = warehouseData.inventory.find(i => 
      i.storeId === storeId && i.skuId === skuId
    );
    
    // Get promotion data
    const promotion = promotionData.activePromotions.find(p => 
      p.skuId === skuId && p.storeIds?.includes(storeId)
    );
    
    // Merge data into product
    return {
      ...product,
      currentStock: inventory?.currentStock || 0,
      backroomStock: inventory?.backroomStock || 0,
      shelfCapacity: inventory?.shelfCapacity || 48,
      promotion: promotion ? {
        ...promotion,
        active: promotion.status === 'active',
        lift: promotion.metrics?.lift || 0
      } : undefined
    };
  }

  getProducts(storeId = '102') {
    return warehouseData.products.map(product => {
      const inventory = warehouseData.inventory.find(i => 
        i.storeId === storeId && i.skuId === product.id
      );
      
      const promotion = promotionData.activePromotions.find(p => 
        p.skuId === product.id && p.storeIds?.includes(storeId)
      );
      
      return {
        ...product,
        currentStock: inventory?.currentStock || 0,
        backroomStock: inventory?.backroomStock || 0,
        shelfCapacity: inventory?.shelfCapacity || 48,
        promotion: promotion ? {
          ...promotion,
          active: promotion.status === 'active',
          lift: promotion.metrics?.lift || 0
        } : undefined
      };
    });
  }

  getSalesHistory(skuId) {
    const history = posData.salesHistory[skuId] || [];
    return history.map(h => h.units);
  }

  getInventoryHistory(skuId) {
    const history = posData.inventoryHistory[skuId] || [];
    return history.map(h => h.stock);
  }
}

const clientDb = new ClientDatabase();

// KPI data for dashboard
export const kpis = {
  atRiskSKUs: 3,
  revenueProtected: 15680,
  tasksPending: 4,
  stockoutPredictions: 3,
  forecastAccuracy: 94.5,
  oosRate: 2.3,
  marginImpact: 1250
};

// Stock risk data for risk table
export const stockRiskData = [
  {
    sku: 'CHIPS_A',
    product: 'Premium Chips A', 
    currentStock: 34,
    forecast: 'Stockout in 2h 15m',
    riskLevel: 'CRITICAL',
    timeRemaining: '2h 15m',
    recommendedAction: 'Restock 20 units immediately',
    status: 'pending',
    confidence: 96,
    expectedLoss: 1280,
    salesIncrease: 65
  },
  {
    sku: 'CHIPS_B',
    product: 'Premium Chips B',
    currentStock: 67,
    forecast: 'Stockout in 8h 30m',
    riskLevel: 'MEDIUM',
    timeRemaining: '8h 30m', 
    recommendedAction: 'Monitor and plan restock',
    status: 'monitoring',
    confidence: 87,
    expectedLoss: 340,
    salesIncrease: 12
  },
  {
    sku: 'CEREAL_X',
    product: 'Breakfast Cereal X',
    currentStock: 23,
    forecast: 'Stockout in 12h',
    riskLevel: 'MEDIUM',
    timeRemaining: '12h',
    recommendedAction: 'Schedule restock within 8h',
    status: 'scheduled',
    confidence: 82,
    expectedLoss: 185,
    salesIncrease: 5
  }
];

// Risk level definitions
export const riskLevels = {
  CRITICAL: { color: '#EF4444', threshold: 4 },
  HIGH: { color: '#F97316', threshold: 8 },
  MEDIUM: { color: '#F59E0B', threshold: 24 },
  LOW: { color: '#22C55E', threshold: Infinity }
};

// Demand forecast chart data
export const demandForecastData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sales: [45, 52, 48, 73, 89, 156, 234],
  inventory: [120, 98, 76, 58, 42, 34, 12],
  datasets: [
    {
      label: 'Sales (Units)',
      data: [45, 52, 48, 73, 89, 156, 234],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Inventory Level', 
      data: [120, 98, 76, 58, 42, 34, 12],
      borderColor: '#DC2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

// Agent workflow visualization data
export const agentWorkflow = [
  {
    id: 1,
    name: 'Demand Forecast Agent',
    status: 'completed',
    description: 'Analyzed sales velocity and predicted stockout in 2h 15m',
    confidence: 96,
    executionTime: 247,
    output: 'CRITICAL risk detected for CHIPS_A'
  },
  {
    id: 2,
    name: 'Replenishment Agent', 
    status: 'completed',
    description: 'Checked backroom inventory - 0 units available',
    confidence: 100,
    executionTime: 156,
    output: 'Recommend substitute product pathway'
  },
  {
    id: 3,
    name: 'Recommendation Agent',
    status: 'completed', 
    description: 'Found substitute: CHIPS_B (78% acceptance rate)',
    confidence: 89,
    executionTime: 312,
    output: 'CHIPS_B recommended with +10% margin'
  },
  {
    id: 4,
    name: 'Task Orchestrator',
    status: 'in-progress',
    description: 'Creating high-priority substitution task',
    confidence: null,
    executionTime: null,
    output: 'Task T004 being assigned...'
  },
  {
    id: 5,
    name: 'Planogram Agent',
    status: 'queued',
    description: 'Optimize shelf positioning for substitute',
    confidence: null,
    executionTime: null,
    output: null
  }
];

// Product data (from client database) - make it a function to get fresh data
export const getProducts = () => clientDb.getProducts();
export const products = clientDb.getProducts();

// Substitution data
export const substitutions = [
  {
    originalSKU: 'CHIPS_A',
    substitute: 'CHIPS_B',
    acceptanceRate: 78,
    marginImpact: 10,
    reason: 'Same brand family with higher margin'
  }
];

// Sales and inventory history for charts
export const salesHistory = {
  'CHIPS_A': clientDb.getSalesHistory('CHIPS_A'),
  'CHIPS_B': clientDb.getSalesHistory('CHIPS_B'),
  'CEREAL_X': clientDb.getSalesHistory('CEREAL_X')
};

export const inventoryHistory = {
  'CHIPS_A': clientDb.getInventoryHistory('CHIPS_A'),
  'CHIPS_B': clientDb.getInventoryHistory('CHIPS_B'), 
  'CEREAL_X': clientDb.getInventoryHistory('CEREAL_X')
};

// Export all for compatibility
export default {
  kpis,
  stockRiskData,
  riskLevels,
  demandForecastData,
  agentWorkflow,
  products,
  substitutions,
  salesHistory,
  inventoryHistory
};