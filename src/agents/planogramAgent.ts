import { PlanogramInput, PlanogramOutput, RiskLevel } from '../types';
import { getProduct, getPlanogramData } from '../data/mockDatabase';

/**
 * Planogram Agent
 * Optimizes shelf space allocation based on demand patterns and risk levels
 */
export class PlanogramAgent {

  async generateShelfInsight(input: PlanogramInput): Promise<PlanogramOutput> {
    const { storeId, skuId, riskLevel } = input;

    // Get product and planogram data
    const product = getProduct(skuId);
    if (!product) {
      throw new Error(`Product ${skuId} not found`);
    }

    const planogramData = getPlanogramData(skuId);
    if (!planogramData) {
      throw new Error(`Planogram data not found for ${skuId}`);
    }

    const { currentFacings, maxFacings, category } = planogramData;

    // Calculate recommended facings based on risk and performance
    const recommendedFacings = this.calculateOptimalFacings(
      currentFacings,
      maxFacings,
      riskLevel,
      product
    );

    // Generate reasoning for the recommendation
    const reasoning = this.generateFacingReasoning(
      currentFacings,
      recommendedFacings,
      riskLevel,
      product
    );

    // Generate shelf optimization strategy
    const shelfOptimization = this.generateShelfOptimization(
      currentFacings,
      recommendedFacings,
      category,
      product
    );

    return {
      currentFacings,
      recommendedFacings,
      reasoning,
      shelfOptimization
    };
  }

  private calculateOptimalFacings(
    currentFacings: number,
    maxFacings: number,
    riskLevel: RiskLevel,
    product: any
  ): number {
    let recommendedFacings = currentFacings;

    // Adjust based on risk level
    switch (riskLevel) {
      case 'CRITICAL':
        // Maximize shelf presence for critical items
        recommendedFacings = Math.min(maxFacings, currentFacings + 2);
        break;
      case 'HIGH':
        // Increase facings moderately
        recommendedFacings = Math.min(maxFacings, currentFacings + 1);
        break;
      case 'MEDIUM':
        // Maintain or slightly increase
        recommendedFacings = Math.min(maxFacings, currentFacings + 1);
        break;
      case 'LOW':
        // Consider reducing if overallocated
        if (currentFacings > 2 && product.currentStock > product.shelfCapacity * 0.8) {
          recommendedFacings = Math.max(2, currentFacings - 1);
        }
        break;
    }

    // Apply promotion multiplier
    if (product.promotion?.active) {
      const promotionMultiplier = 1.5;
      recommendedFacings = Math.min(
        maxFacings,
        Math.ceil(recommendedFacings * promotionMultiplier)
      );
    }

    // Ensure we don't exceed physical constraints
    const shelfCapacityConstraint = Math.floor(product.shelfCapacity / 8); // Assume ~8 units per facing
    recommendedFacings = Math.min(recommendedFacings, shelfCapacityConstraint, maxFacings);

    return Math.max(1, recommendedFacings); // Always maintain at least 1 facing
  }

  private generateFacingReasoning(
    currentFacings: number,
    recommendedFacings: number,
    riskLevel: RiskLevel,
    product: any
  ): string {
    if (recommendedFacings === currentFacings) {
      return `Current ${currentFacings} facings optimal for current demand and inventory levels.`;
    }

    const change = recommendedFacings - currentFacings;
    const reasons = [];

    if (change > 0) {
      // Increasing facings
      reasons.push(`Increase to ${recommendedFacings} facings`);
      
      if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
        reasons.push(`high stockout risk requires increased shelf presence`);
      }
      
      if (product.promotion?.active) {
        reasons.push(`active promotion driving +${product.promotion.lift}% demand`);
      }
      
      reasons.push(`improved visibility expected to reduce customer search time`);
    } else {
      // Decreasing facings
      reasons.push(`Reduce to ${recommendedFacings} facings`);
      reasons.push(`current allocation exceeds demand requirements`);
      reasons.push(`space can be reallocated to higher-velocity items`);
    }

