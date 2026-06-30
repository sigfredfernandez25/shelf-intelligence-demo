import { NextRequest, NextResponse } from 'next/server';
import { ShelfIntelligenceOrchestrator } from '../../../src/agents/orchestrator';

const orchestrator = new ShelfIntelligenceOrchestrator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, skuId, riskLevel } = body;

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

    const planogramInput = {
      storeId,
      skuId,
      riskLevel: riskLevel || 'MEDIUM'
    };

    const result = await orchestrator.executeAgent('planogram', planogramInput, context);
    
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

    return NextResponse.json({
      planogramInsight: result.data,
      metadata: {
        agentsExecuted: result.agentsExecuted,
        executionTime: result.executionTime,
        timestamp: context.timestamp
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Planogram insight API error: ${error}` },
      { status: 500 }
    );
  }
}