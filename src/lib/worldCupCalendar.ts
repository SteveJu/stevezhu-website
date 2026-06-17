const ESPN_SCOREBOARD_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

const DEFAULT_DATES = '20260611-20260719';
const DEFAULT_LIMIT = 200;
const DEFAULT_CALENDAR_NAME = 'FIFA World Cup 2026';
const DEFAULT_TIMEZONE = 'America/New_York';
const DEFAULT_REFRESH_SECONDS = 300;
const PRODUCT_ID = '-//Steve Zhu//FIFA World Cup 2026 Calendar//EN';

type EspnLink = {
  href?: string;
  rel?: string[];
};

type EspnTeam = {
  displayName?: string;
  shortDisplayName?: string;
};

type EspnCompetitor = {
  homeAway?: string;
  score?: string | number | null;
  team?: EspnTeam;
};

type EspnStatusType = {
  state?: string;
  shortDetail?: string;
  detail?: string;
  description?: string;
};

type EspnCompetition = {
  id?: string;
  altGameNote?: string;
  competitors?: EspnCompetitor[];
  venue?: {
    fullName?: string;
    address?: {
      city?: string;
      country?: string;
    };
  };
  broadcasts?: {
    names?: string[];
  }[];
  status?: {
    displayClock?: string;
    type?: EspnStatusType;
  };
};

type EspnEvent = {
  id?: string;
  date?: string;
  links?: EspnLink[];
  season?: {
    slug?: string;
  };
  competitions?: EspnCompetition[];
};

type EspnScoreboard = {
  events?: EspnEvent[];
};

const textEncoder = new TextEncoder();

const utcNow = () => new Date();

const parseEspnDate = (value: string) => new Date(value);

const formatIcsDate = (value: Date) =>
  value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

const escapeText = (value: string | number | null | undefined) => {
  const text = value === null || value === undefined ? '' : String(value);

  return text
    .replace(/\\/g, '\\\\')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
};

const foldIcalLine = (line: string) => {
  if (textEncoder.encode(line).length <= 75) return line;

  const folded: string[] = [];
  let current = '';
  let currentLength = 0;

  for (const char of line) {
    const charLength = textEncoder.encode(char).length;
    const limit = folded.length === 0 ? 75 : 74;

    if (current && currentLength + charLength > limit) {
      folded.push(current);
      current = ` ${char}`;
      currentLength = 1 + charLength;
    } else {
      current += char;
      currentLength += charLength;
    }
  }

  if (current) folded.push(current);
  return folded.join('\r\n');
};

const makeLine = (name: string, value: string | number | null | undefined) =>
  foldIcalLine(`${name}:${escapeText(value)}`);

const makeRawLine = (name: string, value: string | number) => foldIcalLine(`${name}:${value}`);

const findCompetitor = (competitors: EspnCompetitor[], side: 'home' | 'away') =>
  competitors.find((competitor) => competitor.homeAway === side);

const teamName = (competitor: EspnCompetitor | undefined, fallback: string) =>
  competitor?.team?.displayName ?? competitor?.team?.shortDisplayName ?? fallback;

const teamScore = (competitor: EspnCompetitor | undefined) =>
  competitor?.score === null || competitor?.score === undefined ? '' : String(competitor.score);

const getCompetition = (event: EspnEvent) => event.competitions?.[0];

const getHomeAway = (event: EspnEvent) => {
  const competitors = getCompetition(event)?.competitors ?? [];
  const home = findCompetitor(competitors, 'home') ?? competitors[0];
  const away = findCompetitor(competitors, 'away') ?? competitors[1];

  return { home, away };
};

const titleForEvent = (event: EspnEvent) => {
  const competition = getCompetition(event);
  const { home, away } = getHomeAway(event);
  const homeName = teamName(home, 'Home');
  const awayName = teamName(away, 'Away');
  const statusType = competition?.status?.type;

  if (statusType?.state === 'pre') {
    return `${homeName} vs ${awayName}`;
  }

  const score = `${teamScore(home)}-${teamScore(away)}`;
  const suffix = statusType?.shortDetail ?? statusType?.detail;

  return `${homeName} ${score} ${awayName}${suffix ? ` (${suffix})` : ''}`;
};

const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60 * 1000);

const eventDurationMinutes = (event: EspnEvent) =>
  event.season?.slug === 'group-stage' ? 135 : 180;

const venueText = (competition: EspnCompetition | undefined) => {
  const venue = competition?.venue;
  const pieces = [venue?.fullName, venue?.address?.city, venue?.address?.country];

  return pieces.filter(Boolean).join(', ');
};

