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
  updated_at: string;
};

export class TravelPlannerConflictError extends Error {
  constructor() {
    super('Travel planner state was updated by another client.');
    this.name = 'TravelPlannerConflictError';
  }
}

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

export const loadTravelPlannerState = async () => {
  const rows = await requestSupabase<PlannerStateRow[]>(
    `/travel_planner_state?id=eq.${plannerStateId}&select=payload,updated_at`,
  );
  const payload = rows[0]?.payload;

  return {
    payload: isTravelPlannerPayload(payload) ? payload : emptyPlannerPayload,
    updatedAt: rows[0]?.updated_at ?? null,
  };
};

export const loadTravelPlannerPayload = async () => {
  return (await loadTravelPlannerState()).payload;
};

export const saveTravelPlannerPayload = async (payload: TravelPlannerPayload, expectedUpdatedAt?: string | null) => {
  if (expectedUpdatedAt) {
    const rows = await requestSupabase<Array<{ updated_at: string }>>(
      `/travel_planner_state?id=eq.${plannerStateId}&updated_at=eq.${encodeURIComponent(expectedUpdatedAt)}&select=updated_at`,
      {
        method: 'PATCH',
        headers: {
          Prefer: 'return=representation',
        },
        body: {
          payload,
        },
      },
    );

    if (rows.length === 0) {
      throw new TravelPlannerConflictError();
    }

    return rows[0]?.updated_at ?? null;
  }

  const rows = await requestSupabase<Array<{ updated_at: string }>>('/travel_planner_state?on_conflict=id&select=updated_at', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: {
      id: plannerStateId,
      payload,
    },
  });

  return rows[0]?.updated_at ?? null;
};
