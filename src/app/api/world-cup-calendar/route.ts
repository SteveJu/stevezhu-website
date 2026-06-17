import { NextResponse } from 'next/server';
import { getWorldCupCalendar } from '@/lib/worldCupCalendar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const calendarHeaders = {
  'Content-Type': 'text/calendar; charset=utf-8',
  'Content-Disposition': 'inline; filename="world-cup-2026.ics"',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Access-Control-Allow-Origin': '*',
};

export async function HEAD() {
  return new NextResponse(null, { headers: calendarHeaders });
}

export async function GET() {
  try {
    return new NextResponse(await getWorldCupCalendar(), {
      headers: calendarHeaders,
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? `Failed to generate calendar: ${error.message}\n` : 'Failed to generate calendar.\n',
      {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  }
}
