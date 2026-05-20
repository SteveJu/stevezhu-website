import { NextResponse } from 'next/server';
import { requireOwner } from '@/lib/ownerApi';
import { deleteR2Object } from '@/lib/r2';

export async function DELETE(request: Request) {
  const unauthorizedResponse = await requireOwner();
  if (unauthorizedResponse) return unauthorizedResponse;

  const body = (await request.json().catch(() => null)) as { storageKey?: string } | null;
  if (!body?.storageKey) {
    return NextResponse.json({ error: 'Missing storage key.' }, { status: 400 });
  }

  try {
    await deleteR2Object(body.storageKey);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete photo file.' },
      { status: 500 },
    );
  }
}
