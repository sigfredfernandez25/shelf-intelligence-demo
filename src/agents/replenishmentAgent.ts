import { ReplenishmentInput, ReplenishmentOutput, Task } from '../types';
import { getProduct, addTask, generateTaskId } from '../data/mockDatabase';

/**
 * Replenishment Agent
 * Manages restocking tasks and inventory allocation
 */
export class ReplenishmentAgent {

  async processReplenishment(input: ReplenishmentInput): Promise<ReplenishmentOutput> {
    const { storeId, skuId, recommendedQuantity } = input;

    // Get product information
    const product = getProduct(skuId);
    if (!product) {
      throw new Error(`Product ${skuId} not found`);
    }

    // Check backroom availability
    const backroomStock = product.backroomStock;
    
    if (backroomStock === 0) {
      // No stock available - trigger substitution workflow
      return {
        action: 'substitute',
        message: 'No backroom inventory available. Recommend substitute product.',
        backroomStock: 0
      };
    }

    if (backroomStock < recommendedQuantity) {
      // Partial stock available
      const availableQuantity = backroomStock;
      const taskId = await this.createRestockTask(storeId, skuId, availableQuantity, 'High');
      
      return {
        taskId,
        action: 'restock',
        message: `Partial restock task created for ${availableQuantity} units (${recommendedQuantity - availableQuantity} units short).`,
        backroomStock: availableQuantity
      };
    }

    // Full stock available
    const taskId = await this.createRestockTask(storeId, skuId, recommendedQuantity, 'Critical');
    
    return {
      taskId,
      action: 'restock',
      message: `Restock task created for ${recommendedQuantity} units.`,
      backroomStock
    };
  }

  private async createRestockTask(
    storeId: string, 
    skuId: string, 
    quantity: number, 
    priority: Task['priority']
  ): Promise<string> {
    
    const product = getProduct(skuId);
    if (!product) throw new Error(`Product ${skuId} not found`);

    const taskId = generateTaskId();
    const location = this.determineLocation(product.category);
    const estimatedTime = this.calculateTaskTime(quantity);

    const task: Task = {
      id: taskId,
      title: `Restock ${product.name}`,
      priority,
      assignee: 'System Assigned',
      estimatedTime,
      location,
      instructions: this.generateInstructions(product, quantity),
      status: 'pending',
      sku: skuId,
      quantity,
      type: 'restock',
      createdAt: new Date().toISOString()
    };

    // Add task to mock database
    addTask(task);

    return taskId;
  }

  private determineLocation(category: string): string {
    const locationMap: Record<string, string> = {
      'Snacks': 'Aisle 3, Section A',
      'Breakfast': 'Aisle 2, Section B',
      'Beverages': 'Aisle 1, Section C',
      'Dairy': 'Cold Section, Wall A',
      'Frozen': 'Frozen Section, Aisle F'
    };

    return locationMap[category] || 'Main Floor - TBD';
  }

  private calculateTaskTime(quantity: number): string {
    // Base time calculations
    const baseMinutes = 5; // Setup and travel
    const unitsPerMinute = 2; // Processing rate
    const bufferMinutes = 2; // Buffer time
    
    const totalMinutes = baseMinutes + Math.ceil(quantity / unitsPerMinute) + bufferMinutes;
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }

  private generateInstructions(product: any, quantity: number): string {
    let instructions = `Move ${quantity} units of ${product.name} from backroom to shelf location.\n`;
    
    if (product.promotion?.active) {
      instructions += `⚠️ PROMOTION ACTIVE: ${product.promotion.type}\n`;
      instructions += `• Update promotional signage and display\n`;
      instructions += `• Ensure promotional materials are visible\n`;
    }
    
    instructions += `• Verify product rotation (FIFO)\n`;
    instructions += `• Check expiration dates\n`;
    instructions += `• Update shelf tags if needed\n`;
    instructions += `• Confirm proper shelf alignment`;
    
    return instructions;
  }

  async getOptimalRestockQuantity(skuId: string, currentStock: number, salesVelocity: number): Promise<number> {
    const product = getProduct(skuId);
    if (!product) throw new Error(`Product ${skuId} not found`);

    // Calculate days of supply target (usually 3-7 days)
    const targetDaysSupply = product.promotion?.active ? 2 : 4; // Shorter during promotions
    const targetStock = Math.ceil(salesVelocity * 24 * targetDaysSupply); // Convert to daily then multiply
    
    // Don't exceed shelf capacity
    const maxRestock = product.shelfCapacity - currentStock;
    const optimalQuantity = Math.min(targetStock - currentStock, maxRestock);
    
    // Ensure minimum economic order quantity
    const minOrderQuantity = 5;
    
    return Math.max(optimalQuantity, minOrderQuantity);
  }

  async validateRestockCapacity(skuId: string, quantity: number): Promise<{
    canRestock: boolean;
    maxCapacity: number;
    recommendation: string;
  }> {
    const product = getProduct(skuId);
    if (!product) throw new Error(`Product ${skuId} not found`);

    const availableCapacity = product.shelfCapacity - product.currentStock;
    const canRestock = quantity <= availableCapacity;

    return {
      canRestock,
      maxCapacity: availableCapacity,
      recommendation: canRestock 
        ? `Restock ${quantity} units as planned`
        : `Reduce quantity to ${availableCapacity} units (shelf capacity limit)`
    };
  }
}