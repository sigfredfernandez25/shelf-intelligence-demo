import { NextResponse } from 'next/server';
import { ShelfIntelligenceOrchestrator } from '../../../src/agents/orchestrator';

const orchestrator = new ShelfIntelligenceOrchestrator();

export async function GET() {
  try {
    const healthStatus = await orchestrator.healthCheck();
    
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 206 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: `Health check failed: ${error}`,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}