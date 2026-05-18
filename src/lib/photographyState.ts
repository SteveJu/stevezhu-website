import { requestSupabase } from './supabaseAdmin';

export const photographyStateId = 'default';

export type PhotoRecord = {
  id: string;
  albumId: string;
  title: string;
  caption: string;
  url: string;
  storageKey: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
};

export type PhotoAlbumRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
};

export type PhotographyPayload = {
  albums: PhotoAlbumRecord[];
  photos: PhotoRecord[];
};

type PhotographyStateRow = {
  payload: unknown;
};

export const emptyPhotographyPayload: PhotographyPayload = {
  albums: [],
  photos: [],
};

export const isPhotographyPayload = (payload: unknown): payload is PhotographyPayload => {
  if (!payload || typeof payload !== 'object') return false;

  const candidate = payload as Partial<PhotographyPayload>;
  return Array.isArray(candidate.albums) && Array.isArray(candidate.photos);
};

export const loadPhotographyPayload = async () => {
  const rows = await requestSupabase<PhotographyStateRow[]>(
    `/photography_state?id=eq.${photographyStateId}&select=payload`,
  );
  const payload = rows[0]?.payload;

  return isPhotographyPayload(payload) ? payload : emptyPhotographyPayload;
};

export const savePhotographyPayload = async (payload: PhotographyPayload) => {
  await requestSupabase('/photography_state?on_conflict=id', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: {
      id: photographyStateId,
      payload,
    },
  });
};
