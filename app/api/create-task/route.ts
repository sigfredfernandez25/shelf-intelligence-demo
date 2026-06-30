import { NextRequest, NextResponse } from 'next/server';
import { ShelfIntelligenceOrchestrator } from '../../../src/agents/orchestrator';

const orchestrator = new ShelfIntelligenceOrchestrator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, skuId, action, priority, quantity } = body;

    if (!storeId || !skuId || !action) {
      return NextResponse.json(
        { error: 'storeId, skuId, and action are required' },
        { status: 400 }
      );
    }

    const context = {
      storeId,
      timestamp: new Date().toISOString(),
      userId: 'system'
    };

    const taskInput = {
      storeId,
      skuId,
      action,
      priority: priority || 'Medium',
      quantity
    };

    const result = await orchestrator.executeAgent('task', taskInput, context);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Task creation failed',
          agentsExecuted: result.agentsExecuted || [],
          executionTime: result.executionTime || 0
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      task: result.data,
      metadata: {
        agentsExecuted: result.agentsExecuted,
        executionTime: result.executionTime,
        timestamp: context.timestamp
      }
    });

  } catch (error) {
    console.error('Create task API error:', error);
    return NextResponse.json(
      { error: `Create task API error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}