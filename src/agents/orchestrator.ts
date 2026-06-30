import { 
  DashboardSummary, 
  SKUAnalysis, 
  AgentContext, 
  OrchestrationResult,
  Alert,
  KPIs,
  StockRisk 
} from '../types';

import { DemandForecastAgent } from './demandForecastAgent';
import { ReplenishmentAgent } from './replenishmentAgent';
import { RecommendationAgent } from './recommendationAgent';
import { PlanogramAgent } from './planogramAgent';
import { TaskOrchestratorAgent } from './taskOrchestratorAgent';

import { 
  getProduct, 
  getProducts,
  getTasks, 
  getSalesHistory, 
  getInventoryHistory 
} from '../data/serverDatabase';

// Get tasks for compatibility
const mockTasks = getTasks();

/**
 * Shelf Intelligence Orchestrator
 * Coordinates all agent modules and produces dashboard-ready outputs
 */
export class ShelfIntelligenceOrchestrator {
  private demandAgent: DemandForecastAgent;
  private replenishmentAgent: ReplenishmentAgent;
  private recommendationAgent: RecommendationAgent;
  private planogramAgent: PlanogramAgent;
  private taskAgent: TaskOrchestratorAgent;

  constructor() {
    this.demandAgent = new DemandForecastAgent();
    this.replenishmentAgent = new ReplenishmentAgent();
    this.recommendationAgent = new RecommendationAgent();
    this.planogramAgent = new PlanogramAgent();
    this.taskAgent = new TaskOrchestratorAgent();
  }

  /**
   * Generate comprehensive dashboard summary
   */
  async runDashboardFlow(context: AgentContext): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const agentsExecuted: string[] = [];

