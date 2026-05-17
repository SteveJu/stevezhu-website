import { NextResponse } from 'next/server';
import {
  isTravelPlannerPayload,
  loadTravelPlannerPayload,
  saveTravelPlannerPayload,
  type TravelPlannerPayload,
} from '@/lib/travelPlannerState';

const getSharedPayload = (payload: TravelPlannerPayload, shareCode: string) => {
  const travel = payload.travels.find((candidate) => candidate.shareCode === shareCode);
  if (!travel) return null;

  return {
    travels: [travel],
    timelineCards: {
      [travel.id]: payload.timelineCards[travel.id] ?? [],
    },
    formValues: {
      [travel.id]: payload.formValues[travel.id] ?? {},
    },
    knownCompanions: travel.companions ?? [],
  };
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareCode: string }> },
) {
  const { shareCode } = await params;

  try {
    const payload = await loadTravelPlannerPayload();
    const sharedPayload = getSharedPayload(payload, shareCode);

    if (!sharedPayload) {
      return NextResponse.json({ error: 'Shared travel not found.' }, { status: 404 });
    }

    return NextResponse.json({ payload: sharedPayload });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load shared travel.' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ shareCode: string }> },
) {
  const { shareCode } = await params;
  const body = (await request.json().catch(() => null)) as { payload?: unknown } | null;

  if (!body || !isTravelPlannerPayload(body.payload) || body.payload.travels.length !== 1) {
    return NextResponse.json({ error: 'Invalid shared travel payload.' }, { status: 400 });
  }

  try {
    const currentPayload = await loadTravelPlannerPayload();
    const incomingTravel = body.payload.travels[0];
    const existingTravel = currentPayload.travels.find((travel) => travel.shareCode === shareCode);

    if (!existingTravel || incomingTravel.id !== existingTravel.id) {
      return NextResponse.json({ error: 'Shared travel not found.' }, { status: 404 });
    }

    const nextPayload: TravelPlannerPayload = {
      travels: currentPayload.travels.map((travel) => (
        travel.id === existingTravel.id
          ? { ...incomingTravel, shareCode }
          : travel
      )),
      timelineCards: {
        ...currentPayload.timelineCards,
        [existingTravel.id]: body.payload.timelineCards[existingTravel.id] ?? [],
      },
      formValues: {
        ...currentPayload.formValues,
        [existingTravel.id]: body.payload.formValues[existingTravel.id] ?? {},
      },
      knownCompanions: Array.from(new Set([
        ...currentPayload.knownCompanions,
        ...incomingTravel.companions,
      ])),
    };

    await saveTravelPlannerPayload(nextPayload);

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save shared travel.' },
      { status: 500 },
    );
  }
}
