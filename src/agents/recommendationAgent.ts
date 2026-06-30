import { RecommendationInput, RecommendationOutput } from '../types';
import { getProduct, getSubstitution } from '../data/mockDatabase';

/**
 * Recommendation Agent
 * Finds optimal product substitutions when primary products are unavailable
 */
export class RecommendationAgent {

  async findSubstitute(input: RecommendationInput): Promise<RecommendationOutput | null> {
    const { storeId, skuId } = input;

    // Get the original product
    const originalProduct = getProduct(skuId);
    if (!originalProduct) {
      throw new Error(`Product ${skuId} not found`);
    }

    // Check if substitution mapping exists
    const substitution = getSubstitution(skuId);
    if (!substitution) {
      return null; // No substitute available
    }

    // Get substitute product details
    const substituteProduct = getProduct(substitution.substituteSKU);
    if (!substituteProduct) {
      throw new Error(`Substitute product ${substitution.substituteSKU} not found`);
    }

    // Verify substitute has sufficient stock
    const substituteStock = substituteProduct.currentStock + substituteProduct.backroomStock;
    if (substituteStock < 10) {
      return null; // Substitute also low on stock
    }

    // Calculate enhanced metrics
    const enhancedMetrics = this.calculateSubstitutionMetrics(originalProduct, substituteProduct);

    return {
      substituteSKU: substitution.substituteSKU,
      substituteName: substituteProduct.name,
      acceptanceRate: substitution.acceptanceRate,
      marginImpact: substitution.marginImpact,
      expectedRecovery: this.calculateExpectedRecovery(substitution.acceptanceRate, enhancedMetrics.demandTransfer),
      reason: this.generateDetailedReason(originalProduct, substituteProduct, enhancedMetrics)
    };
  }

  private calculateSubstitutionMetrics(originalProduct: any, substituteProduct: any) {
    // Brand similarity factor
    const brandSimilarity = originalProduct.brand === substituteProduct.brand ? 1.0 : 0.7;
    
    // Category similarity (assumed same for simplicity)
    const categorySimilarity = originalProduct.category === substituteProduct.category ? 1.0 : 0.5;
    
    // Price proximity factor (closer prices = higher acceptance)
    const priceRatio = Math.min(originalProduct.price, substituteProduct.price) / 
                      Math.max(originalProduct.price, substituteProduct.price);
    const priceSimilarity = priceRatio;
    
    // Margin comparison
    const marginDifference = substituteProduct.margin - originalProduct.margin;
    
    // Overall demand transfer likelihood
    const demandTransfer = (brandSimilarity * 0.4) + (categorySimilarity * 0.3) + (priceSimilarity * 0.3);
    
    return {
      brandSimilarity,
      categorySimilarity,
      priceSimilarity,
      marginDifference,
      demandTransfer,
      priceRatio
    };
  }

  private calculateExpectedRecovery(acceptanceRate: number, demandTransfer: number): number {
    // Account for both customer acceptance and demand transfer efficiency
    const baseRecovery = acceptanceRate;
    const efficiencyFactor = demandTransfer;
    
    return Math.round(baseRecovery * efficiencyFactor);
  }

  private generateDetailedReason(originalProduct: any, substituteProduct: any, metrics: any): string {
    const reasons = [];
    
    // Brand analysis
    if (metrics.brandSimilarity === 1.0) {
      reasons.push("same trusted brand maintains customer loyalty");
    } else {
      reasons.push("established alternative brand with good reputation");
    }
    
    // Price analysis
    const priceDiff = substituteProduct.price - originalProduct.price;
    if (Math.abs(priceDiff) < 0.50) {
      reasons.push("similar price point reduces purchase resistance");
    } else if (priceDiff > 0) {
      reasons.push("premium positioning may increase transaction value");
    } else {
      reasons.push("lower price offers better value proposition");
    }
    
    // Margin analysis
    if (metrics.marginDifference > 0) {
      reasons.push(`improved margin (+${metrics.marginDifference.toFixed(1)}%) enhances profitability`);
    }
    
    // Stock availability
    const totalSubstituteStock = substituteProduct.currentStock + substituteProduct.backroomStock;
    if (totalSubstituteStock > 30) {
      reasons.push("sufficient inventory to handle increased demand");
    }
    
    return reasons.join(", ");
  }

  async getAlternativeSubstitutes(skuId: string): Promise<RecommendationOutput[]> {
    // For demo purposes, return primary substitute
    // In production, this would query multiple substitution options
    const primarySub = await this.findSubstitute({ storeId: "102", skuId });
    return primarySub ? [primarySub] : [];
  }

  async calculateSubstitutionImpact(
    originalSkuId: string, 
    substituteSkuId: string, 
    expectedDemand: number
  ): Promise<{
    revenueImpact: number;
    marginImpact: number;
    customerSatisfactionImpact: number;
    inventoryImpact: string;
  }> {
    const original = getProduct(originalSkuId);
    const substitute = getProduct(substituteSkuId);
    
    if (!original || !substitute) {
      throw new Error('Products not found for impact analysis');
    }

    // Calculate financial impact
    const originalRevenue = expectedDemand * original.price;
    const substitutionData = getSubstitution(originalSkuId);
    const acceptanceRate = substitutionData?.acceptanceRate || 70;
    
    const capturedDemand = expectedDemand * (acceptanceRate / 100);
    const newRevenue = capturedDemand * substitute.price;
    const revenueImpact = newRevenue - (originalRevenue * (acceptanceRate / 100));
    
    // Margin impact
    const originalMarginDollars = expectedDemand * (original.price - original.cost) * (acceptanceRate / 100);
    const newMarginDollars = capturedDemand * (substitute.price - substitute.cost);
    const marginImpact = newMarginDollars - originalMarginDollars;
    
    // Customer satisfaction (simplified model)
    const satisfactionImpact = acceptanceRate; // Direct correlation for demo
    
    // Inventory impact assessment
    const substituteCapacity = substitute.currentStock + substitute.backroomStock;
    let inventoryImpact: string;
    
    if (capturedDemand <= substituteCapacity * 0.3) {
      inventoryImpact = "Low impact - sufficient buffer stock";
    } else if (capturedDemand <= substituteCapacity * 0.7) {
      inventoryImpact = "Moderate impact - monitor substitute levels";
    } else {
      inventoryImpact = "High impact - may need substitute replenishment";
    }

    return {
      revenueImpact: Math.round(revenueImpact * 100) / 100,
      marginImpact: Math.round(marginImpact * 100) / 100,
      customerSatisfactionImpact: satisfactionImpact,
      inventoryImpact
    };
  }

  async validateSubstituteAvailability(substituteSkuId: string, requiredQuantity: number): Promise<{
    available: boolean;
    currentStock: number;
    recommendedMaxSubstitution: number;
    restockNeeded: boolean;
  }> {
    const substitute = getProduct(substituteSkuId);
    if (!substitute) {
      throw new Error(`Substitute product ${substituteSkuId} not found`);
    }

    const totalStock = substitute.currentStock + substitute.backroomStock;
    const available = totalStock >= requiredQuantity;
    
    // Keep safety stock of 20% for substitute
    const safetyStock = Math.ceil(totalStock * 0.2);
    const recommendedMaxSubstitution = Math.max(0, totalStock - safetyStock);
    
    const restockNeeded = recommendedMaxSubstitution < requiredQuantity;

    return {
      available,
      currentStock: totalStock,
      recommendedMaxSubstitution,
      restockNeeded
    };
  }
}