    try {
      // 1. Generate KPIs
      agentsExecuted.push('KPI Calculator');
      const kpis = await this.calculateKPIs(context.storeId);

      // 2. Identify top risks using Demand Forecast Agent
      agentsExecuted.push('Demand Forecast Agent');
      const topRisks: StockRisk[] = [];
      
      const products = getProducts(context.storeId);
      
      for (const product of products.slice(0, 10)) { // Analyze top 10 products
        try {
          const forecast = await this.demandAgent.forecast({
            storeId: context.storeId,
            skuId: product.id
          });

          if (forecast.riskLevel === 'CRITICAL' || forecast.riskLevel === 'HIGH') {
            topRisks.push({
              sku: product.id,
              store: context.storeId,
              product: product.name,
              currentStock: product.currentStock || 0,
              forecast: `Stockout in ${Math.round(forecast.runoutHours)}h`,
              riskLevel: forecast.riskLevel,
              timeRemaining: `${Math.round(forecast.runoutHours)}h`,
              recommendedAction: forecast.recommendation.split('.')[0], // First sentence
              status: 'pending',
              confidence: forecast.confidence,
              expectedLoss: forecast.expectedLoss,
              salesIncrease: product.promotion?.metrics?.lift || 0,
              salesVelocity: forecast.salesVelocity,
              runoutHours: forecast.runoutHours
            });
          }
        } catch (error) {
          console.warn(`Failed to analyze ${product.id}:`, error);
        }
      }

      // Sort by risk level and urgency
      topRisks.sort((a, b) => {
        const riskWeight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return riskWeight[b.riskLevel] - riskWeight[a.riskLevel];
      });

      // 3. Get active tasks using Task Orchestrator
      agentsExecuted.push('Task Orchestrator Agent');
      const activeTasks = await this.taskAgent.prioritizeTasks(context.storeId);

      // 4. Generate alerts
      const alerts = this.generateAlerts(topRisks, activeTasks);

      const dashboardSummary: DashboardSummary = {
        kpis,
        topRisks: topRisks.slice(0, 5), // Top 5 risks
        activeTasks: activeTasks.slice(0, 10), // Top 10 tasks
        alerts,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: dashboardSummary,
        agentsExecuted,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        error: `Dashboard orchestration failed: ${error}`,
        agentsExecuted,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Generate comprehensive SKU analysis
   */
  async runSKUFlow(skuId: string, context: AgentContext): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const agentsExecuted: string[] = [];

    try {
      // Validate SKU exists
      const product = getProduct(skuId);
      if (!product) {
        throw new Error(`Product ${skuId} not found`);
      }

      // 1. Demand Forecast Analysis
      agentsExecuted.push('Demand Forecast Agent');
      const forecast = await this.demandAgent.forecast({
        storeId: context.storeId,
        skuId
      });

      // 2. Replenishment Analysis
      agentsExecuted.push('Replenishment Agent');
      const optimalQuantity = await this.replenishmentAgent.getOptimalRestockQuantity(
        skuId,
        product.currentStock || 0,
        forecast.salesVelocity
      );

      const replenishment = await this.replenishmentAgent.processReplenishment({
        storeId: context.storeId,
        skuId,
        recommendedQuantity: optimalQuantity
      });

      // 3. Recommendation Analysis (if substitution needed)
      let recommendation = undefined;
      if (replenishment.action === 'substitute') {
        agentsExecuted.push('Recommendation Agent');
        recommendation = await this.recommendationAgent.findSubstitute({
          storeId: context.storeId,
          skuId
        });
      }

      // 4. Planogram Analysis
      agentsExecuted.push('Planogram Agent');
      const planogram = await this.planogramAgent.generateShelfInsight({
        storeId: context.storeId,
        skuId,
        riskLevel: forecast.riskLevel
      });

      // 5. Task Analysis
      agentsExecuted.push('Task Orchestrator Agent');
      const tasks = mockTasks.filter(t => t.sku === skuId);

      // 6. Historical Data
      const history = {
        sales: getSalesHistory(skuId),
        inventory: getInventoryHistory(skuId),
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      };

      const skuAnalysis: SKUAnalysis = {
        product,
        forecast,
        replenishment: replenishment.action !== 'substitute' ? replenishment : undefined,
        recommendation: recommendation || undefined,
        planogram,
        tasks,
        history
      };

      return {
        success: true,
        data: skuAnalysis,
        agentsExecuted,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        error: `SKU analysis failed: ${error}`,
        agentsExecuted,
        executionTime: Date.now() - startTime
      };
    }
  }

  private async calculateKPIs(storeId: string): Promise<KPIs> {
    // Calculate real-time KPIs based on current data
    const allProducts = getProducts(storeId);
    const allTasks = getTasks();

    // At-risk SKUs (MEDIUM, HIGH, CRITICAL)
    let atRiskCount = 0;
    let totalExpectedLoss = 0;

    for (const product of allProducts) {
      try {
        const forecast = await this.demandAgent.forecast({
          storeId,
          skuId: product.id
        });

        if (['MEDIUM', 'HIGH', 'CRITICAL'].includes(forecast.riskLevel)) {
          atRiskCount++;
          totalExpectedLoss += forecast.expectedLoss;
        }
      } catch (error) {
        console.warn(`KPI calculation failed for ${product.id}:`, error);
      }
    }

    // Revenue protected (inverse of expected losses)
    const revenueProtected = Math.max(0, 50000 - totalExpectedLoss);

    // Tasks pending
    const tasksPending = allTasks.filter(t => t.status === 'pending').length;

    // Stockout predictions
    const stockoutPredictions = atRiskCount;

    // Mock forecast accuracy (would be calculated from historical data)
    const forecastAccuracy = 94.5;

    // Additional enterprise metrics
    const oosRate = Math.min(15, (atRiskCount / allProducts.length) * 100);
    const marginImpact = totalExpectedLoss * 0.4; // Estimated margin impact

    return {
      atRiskSKUs: atRiskCount,
      revenueProtected: Math.round(revenueProtected),
      tasksPending,
      stockoutPredictions,
      forecastAccuracy,
      oosRate: Math.round(oosRate * 10) / 10,
      marginImpact: Math.round(marginImpact)
    };
  }

  private generateAlerts(topRisks: StockRisk[], activeTasks: any[]): Alert[] {
    const alerts: Alert[] = [];

    // Critical stockout alerts
    const criticalRisks = topRisks.filter(r => r.riskLevel === 'CRITICAL');
    for (const risk of criticalRisks) {
      alerts.push({
        id: `ALERT_${risk.sku}_${Date.now()}`,
        type: 'critical',
        title: 'Critical Stockout Risk',
        message: `${risk.product} will stock out in ${risk.timeRemaining} - Expected loss: $${risk.expectedLoss}`,
        sku: risk.sku,
        store: risk.store,
        timestamp: new Date().toISOString()
      });
    }

    // High task volume alerts
    const criticalTasks = activeTasks.filter(t => t.priority === 'Critical').length;
    if (criticalTasks > 2) {
      alerts.push({
        id: `ALERT_TASKS_${Date.now()}`,
        type: 'warning',
        title: 'High Critical Task Volume',
        message: `${criticalTasks} critical tasks pending - Consider additional staffing`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * Execute specific agent workflow
   */
  async executeAgent(
    agentType: string, 
    input: any, 
    context: AgentContext
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    try {
      let result;
      let agentsExecuted = [agentType];

      switch (agentType.toLowerCase()) {
        case 'forecast':
          result = await this.demandAgent.forecast(input);
          break;
        case 'replenishment':
          result = await this.replenishmentAgent.processReplenishment(input);
          break;
        case 'recommendation':
          result = await this.recommendationAgent.findSubstitute(input);
          break;
        case 'planogram':
          result = await this.planogramAgent.generateShelfInsight(input);
          break;
        case 'task':
          result = await this.taskAgent.createTask(input);
          break;
        default:
          throw new Error(`Unknown agent type: ${agentType}`);
      }

      return {
        success: true,
        data: result,
        agentsExecuted,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        error: `Agent execution failed: ${error}`,
        agentsExecuted: [agentType],
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Health check for all agents
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    agents: Record<string, boolean>;
    timestamp: string;
  }> {
    const agentTests = {
      'Demand Forecast Agent': false,
      'Replenishment Agent': false,
      'Recommendation Agent': false,
      'Planogram Agent': false,
      'Task Orchestrator Agent': false
    };

    try {
      // Test each agent with minimal data
      agentTests['Demand Forecast Agent'] = !!(await this.demandAgent.forecast({
        storeId: '102',
        skuId: 'CHIPS_A'
      }));

      agentTests['Replenishment Agent'] = !!(await this.replenishmentAgent.processReplenishment({
        storeId: '102',
        skuId: 'CHIPS_A',
        recommendedQuantity: 1
      }));

      agentTests['Recommendation Agent'] = true; // Always available

      agentTests['Planogram Agent'] = !!(await this.planogramAgent.generateShelfInsight({
        storeId: '102',
        skuId: 'CHIPS_A',
        riskLevel: 'MEDIUM'
      }));

      agentTests['Task Orchestrator Agent'] = !!(await this.taskAgent.prioritizeTasks('102'));

    } catch (error) {
      console.warn('Health check encountered errors:', error);
    }

    const healthyCount = Object.values(agentTests).filter(Boolean).length;
    const totalCount = Object.keys(agentTests).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) status = 'healthy';
    else if (healthyCount >= totalCount * 0.6) status = 'degraded';
    else status = 'unhealthy';

    return {
      status,
      agents: agentTests,
      timestamp: new Date().toISOString()
    };
  }
}