    return reasons.join(", ");
  }

  private generateShelfOptimization(
    currentFacings: number,
    recommendedFacings: number,
    category: string,
    product: any
  ): string {
    const strategies = [];

    // Facing change strategy
    if (recommendedFacings > currentFacings) {
      const increase = recommendedFacings - currentFacings;
      strategies.push(`Add ${increase} facing${increase > 1 ? 's' : ''} for increased visibility`);
      
      if (product.promotion?.active) {
        strategies.push(`Position promotional units at eye level for maximum impact`);
        strategies.push(`Create promotional end-cap display if space permits`);
      }
    } else if (recommendedFacings < currentFacings) {
      const decrease = currentFacings - recommendedFacings;
      strategies.push(`Reduce by ${decrease} facing${decrease > 1 ? 's' : ''} to optimize space allocation`);
    }

    // Category-specific optimizations
    switch (category) {
      case 'Snacks':
        strategies.push(`Position at checkout-adjacent locations to capture impulse purchases`);
        if (product.promotion?.active) {
          strategies.push(`Use bright signage to highlight promotion benefits`);
        }
        break;
      case 'Breakfast':
        strategies.push(`Maintain consistent breakfast aisle positioning for customer convenience`);
        strategies.push(`Group with complementary items (milk, fruit) for cross-selling`);
        break;
      case 'Beverages':
        strategies.push(`Ensure cold chain positioning for chilled products`);
        strategies.push(`Position popular sizes at optimal reach heights`);
        break;
    }

    // Stock level considerations
    const stockRatio = product.currentStock / product.shelfCapacity;
    if (stockRatio < 0.3) {
      strategies.push(`⚠️ PRIORITY: Low stock requires immediate attention before facing changes`);
    } else if (stockRatio > 0.9) {
      strategies.push(`High stock levels support increased facing allocation`);
    }

    return strategies.length > 0 
      ? strategies.join(". ") + "."
      : "Maintain current shelf configuration.";
  }

  async analyzeShelfPerformance(skuId: string): Promise<{
    currentEfficiency: number;
    projectedEfficiency: number;
    spaceUtilization: number;
    recommendations: string[];
  }> {
    const product = getProduct(skuId);
    const planogramData = getPlanogramData(skuId);
    
    if (!product || !planogramData) {
      throw new Error(`Data not found for shelf performance analysis of ${skuId}`);
    }

    // Calculate current efficiency (sales per facing)
    const dailySales = 50; // Mock recent daily sales
    const currentEfficiency = dailySales / planogramData.currentFacings;

    // Project efficiency with optimized facings
    const optimalFacings = Math.min(planogramData.maxFacings, planogramData.currentFacings + 1);
    const projectedEfficiency = dailySales / optimalFacings;

    // Calculate space utilization
    const spaceUtilization = (planogramData.currentFacings / planogramData.maxFacings) * 100;

    // Generate actionable recommendations
    const recommendations = [];
    
    if (spaceUtilization < 50) {
      recommendations.push("Under-utilized shelf space - consider increasing facings");
    }
    
    if (currentEfficiency > 10) {
      recommendations.push("High sales per facing - candidate for space expansion");
    }
    
    if (product.promotion?.active) {
      recommendations.push("Active promotion - temporarily increase shelf presence");
    }

    return {
      currentEfficiency: Math.round(currentEfficiency * 100) / 100,
      projectedEfficiency: Math.round(projectedEfficiency * 100) / 100,
      spaceUtilization: Math.round(spaceUtilization),
      recommendations
    };
  }

  async getCategoryOptimization(category: string, storeId: string): Promise<{
    totalFacings: number;
    utilization: number;
    topPerformers: string[];
    underperformers: string[];
    recommendations: string[];
  }> {
    // Mock category analysis - in production this would analyze all SKUs in category
    return {
      totalFacings: 24,
      utilization: 78,
      topPerformers: ['CHIPS_A', 'CHIPS_B'],
      underperformers: [],
      recommendations: [
        'Reallocate 2 facings from low-velocity items to promotional products',
        'Consider seasonal adjustments for Q1 demand patterns',
        'Monitor weekend vs weekday performance variations'
      ]
    };
  }
}