import { TaskInput, TaskOutput, Task } from '../types';
import { getProduct, addTask, updateTask, getTasksBySKU, generateTaskId, getTasks } from '../data/serverDatabase';

// Get tasks for compatibility
const mockTasks = getTasks();

/**
 * Task Orchestrator Agent
 * Manages task creation, prioritization, assignment, and tracking
 */
export class TaskOrchestratorAgent {

  async createTask(input: TaskInput): Promise<TaskOutput> {
    const { storeId, skuId, action, priority, quantity } = input;

    try {
      const product = getProduct(skuId);
      if (!product) {
        return {
          taskId: '',
          status: 'error',
          message: `Product ${skuId} not found`
        };
      }

      const taskId = generateTaskId();
      const task = this.buildTask(taskId, storeId, skuId, action, priority, quantity, product);
      
      addTask(task);

      return {
        taskId,
        status: 'created',
        message: `Task ${taskId} created successfully: ${task.title}`
      };
    } catch (error) {
      return {
        taskId: '',
        status: 'error',
        message: `Failed to create task: ${error}`
      };
    }
  }

  async updateTaskStatus(taskId: string, status: Task['status'], notes?: string): Promise<TaskOutput> {
    try {
      const updates: Partial<Task> = { status };
      
      if (notes) {
        updates.instructions = `${mockTasks.find(t => t.id === taskId)?.instructions}\n\nNotes: ${notes}`;
      }

      const updatedTask = updateTask(taskId, updates);
      
      if (!updatedTask) {
        return {
          taskId,
          status: 'error',
          message: `Task ${taskId} not found`
        };
      }

      return {
        taskId,
        status: 'updated',
        message: `Task ${taskId} updated to ${status}`
      };
    } catch (error) {
      return {
        taskId,
        status: 'error',
        message: `Failed to update task: ${error}`
      };
    }
  }

  async prioritizeTasks(storeId: string): Promise<Task[]> {
    // Get all tasks for the store
    const allTasks = mockTasks.filter(task => 
      task.status === 'pending' || task.status === 'in-progress'
    );

    // Sort by priority and urgency
    return allTasks.sort((a, b) => {
      // First sort by priority
      const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by creation time (older first)
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      
      return timeA - timeB;
    });
  }

