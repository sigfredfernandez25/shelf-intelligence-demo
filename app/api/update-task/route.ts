import { NextRequest, NextResponse } from 'next/server';
import { TaskOrchestratorAgent } from '../../../src/agents/taskOrchestratorAgent';

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

    const result = await taskAgent.updateTaskStatus(taskId, status, notes);
    
    if (result.status === 'error') {
      return NextResponse.json(
        { error: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      task: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Update task API error: ${error}` },
      { status: 500 }
    );
  }
}