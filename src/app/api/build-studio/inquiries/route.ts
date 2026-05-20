import { NextResponse } from 'next/server';
import { requireOwner } from '@/lib/ownerApi';
import {
  createBuildStudioInquiry,
  loadBuildStudioInquiries,
  parseBuildStudioInquiryInput,
  parseBuildStudioInquiryUpdate,
  updateBuildStudioInquiry,
} from '@/lib/buildStudioInquiries';

export async function GET() {
  const unauthorizedResponse = await requireOwner();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    return NextResponse.json({ inquiries: await loadBuildStudioInquiries() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load inquiries.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { inquiry?: unknown } | null;
  const inquiry = parseBuildStudioInquiryInput(body?.inquiry);

  if (!inquiry) {
    return NextResponse.json({ error: 'Invalid inquiry.' }, { status: 400 });
  }

  try {
    return NextResponse.json({ inquiry: await createBuildStudioInquiry(inquiry) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit inquiry.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const unauthorizedResponse = await requireOwner();
  if (unauthorizedResponse) return unauthorizedResponse;

  const body = (await request.json().catch(() => null)) as { id?: string; update?: unknown } | null;
  const update = parseBuildStudioInquiryUpdate(body?.update);

  if (!body?.id || !update) {
    return NextResponse.json({ error: 'Invalid inquiry update.' }, { status: 400 });
  }

  try {
    const inquiry = await updateBuildStudioInquiry(body.id, update);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update inquiry.' },
      { status: 500 },
    );
  }
}
