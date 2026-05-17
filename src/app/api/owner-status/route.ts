import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';

export async function GET() {
  return NextResponse.json({
    unlocked: await isOwnerUnlocked(),
  });
}
