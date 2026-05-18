import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import {
  isTravelPlannerPayload,
  loadTravelPlannerState,
  saveTravelPlannerPayload,
  TravelPlannerConflictError,
} from '@/lib/travelPlannerState';

const unauthorizedResponse = () => NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

export async function GET() {
  if (!(await isOwnerUnlocked())) {
    return unauthorizedResponse();
  }

  try {
    const state = await loadTravelPlannerState();

    return NextResponse.json({
      payload: state.payload,
      updatedAt: state.updatedAt,
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

  const body = (await request.json().catch(() => null)) as { payload?: unknown; updatedAt?: string | null } | null;

  if (!body || !isTravelPlannerPayload(body.payload)) {
    return NextResponse.json({ error: 'Invalid planner payload.' }, { status: 400 });
  }

  try {
    const updatedAt = await saveTravelPlannerPayload(body.payload, body.updatedAt);

    return NextResponse.json({ saved: true, updatedAt });
  } catch (error) {
    if (error instanceof TravelPlannerConflictError) {
      const state = await loadTravelPlannerState();

      return NextResponse.json(
        { error: 'Planner state was updated elsewhere.', payload: state.payload, updatedAt: state.updatedAt },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save planner state.' },
      { status: 500 },
    );
  }
}