const broadcastText = (competition: EspnCompetition | undefined) => {
  const names = competition?.broadcasts?.flatMap((broadcast) => broadcast.names ?? []) ?? [];

  return [...new Set(names)].join(', ');
};

const summaryLink = (event: EspnEvent) => {
  const summary = event.links?.find((link) => link.href && link.rel?.includes('summary'));
  return summary?.href ?? event.links?.find((link) => link.href)?.href ?? '';
};

const descriptionForEvent = (event: EspnEvent, generatedAt: Date) => {
  const competition = getCompetition(event);
  const { home, away } = getHomeAway(event);
  const status = competition?.status;
  const statusType = status?.type;
  const stage = competition?.altGameNote ?? event.season?.slug;
  const homeName = teamName(home, 'Home');
  const awayName = teamName(away, 'Away');
  const score = `${homeName} ${teamScore(home)}-${teamScore(away)} ${awayName}`;
  const matchup = `${homeName} vs ${awayName}`;
  const statusLabel =
    statusType?.shortDetail ?? statusType?.description ?? statusType?.detail ?? 'Scheduled';

  const lines = [
    DEFAULT_CALENDAR_NAME,
    stage ? `Stage: ${stage}` : '',
    `Status: ${statusLabel}`,
    statusType?.state === 'pre' ? `Match: ${matchup}` : `Score: ${score}`,
    statusType?.state !== 'pre' && status?.displayClock ? `Clock: ${status.displayClock}` : '',
    venueText(competition) ? `Venue: ${venueText(competition)}` : '',
    broadcastText(competition) ? `TV/stream: ${broadcastText(competition)}` : '',
    summaryLink(event) ? `ESPN: ${summaryLink(event)}` : '',
    `Generated: ${formatIcsDate(generatedAt)}`,
    'Calendar refresh timing is controlled by the subscribing calendar app.',
  ];

  return lines.filter(Boolean).join('\n');
};

const calendarHeader = () => {
  const refresh = `PT${DEFAULT_REFRESH_SECONDS}S`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODUCT_ID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    makeLine('X-WR-CALNAME', DEFAULT_CALENDAR_NAME),
    makeLine('X-WR-TIMEZONE', DEFAULT_TIMEZONE),
    `REFRESH-INTERVAL;VALUE=DURATION:${refresh}`,
    `X-PUBLISHED-TTL:${refresh}`,
  ];
};

const eventLines = (event: EspnEvent, generatedAt: Date) => {
  const competition = getCompetition(event);
  const start = event.date ? parseEspnDate(event.date) : null;

  if (!competition || !start || Number.isNaN(start.getTime())) return [];

  const end = addMinutes(start, eventDurationMinutes(event));
  const eventId = event.id ?? competition.id ?? encodeURIComponent(`${event.date}-${titleForEvent(event)}`);
  const url = summaryLink(event);
  const lines = [
    'BEGIN:VEVENT',
    makeRawLine('UID', `fifa-world-cup-2026-${eventId}@stevezhu.com`),
    makeRawLine('DTSTAMP', formatIcsDate(generatedAt)),
    makeRawLine('LAST-MODIFIED', formatIcsDate(generatedAt)),
    makeRawLine('SEQUENCE', Math.floor(generatedAt.getTime() / 1000 / DEFAULT_REFRESH_SECONDS)),
    makeRawLine('DTSTART', formatIcsDate(start)),
    makeRawLine('DTEND', formatIcsDate(end)),
    makeLine('SUMMARY', titleForEvent(event)),
    makeLine('DESCRIPTION', descriptionForEvent(event, generatedAt)),
    makeLine('LOCATION', venueText(competition)),
    makeRawLine('CATEGORIES', 'Sports,FIFA World Cup'),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
  ];

  if (url) lines.push(makeRawLine('URL', url));
  lines.push('END:VEVENT');

  return lines;
};

const buildIcs = (scoreboard: EspnScoreboard) => {
  const generatedAt = utcNow();
  const events = [...(scoreboard.events ?? [])].sort((a, b) =>
    String(a.date ?? '').localeCompare(String(b.date ?? '')),
  );
  const lines = calendarHeader();

  for (const event of events) {
    lines.push(...eventLines(event, generatedAt));
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
};

const fetchScoreboard = async () => {
  const params = new URLSearchParams({
    dates: DEFAULT_DATES,
    limit: String(DEFAULT_LIMIT),
  });
  const response = await fetch(`${ESPN_SCOREBOARD_URL}?${params}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'stevezhu-worldcup-calendar/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed with ${response.status}.`);
  }

  return (await response.json()) as EspnScoreboard;
};

export const buildWorldCupCalendar = async () => buildIcs(await fetchScoreboard());
