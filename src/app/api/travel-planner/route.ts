import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import { requestSupabase } from '@/lib/supabaseAdmin';

const plannerStateId = 'default';

type PlannerStateRow = {
  payload: unknown;
};

const unauthorizedResponse = () => NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

export async function GET() {
  if (!(await isOwnerUnlocked())) {
    return unauthorizedResponse();
  }

  try {
    const rows = await requestSupabase<PlannerStateRow[]>(
      `/travel_planner_state?id=eq.${plannerStateId}&select=payload`,
    );

    return NextResponse.json({
      payload: rows[0]?.payload ?? null,
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

  if (!body || !body.payload || typeof body.payload !== 'object') {
    return NextResponse.json({ error: 'Invalid planner payload.' }, { status: 400 });
  }

  try {
    await requestSupabase('/travel_planner_state?on_conflict=id', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: {
        id: plannerStateId,
        payload: body.payload,
      },
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save planner state.' },
      { status: 500 },
    );
  }
}