  async getTaskInsights(storeId: string): Promise<{
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedToday: number;
    averageCompletionTime: number;
    criticalTasks: number;
    recommendations: string[];
  }> {
    const allTasks = mockTasks;
    const today = new Date().toDateString();
    
    const totalTasks = allTasks.length;
    const pendingTasks = allTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;
    const completedToday = allTasks.filter(t => 
      t.status === 'completed' && 
      new Date(t.updatedAt || t.createdAt || '').toDateString() === today
    ).length;
    const criticalTasks = allTasks.filter(t => t.priority === 'Critical' && t.status !== 'completed').length;

    // Mock average completion time calculation
    const averageCompletionTime = 18; // minutes

    const recommendations = this.generateTaskRecommendations({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      criticalTasks,
      averageCompletionTime
    });

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedToday,
      averageCompletionTime,
      criticalTasks,
      recommendations
    };
  }

  private buildTask(
    taskId: string,
    storeId: string,
    skuId: string,
    action: string,
    priority: Task['priority'],
    quantity: number | undefined,
    product: any
  ): Task {
    const taskType = this.determineTaskType(action);
    const location = this.getLocationForProduct(product.category);
    const estimatedTime = this.estimateTaskTime(action, quantity);
    const instructions = this.generateTaskInstructions(action, product, quantity);

    return {
      id: taskId,
      title: this.generateTaskTitle(action, product.name),
      priority,
      assignee: 'System Assigned',
      estimatedTime,
      location,
      instructions,
      status: 'pending',
      sku: skuId,
      quantity,
      type: taskType,
      createdAt: new Date().toISOString()
    };
  }

  private determineTaskType(action: string): Task['type'] {
    switch (action.toLowerCase()) {
      case 'restock':
      case 'replenish':
        return 'restock';
      case 'substitute':
      case 'substitution':
        return 'substitution';
      case 'verify':
      case 'check':
        return 'verification';
      case 'planogram':
      case 'facing':
        return 'planogram';
      default:
        return 'restock';
    }
  }

  private getLocationForProduct(category: string): string {
    const locationMap: Record<string, string> = {
      'Snacks': 'Aisle 3, Section A',
      'Breakfast': 'Aisle 2, Section B',
      'Beverages': 'Aisle 1, Section C',
      'Dairy': 'Cold Section, Wall A',
      'Frozen': 'Frozen Section, Aisle F'
    };

    return locationMap[category] || 'Main Floor - Location TBD';
  }

  private estimateTaskTime(action: string, quantity?: number): string {
    const baseTimeMap: Record<string, number> = {
      'restock': 15,
      'substitute': 20,
      'verify': 10,
      'planogram': 25
    };

    let baseTime = baseTimeMap[action.toLowerCase()] || 15;
    
    // Adjust for quantity
    if (quantity && quantity > 10) {
      baseTime += Math.ceil((quantity - 10) / 5) * 3;
    }

    return baseTime < 60 ? `${baseTime} min` : `${Math.floor(baseTime/60)}h ${baseTime%60}m`;
  }

  private generateTaskTitle(action: string, productName: string): string {
    switch (action.toLowerCase()) {
      case 'restock':
      case 'replenish':
        return `Restock ${productName}`;
      case 'substitute':
      case 'substitution':
        return `Setup Substitute for ${productName}`;
      case 'verify':
      case 'check':
        return `Verify ${productName} Display`;
      case 'planogram':
      case 'facing':
        return `Adjust ${productName} Planogram`;
      default:
        return `${action} ${productName}`;
    }
  }

  private generateTaskInstructions(action: string, product: any, quantity?: number): string {
    let instructions = '';

    switch (action.toLowerCase()) {
      case 'restock':
      case 'replenish':
        instructions = `Restock ${quantity || 'required'} units of ${product.name}:\n`;
        instructions += `• Move inventory from backroom to shelf location\n`;
        instructions += `• Ensure proper product rotation (FIFO)\n`;
        instructions += `• Verify expiration dates\n`;
        instructions += `• Update shelf tags if needed`;
        break;
        
      case 'substitute':
      case 'substitution':
        instructions = `Setup product substitution for ${product.name}:\n`;
        instructions += `• Remove out-of-stock signage\n`;
        instructions += `• Position substitute product prominently\n`;
        instructions += `• Update promotional materials\n`;
        instructions += `• Place substitution notification signage`;
        break;
        
      case 'verify':
      case 'check':
        instructions = `Verify display setup for ${product.name}:\n`;
        instructions += `• Check shelf alignment and facing\n`;
        instructions += `• Confirm pricing accuracy\n`;
        instructions += `• Verify promotional signage\n`;
        instructions += `• Report any issues found`;
        break;
        
      case 'planogram':
      case 'facing':
        instructions = `Adjust planogram for ${product.name}:\n`;
        instructions += `• Modify facing count as recommended\n`;
        instructions += `• Ensure proper shelf allocation\n`;
        instructions += `• Update position for optimal visibility\n`;
        instructions += `• Maintain category integrity`;
        break;
        
      default:
        instructions = `Complete ${action} for ${product.name}:\n`;
        instructions += `• Follow standard operating procedures\n`;
        instructions += `• Document completion details\n`;
        instructions += `• Report any issues encountered`;
    }

    if (product.promotion?.active) {
      instructions += `\n\n⚠️ PROMOTION ACTIVE: ${product.promotion.type}`;
      instructions += `\n• Ensure promotional materials are visible and accurate`;
    }

    return instructions;
  }

  private generateTaskRecommendations(metrics: {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    criticalTasks: number;
    averageCompletionTime: number;
  }): string[] {
    const recommendations = [];

    if (metrics.criticalTasks > 3) {
      recommendations.push('High critical task volume - consider additional staffing');
    }

    if (metrics.pendingTasks > metrics.inProgressTasks * 2) {
      recommendations.push('Task backlog building - prioritize completion of in-progress items');
    }

    if (metrics.averageCompletionTime > 25) {
      recommendations.push('Above-average completion times - review task complexity and resource allocation');
    }

    if (metrics.totalTasks > 20) {
      recommendations.push('High task volume - consider workflow optimization');
    }

    if (recommendations.length === 0) {
      recommendations.push('Task flow is operating efficiently - maintain current procedures');
    }

    return recommendations;
  }

  async assignTaskToAssociate(taskId: string, associateId: string): Promise<TaskOutput> {
    try {
      const updatedTask = updateTask(taskId, { 
        assignee: associateId,
        status: 'pending'
      });

      if (!updatedTask) {
        return {
          taskId,
          status: 'error',
          message: `Task ${taskId} not found`
        };
      }

      return {
        taskId,
        status: 'updated',
        message: `Task ${taskId} assigned to ${associateId}`
      };
    } catch (error) {
      return {
        taskId,
        status: 'error',
        message: `Failed to assign task: ${error}`
      };
    }
  }
}