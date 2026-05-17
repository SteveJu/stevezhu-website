import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import { isTravelPlannerPayload, loadTravelPlannerPayload, saveTravelPlannerPayload } from '@/lib/travelPlannerState';

const unauthorizedResponse = () => NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

export async function GET() {
  if (!(await isOwnerUnlocked())) {
    return unauthorizedResponse();
  }

  try {
    return NextResponse.json({
      payload: await loadTravelPlannerPayload(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load planner state.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isOwnerUnlocked())) {
    return unauthorizedResponse();
  }

  const body = (await request.json().catch(() => null)) as { payload?: unknown } | null;

  if (!body || !isTravelPlannerPayload(body.payload)) {
    return NextResponse.json({ error: 'Invalid planner payload.' }, { status: 400 });
  }

  try {
    await saveTravelPlannerPayload(body.payload);

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save planner state.' },
      { status: 500 },
    );
  }
}
