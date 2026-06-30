import { NextRequest, NextResponse } from 'next/server';
import { ShelfIntelligenceOrchestrator } from '../../../src/agents/orchestrator';

const orchestrator = new ShelfIntelligenceOrchestrator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, skuId } = body;

    if (!storeId || !skuId) {
      return NextResponse.json(
        { error: 'storeId and skuId are required' },
        { status: 400 }
      );
    }

    const context = {
      storeId,
      timestamp: new Date().toISOString(),
      userId: 'system'
    };

    const result = await orchestrator.executeAgent('recommendation', { storeId, skuId }, context);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          agentsExecuted: result.agentsExecuted,
          executionTime: result.executionTime
        }, 
        { status: 500 }
      );
    }

    // Handle case where no substitute is available
    if (!result.data) {
      return NextResponse.json({
        recommendation: null,
        message: 'No suitable substitute found',
        metadata: {
          agentsExecuted: result.agentsExecuted,
          executionTime: result.executionTime,
          timestamp: context.timestamp
        }
      });
    }

    return NextResponse.json({
      recommendation: result.data,
      metadata: {
        agentsExecuted: result.agentsExecuted,
        executionTime: result.executionTime,
        timestamp: context.timestamp
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Recommendation API error: ${error}` },
      { status: 500 }
    );
  }
}