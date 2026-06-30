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
          error: result.error || 'Dashboard generation failed',
          agentsExecuted: result.agentsExecuted || [],
          executionTime: result.executionTime || 0
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
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: `Dashboard API error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}