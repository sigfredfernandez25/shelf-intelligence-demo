import { 
  Store, 
  Product, 
  StockRisk, 
  Task, 
  Substitution, 
  KPIs,
  Alert 
} from '../types';

// Mock POS and inventory data
export const stores: Store[] = [
  { id: '102', name: 'Store #102 - Downtown', status: 'active', location: 'Downtown Plaza' },
  { id: '103', name: 'Store #103 - Mall', status: 'active', location: 'Westfield Mall' },
  { id: '104', name: 'Store #104 - Suburban', status: 'active', location: 'Oak Ridge Center' }
];

export const products: Product[] = [
  {
    id: 'CHIPS_A',
    name: 'Chips A',
    brand: 'Premium Snacks',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2NzAwIiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DaGlwcyBBPC90ZXh0Pgo8L3N2Zz4=',
    currentStock: 34,
    backroomStock: 0, // This triggers substitution logic
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
    id: 'CHIPS_B',
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
  },
  {
    id: 'CEREAL_X',
    name: 'Breakfast Cereal X',
    brand: 'Morning Fresh',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZENzAwIiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DZXJlYWwgWDwvdGV4dD4KPC9zdmc+',
    currentStock: 23,
    backroomStock: 12,
    shelfCapacity: 36,
    price: 5.99,
    cost: 3.20,
    margin: 46.6,
    category: 'Breakfast'
  }
];

// Mock sales history for demand forecasting
export const salesHistory: Record<string, number[]> = {
  'CHIPS_A': [45, 52, 48, 73, 89, 156, 234], // Last 7 days
  'CHIPS_B': [32, 28, 35, 41, 38, 44, 52],
  'CEREAL_X': [18, 22, 19, 25, 23, 28, 31]
};

export const inventoryHistory: Record<string, number[]> = {
  'CHIPS_A': [120, 98, 76, 58, 42, 34, 12], // Projected depletion
  'CHIPS_B': [89, 85, 81, 76, 71, 67, 62],
  'CEREAL_X': [45, 42, 39, 35, 31, 28, 23]
};

// Mock substitution matrix
export const substitutionMatrix: Record<string, Substitution> = {
  'CHIPS_A': {
    originalSKU: 'CHIPS_A',
    substituteSKU: 'CHIPS_B',
    acceptanceRate: 78,
    marginImpact: 10,
    expectedRecovery: 85,
    reason: 'Same brand family with higher margin and similar taste profile'
  },
  'CEREAL_X': {
    originalSKU: 'CEREAL_X',
    substituteSKU: 'CEREAL_Y',
    acceptanceRate: 62,
    marginImpact: 5,
    expectedRecovery: 72,
    reason: 'Similar nutritional profile and price point'
  }
};

// Mock planogram data
export const planogramData: Record<string, { currentFacings: number; maxFacings: number; category: string }> = {
  'CHIPS_A': { currentFacings: 4, maxFacings: 8, category: 'Snacks' },
  'CHIPS_B': { currentFacings: 3, maxFacings: 6, category: 'Snacks' },
  'CEREAL_X': { currentFacings: 2, maxFacings: 4, category: 'Breakfast' }
};

// Mock task data
export let mockTasks: Task[] = [
  {
    id: 'T001',
    title: 'Restock Chips A',
    priority: 'Critical',
    assignee: 'John D.',
    estimatedTime: '15 min',
    location: 'Aisle 3, Section A',
    instructions: 'Move 20 units from backroom to shelf. Update planogram display.',
    status: 'pending',
    sku: 'CHIPS_A',
    quantity: 20,
    type: 'restock',
    createdAt: new Date().toISOString()
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
    sku: 'CHIPS_A',
    type: 'verification',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Utility functions for data access
export function getProduct(skuId: string): Product | undefined {
  return products.find(p => p.id === skuId);
}

export function getStore(storeId: string): Store | undefined {
  return stores.find(s => s.id === storeId);
}

export function getSalesHistory(skuId: string): number[] {
  return salesHistory[skuId] || [];
}

export function getInventoryHistory(skuId: string): number[] {
  return inventoryHistory[skuId] || [];
}

export function getSubstitution(skuId: string): Substitution | undefined {
  return substitutionMatrix[skuId];
}

export function getPlanogramData(skuId: string) {
  return planogramData[skuId];
}

export function addTask(task: Task): void {
  mockTasks.push(task);
}

export function updateTask(taskId: string, updates: Partial<Task>): Task | undefined {
  const taskIndex = mockTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return undefined;
  
  mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
  return mockTasks[taskIndex];
}

export function getTasksByStore(storeId: string): Task[] {
  return mockTasks.filter(t => t.sku.includes(storeId) || t.location.includes(storeId));
}

export function getTasksBySKU(skuId: string): Task[] {
  return mockTasks.filter(t => t.sku === skuId);
}

// Generate unique task ID
export function generateTaskId(): string {
  return `T${String(mockTasks.length + 1).padStart(3, '0')}`;
}