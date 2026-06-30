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
          error: result.error || 'Recommendation generation failed',
          agentsExecuted: result.agentsExecuted || [],
          executionTime: result.executionTime || 0
        }, 
        { status: 500 }
      );
    }

    // Handle case where no substitute is available
    if (!result.data) {
      return NextResponse.json({
        recommendation: null,
        message: 'No suitable substitute found for this product',
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
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: `Recommendation API error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}