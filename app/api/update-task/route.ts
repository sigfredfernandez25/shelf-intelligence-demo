import { NextRequest, NextResponse } from 'next/server';
import { TaskOrchestratorAgent } from '../../../src/agents/taskOrchestratorAgent';
import db from '../../../src/data/serverDatabase';

const taskAgent = new TaskOrchestratorAgent();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, status, notes } = body;

    if (!taskId || !status) {
      return NextResponse.json(
        { error: 'taskId and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'escalated'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Get task details before updating
    const tasks = db.getTasks();
    const task = tasks.find(t => t.id === taskId);

    const result = await taskAgent.updateTaskStatus(taskId, status, notes);
    
    if (result.status === 'error') {
      return NextResponse.json(
        { error: result.message },
        { status: 404 }
      );
    }

    // If task is completed and it's a restock task, update inventory
    if (status === 'completed' && task && task.type === 'restock' && task.quantity && task.sku && task.storeId) {
      try {
        const product = db.getProduct(task.sku, task.storeId);
        if (product) {
          const currentBackroom = product.backroomStock || 0;
          const currentShelf = product.currentStock || 0;
          
          // Calculate restock amount (limited by backroom availability)
          const restockQuantity = Math.min(task.quantity, currentBackroom);
          
          if (restockQuantity > 0) {
            // Update inventory: move from backroom to shelf
            const newBackroomStock = currentBackroom - restockQuantity;
            const newShelfStock = currentShelf + restockQuantity;

            db.updateInventory(task.storeId, task.sku, {
              currentStock: newShelfStock,
              backroomStock: newBackroomStock,
            });

            console.log(`Inventory updated: ${task.sku} - Moved ${restockQuantity} units from backroom to shelf`);
          }
        }
      } catch (inventoryError) {
        console.error('Failed to update inventory:', inventoryError);
        // Don't fail the task update if inventory update fails
      }
    }

    return NextResponse.json({
      task: result,
      timestamp: new Date().toISOString(),
      inventoryUpdated: status === 'completed' && task?.type === 'restock'
    });

  } catch (error) {
    console.error('Update task API error:', error);
    return NextResponse.json(
      { error: `Update task API error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}