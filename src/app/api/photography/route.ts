import { NextResponse } from 'next/server';
import { requireOwner } from '@/lib/ownerApi';
import {
  isPhotographyPayload,
  loadPhotographyPayload,
  savePhotographyPayload,
} from '@/lib/photographyState';

export async function GET() {
  try {
    return NextResponse.json({
      payload: await loadPhotographyPayload(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load photography state.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await requireOwner();
  if (unauthorizedResponse) return unauthorizedResponse;

  const body = (await request.json().catch(() => null)) as { payload?: unknown } | null;
  if (!body || !isPhotographyPayload(body.payload)) {
    return NextResponse.json({ error: 'Invalid photography payload.' }, { status: 400 });
  }

  try {
    await savePhotographyPayload(body.payload);

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save photography state.' },
      { status: 500 },
    );
  }
}
