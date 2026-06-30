import { NextRequest, NextResponse } from 'next/server';
import { ShelfIntelligenceOrchestrator } from '../../../src/agents/orchestrator';

const orchestrator = new ShelfIntelligenceOrchestrator();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || '102';
    
    const context = {
      storeId,
      timestamp: new Date().toISOString(),
      userId: 'system'
    };

    const result = await orchestrator.runDashboardFlow(context);
    
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
      ...result.data,
      metadata: {
        agentsExecuted: result.agentsExecuted,
        executionTime: result.executionTime,
        storeId,
        timestamp: context.timestamp
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Dashboard API error: ${error}` },
      { status: 500 }
    );
  }
}