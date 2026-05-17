import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ownerCookieName = 'stevezhu_owner_mode';

export async function POST(request: Request) {
  const configuredPasscode = process.env.OWNER_PASSCODE;
  const { hostname } = new URL(request.url);
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (!configuredPasscode) {
    return NextResponse.json({ error: 'Owner passcode is not configured.' }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { key?: string } | null;

  if (body?.key !== configuredPasscode) {
    return NextResponse.json({ error: 'Invalid passcode.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ownerCookieName, 'unlocked', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' && !isLocalhost,
    path: '/',
  });

  return NextResponse.json({ unlocked: true });
}
