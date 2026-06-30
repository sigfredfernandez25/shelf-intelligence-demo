import { ForecastInput, ForecastOutput, RiskLevel } from '../types';
import { getProduct, getSalesHistory } from '../data/mockDatabase';

/**
 * Demand Forecast Agent
 * Analyzes sales patterns and predicts stockout risk
 */
export class DemandForecastAgent {
  
  async forecast(input: ForecastInput): Promise<ForecastOutput> {
    const { storeId, skuId } = input;
    
    // Get product and sales data
    const product = getProduct(skuId);
    if (!product) {
      throw new Error(`Product ${skuId} not found`);
    }

    const salesHistory = getSalesHistory(skuId);
    if (salesHistory.length === 0) {
      throw new Error(`No sales history for ${skuId}`);
    }

    // Calculate sales velocity (units per hour)
    const recentSales = salesHistory.slice(-3); // Last 3 days
    const avgDailySales = recentSales.reduce((a, b) => a + b, 0) / recentSales.length;
    
    // Apply promotion lift if active
    let adjustedVelocity = avgDailySales / 24; // Convert to hourly
    if (product.promotion?.active) {
      adjustedVelocity *= (1 + product.promotion.lift / 100);
    }

    // Calculate runout time
    const runoutHours = product.currentStock / adjustedVelocity;
    
    // Determine risk level
    const riskLevel = this.calculateRiskLevel(runoutHours, product.currentStock);
    
    // Calculate confidence based on data quality and trends
    const confidence = this.calculateConfidence(salesHistory, product);
    
    // Estimate potential revenue loss
    const expectedLoss = this.calculateExpectedLoss(adjustedVelocity, runoutHours, product);

    // Generate recommendation
    const recommendation = this.generateRecommendation(riskLevel, runoutHours, product);

    return {
      skuId,
      storeId,
      salesVelocity: Math.round(adjustedVelocity * 100) / 100,
      runoutHours: Math.round(runoutHours * 10) / 10,
      riskLevel,
      confidence: Math.round(confidence),
      expectedLoss: Math.round(expectedLoss),
      recommendation
    };
  }

  private calculateRiskLevel(runoutHours: number, currentStock: number): RiskLevel {
    if (runoutHours <= 4 || currentStock <= 10) return 'CRITICAL';
    if (runoutHours <= 8 || currentStock <= 25) return 'HIGH';
    if (runoutHours <= 24 || currentStock <= 50) return 'MEDIUM';
    return 'LOW';
  }

  private calculateConfidence(salesHistory: number[], product: any): number {
    // Base confidence on data consistency and volume
    const variance = this.calculateVariance(salesHistory);
    const avgSales = salesHistory.reduce((a, b) => a + b, 0) / salesHistory.length;
    
    // Higher variance = lower confidence
    const variabilityFactor = Math.max(0, 1 - (variance / (avgSales * avgSales)));
    
    // Promotion adds uncertainty
    const promotionFactor = product.promotion?.active ? 0.9 : 1.0;
    
    // Data volume factor
    const dataVolumeFactor = Math.min(1, salesHistory.length / 7);
    
    return Math.max(60, Math.min(98, 
      85 * variabilityFactor * promotionFactor * dataVolumeFactor
    ));
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateExpectedLoss(velocity: number, runoutHours: number, product: any): number {
    if (runoutHours <= 0) return 0;
    
    // Estimate lost sales after stockout
    const lostSalesHours = Math.max(0, 24 - runoutHours); // Assume restock within 24h
    const lostUnits = velocity * lostSalesHours;
    const lostRevenue = lostUnits * product.price;
    
    // Apply demand spillover factor (some customers will wait/substitute)
    const spilloverFactor = product.promotion?.active ? 0.8 : 0.6;
    
    return lostRevenue * spilloverFactor;
  }

  private generateRecommendation(riskLevel: RiskLevel, runoutHours: number, product: any): string {
    switch (riskLevel) {
      case 'CRITICAL':
        return `URGENT: Restock immediately. Only ${Math.round(runoutHours)}h remaining at current velocity.`;
      case 'HIGH':
        return `HIGH PRIORITY: Schedule restock within ${Math.round(runoutHours)}h to prevent stockout.`;
      case 'MEDIUM':
        return `MODERATE: Plan restock within next ${Math.round(runoutHours/24)} day(s) to maintain availability.`;
      default:
        return `LOW: Current stock sufficient for ${Math.round(runoutHours/24)} days at current sales rate.`;
    }
  }
}