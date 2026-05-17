import { requestSupabase } from './supabaseAdmin';

export const plannerStateId = 'default';

export type SharedTravelRecord = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  summary: string;
  companions: string[];
  shareCode?: string;
};

export type SharedJellyCard = {
  id: string;
  moduleId: 'flight' | 'car' | 'hotel' | 'restaurant' | 'activity';
};

export type TravelPlannerPayload = {
  travels: SharedTravelRecord[];
  timelineCards: Record<string, SharedJellyCard[]>;
  formValues: Record<string, Record<string, Record<string, string>>>;
  knownCompanions: string[];
};

type PlannerStateRow = {
  payload: unknown;
};

export const emptyPlannerPayload: TravelPlannerPayload = {
  travels: [],
  timelineCards: {},
  formValues: {},
  knownCompanions: [],
};

export const isTravelPlannerPayload = (payload: unknown): payload is TravelPlannerPayload => {
  if (!payload || typeof payload !== 'object') return false;

  const candidate = payload as Partial<TravelPlannerPayload>;
  return (
    Array.isArray(candidate.travels) &&
    candidate.timelineCards !== null &&
    typeof candidate.timelineCards === 'object' &&
    candidate.formValues !== null &&
    typeof candidate.formValues === 'object' &&
    Array.isArray(candidate.knownCompanions)
  );
};

export const loadTravelPlannerPayload = async () => {
  const rows = await requestSupabase<PlannerStateRow[]>(
    `/travel_planner_state?id=eq.${plannerStateId}&select=payload`,
  );
  const payload = rows[0]?.payload;

  return isTravelPlannerPayload(payload) ? payload : emptyPlannerPayload;
};

export const saveTravelPlannerPayload = async (payload: TravelPlannerPayload) => {
  await requestSupabase('/travel_planner_state?on_conflict=id', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: {
      id: plannerStateId,
      payload,
    },
  });
};
