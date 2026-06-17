import { NextResponse } from 'next/server';
import { requireOwner } from '@/lib/ownerApi';
import { loadWorldCupCalendarUsageStats } from '@/lib/worldCupCalendarUsage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  const unauthorizedResponse = await requireOwner();
  if (unauthorizedResponse) return unauthorizedResponse;

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
