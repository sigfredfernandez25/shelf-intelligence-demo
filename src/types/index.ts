// Core business types
export interface Store {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  barcode?: string;
  image: string;
  price: number;
  cost: number;
  margin: number;
  weight?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  nutritionalInfo?: any;
  allergens?: string[];
  supplier?: string;
  supplierId?: string;
  // Inventory fields (from warehouse data)
  currentStock?: number;
  backroomStock?: number;
  shelfCapacity?: number;
  // Promotion fields (computed from promotions data)
  promotion?: Promotion;
  substitutionRate?: number;
  marginImpact?: number;
}

export interface Promotion {
  id: string;
  name: string;
  type: string;
  skuId?: string;
  skuIds?: string[];
  categoryId?: string;
  storeIds?: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired';
  description: string;
  rules: any;
  metrics: {
    lift?: number;
    expectedSalesIncrease?: number;
    actualSalesIncrease?: number;
    budgetedCost?: number;
    actualCost?: number;
    roi?: number;
  };
  createdBy: string;
  createdAt: string;
  lastUpdated?: string;
  endedAt?: string;
  // Legacy compatibility
  active?: boolean;
  lift?: number;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface StockRisk {
  sku: string;
  store: string;
  product: string;
  currentStock: number;
  forecast: string;
  riskLevel: RiskLevel;
  timeRemaining: string;
  recommendedAction: string;
  status: string;
  confidence: number;
  expectedLoss: number;
  salesIncrease: number;
  salesVelocity?: number;
  runoutHours?: number;
}

export interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  assigneeId?: string;
  estimatedTime: string;
  actualTime?: string;
  location: string;
  instructions: string;
  status: 'pending' | 'in-progress' | 'completed' | 'escalated';
  sku: string;
  storeId?: string;
  quantity?: number;
  type: 'restock' | 'verification' | 'substitution' | 'planogram';
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt?: string;
  dueDate?: string;
  createdBy?: string;
  completedBy?: string;
  notes?: string;
  rating?: number;
  relatedPromotionId?: string;
  relatedTask?: string;
}

export interface Substitution {
  originalSKU: string;
  substituteSKU: string;
  acceptanceRate: number;
  marginImpact: number;
  expectedRecovery: number;
  reason: string;
  priority?: number;
  active?: boolean;
}

export interface KPIs {
  atRiskSKUs: number;
  revenueProtected: number;
  tasksPending: number;
  stockoutPredictions: number;
  forecastAccuracy: number;
  oosRate?: number;
  marginImpact?: number;
}

// Agent-specific types
export interface ForecastInput {
  storeId: string;
  skuId: string;
}

export interface ForecastOutput {
  skuId: string;
  storeId: string;
  salesVelocity: number;
  runoutHours: number;
  riskLevel: RiskLevel;
  confidence: number;
  expectedLoss: number;
  recommendation: string;
}

export interface ReplenishmentInput {
  storeId: string;
  skuId: string;
  recommendedQuantity: number;
}

export interface ReplenishmentOutput {
  taskId?: string;
  action: 'restock' | 'substitute' | 'escalate';
  message: string;
  backroomStock: number;
}

export interface RecommendationInput {
  storeId: string;
  skuId: string;
}

export interface RecommendationOutput {
  substituteSKU: string;
  substituteName: string;
  acceptanceRate: number;
  marginImpact: number;
  expectedRecovery: number;
  reason: string;
}

export interface PlanogramInput {
  storeId: string;
  skuId: string;
  riskLevel: RiskLevel;
}

export interface PlanogramOutput {
  currentFacings: number;
  recommendedFacings: number;
  reasoning: string;
  shelfOptimization: string;
}

export interface TaskInput {
  storeId: string;
  skuId: string;
  action: string;
  priority: Task['priority'];
  quantity?: number;
}

export interface TaskOutput {
  taskId: string;
  status: 'created' | 'updated' | 'error';
  message: string;
}

// Dashboard and API response types
export interface DashboardSummary {
  kpis: KPIs;
  topRisks: StockRisk[];
  activeTasks: Task[];
  alerts: Alert[];
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  sku?: string;
  store?: string;
  timestamp: string;
  acknowledged?: boolean;
}

export interface SKUAnalysis {
  product: Product;
  forecast: ForecastOutput;
  replenishment?: ReplenishmentOutput;
  recommendation?: RecommendationOutput;
  planogram: PlanogramOutput;
  tasks: Task[];
  history: {
    sales: number[];
    inventory: number[];
    labels: string[];
  };
}

// Agent orchestration types
export interface AgentContext {
  storeId: string;
  timestamp: string;
  userId?: string;
}

export interface OrchestrationResult {
  success: boolean;
  data?: any;
  error?: string;
  agentsExecuted: string[];
  executionTime: number;
}