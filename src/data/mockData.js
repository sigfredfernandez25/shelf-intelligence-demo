// Mock data for the Shelf Intelligence demo

export const stores = [
  { id: '102', name: 'Store #102 - Downtown', status: 'active' },
  { id: '103', name: 'Store #103 - Mall', status: 'active' },
  { id: '104', name: 'Store #104 - Suburban', status: 'active' }
];

export const products = [
  {
    id: 'SKU001',
    name: 'Chips A',
    brand: 'Premium Snacks',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2NzAwIiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DaGlwcyBBPC90ZXh0Pgo8L3N2Zz4=',
    currentStock: 34,
    backroomStock: 0,
    shelfCapacity: 48,
    price: 3.99,
    cost: 2.40,
    margin: 39.8,
    category: 'Snacks',
    promotion: {
      active: true,
      type: 'Buy 1 Get 1 Free',
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      lift: 65
    }
  },
  {
    id: 'SKU002', 
    name: 'Chips B',
    brand: 'Premium Snacks',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA3Q0ZGIiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DaGlwcyBCPC90ZXh0Pgo8L3N2Zz4=',
    currentStock: 67,
    backroomStock: 24,
    shelfCapacity: 48,
    price: 4.29,
    cost: 2.50,
    margin: 41.7,
    category: 'Snacks',
    substitutionRate: 78,
    marginImpact: 10
  }
];

export const riskLevels = {
  CRITICAL: { label: 'Critical', color: '#EF4444', priority: 1 },
  HIGH: { label: 'High', color: '#F59E0B', priority: 2 },
  MEDIUM: { label: 'Medium', color: '#F59E0B', priority: 3 },
  LOW: { label: 'Low', color: '#22C55E', priority: 4 }
};

export const stockRiskData = [
  {
    sku: 'SKU001',
    store: '102',
    product: 'Chips A',
    currentStock: 34,
    forecast: 'Stockout in 2h',
    riskLevel: 'CRITICAL',
    timeRemaining: '2h 15m',
    recommendedAction: 'Restock 20 units',
    status: 'pending',
    confidence: 96,
    expectedLoss: 1280,
    salesIncrease: 65
  },
  {
    sku: 'SKU002',
    store: '102', 
    product: 'Chips B',
    currentStock: 67,
    forecast: 'Stable for 8h',
    riskLevel: 'LOW',
    timeRemaining: '8h 30m',
    recommendedAction: 'Monitor',
    status: 'stable',
    confidence: 87,
    expectedLoss: 0,
    salesIncrease: 12
  }
];

export const kpis = {
  atRiskSKUs: 12,
  revenueProtected: 15680,
  tasksPending: 8,
  stockoutPredictions: 15,
  forecastAccuracy: 94.5
};

export const tasks = [
  {
    id: 'T001',
    title: 'Restock Chips A',
    priority: 'Critical',
    assignee: 'John D.',
    estimatedTime: '15 min',
    location: 'Aisle 3, Section A',
    instructions: 'Move 20 units from backroom to shelf. Update planogram display.',
    status: 'pending',
    sku: 'SKU001',
    quantity: 20,
    type: 'restock'
  },
  {
    id: 'T002',
    title: 'Verify Shelf Display',
    priority: 'High',
    assignee: 'Sarah M.',
    estimatedTime: '10 min',
    location: 'Aisle 3, Section B',
    instructions: 'Verify promotional display is properly arranged.',
    status: 'in-progress',
    sku: 'SKU001',
    type: 'verification'
  }
];

export const demandForecastData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sales: [45, 52, 48, 73, 89, 156, 234],
  inventory: [120, 98, 76, 58, 42, 34, 12],
  forecast: [178, 145, 123, 98, 67, 34, 0]
};

export const substitutions = [
  {
    originalSKU: 'SKU001',
    substituteSKU: 'SKU002',
    acceptanceRate: 78,
    marginImpact: 10,
    expectedRecovery: 85,
    reason: 'Similar product category with higher margin'
  }
];

export const agentWorkflow = [
  { step: 'Observe', description: 'Monitor POS & inventory data', status: 'completed' },
  { step: 'Analyze', description: 'Process demand patterns', status: 'completed' },
  { step: 'Predict', description: 'Forecast stockout risk', status: 'completed' },
  { step: 'Recommend', description: 'Generate replenishment plan', status: 'active' },
  { step: 'Assign', description: 'Create tasks for associates', status: 'pending' },
  { step: 'Execute', description: 'Complete shelf actions', status: 'pending' },
  { step: 'Measure', description: 'Track business impact', status: 'pending' }
];