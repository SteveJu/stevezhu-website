import { createHash } from 'node:crypto';
import { requestSupabase } from './supabaseAdmin';

type UsageRow = {
  last_seen_at: string;
  request_count: number;
};

export type WorldCupCalendarUsageStats = {
  active24h: number;
  active7d: number;
  active30d: number;
  estimatedSubscribers: number;
  totalRequests: number;
  generatedAt: string;
};

const ignoredUserAgentPatterns = [
  /bot/i,
  /crawler/i,
  /curl/i,
  /github/i,
  /monitor/i,
  /python-requests/i,
  /spider/i,
  /uptime/i,
  /wget/i,
];

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() ?? '';

  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-vercel-forwarded-for') ??
    ''
  );
};

const getUserAgentFamily = (userAgent: string) => {
  if (/CalendarAgent|dataaccessd|iCal|Apple/i.test(userAgent)) return 'Apple Calendar';
  if (/Google-Calendar|Google Calendar/i.test(userAgent)) return 'Google Calendar';
  if (/Outlook|Microsoft Office|Microsoft-WebDAV/i.test(userAgent)) return 'Outlook';
  if (/Thunderbird/i.test(userAgent)) return 'Thunderbird';
  if (/Chrome|Safari|Firefox|Edg/i.test(userAgent)) return 'Browser';

  return userAgent ? 'Other' : 'Unknown';
};

const getAnalyticsSalt = () =>
  process.env.CALENDAR_ANALYTICS_SALT ??
  process.env.OWNER_PASSCODE ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  '';

const makeSubscriberHash = (request: Request) => {
  const salt = getAnalyticsSalt();
  if (!salt) return '';

  const pieces = [
    getClientIp(request),
    request.headers.get('user-agent') ?? '',
    request.headers.get('accept-language') ?? '',
  ];

  return createHash('sha256').update(`${pieces.join('\n')}\n${salt}`).digest('hex');
};

const isIgnoredUserAgent = (userAgent: string) =>
  ignoredUserAgentPatterns.some((pattern) => pattern.test(userAgent));

export const recordWorldCupCalendarUsage = async (request: Request) => {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (isIgnoredUserAgent(userAgent)) return;

  const subscriberHash = makeSubscriberHash(request);
  if (!subscriberHash) return;

  try {
    await requestSupabase<null>('/rpc/record_world_cup_calendar_usage', {
      method: 'POST',
      body: {
        p_subscriber_hash: subscriberHash,
        p_user_agent_family: getUserAgentFamily(userAgent),
        p_path: new URL(request.url).pathname,
      },
    });
  } catch (error) {
    console.warn(
      error instanceof Error ? `Calendar usage logging failed: ${error.message}` : 'Calendar usage logging failed.',
    );
  }
};

export const loadWorldCupCalendarUsageStats = async (): Promise<WorldCupCalendarUsageStats> => {
  const rows = await requestSupabase<UsageRow[]>(
    '/world_cup_calendar_usage?select=last_seen_at,request_count&order=last_seen_at.desc&limit=10000',
  );
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const seenAfter = (timestamp: string, cutoff: number) => new Date(timestamp).getTime() >= cutoff;

  return {
    active24h: rows.filter((row) => seenAfter(row.last_seen_at, oneDayAgo)).length,
    active7d: rows.filter((row) => seenAfter(row.last_seen_at, sevenDaysAgo)).length,
    active30d: rows.filter((row) => seenAfter(row.last_seen_at, thirtyDaysAgo)).length,
    estimatedSubscribers: rows.length,
    totalRequests: rows.reduce((total, row) => total + row.request_count, 0),
    generatedAt: new Date(now).toISOString(),
  };
};
