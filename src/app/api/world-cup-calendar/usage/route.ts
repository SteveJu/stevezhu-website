import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import { loadWorldCupCalendarUsageStats } from '@/lib/worldCupCalendarUsage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const unauthorizedResponse = () => NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

export async function GET() {
  if (!(await isOwnerUnlocked())) {
    return unauthorizedResponse();
  }

  try {
    return NextResponse.json({ stats: await loadWorldCupCalendarUsageStats() });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load World Cup calendar usage stats.',
      },
      { status: 500 },
    );
  }
}
