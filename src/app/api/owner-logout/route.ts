import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ownerCookieName } from '@/lib/ownerAuth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ownerCookieName);

  return NextResponse.json({ unlocked: false });
}
