import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ownerCookieName = 'stevezhu_owner_mode';

export async function GET() {
  const cookieStore = await cookies();

  return NextResponse.json({
    unlocked: cookieStore.get(ownerCookieName)?.value === 'unlocked',
  });
}
