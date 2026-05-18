import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import { createR2UploadUrl } from '@/lib/r2';

const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxPhotoBytes = 25 * 1024 * 1024;

const safeSegment = (value: string) => {
  return value.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '') || 'photo';
};

export async function POST(request: Request) {
  if (!(await isOwnerUnlocked())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    albumSlug?: string;
    fileName?: string;
    fileSize?: number;
    contentType?: string;
  } | null;

  if (!body?.albumSlug || !body.fileName || !body.contentType || !supportedImageTypes.has(body.contentType)) {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 });
  }

  if (!body.fileSize || body.fileSize > maxPhotoBytes) {
    return NextResponse.json({ error: 'Photo is too large.' }, { status: 413 });
  }

  const extension = body.contentType === 'image/png' ? 'png' : body.contentType === 'image/webp' ? 'webp' : 'jpg';
  const storageKey = `albums/${safeSegment(body.albumSlug)}/${Date.now()}-${safeSegment(body.fileName)}.${extension}`;

  try {
    return NextResponse.json(createR2UploadUrl(storageKey, body.contentType));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create upload URL.' },
      { status: 500 },
    );
  }
}
