import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import { deleteR2Object } from '@/lib/r2';

export async function DELETE(request: Request) {
  if (!(await isOwnerUnlocked())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

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
