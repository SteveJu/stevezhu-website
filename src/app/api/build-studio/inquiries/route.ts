import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import {
  createBuildStudioInquiry,
  loadBuildStudioInquiries,
  parseBuildStudioInquiryInput,
} from '@/lib/buildStudioInquiries';

export async function GET() {
  if (!(await isOwnerUnlocked())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

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
  if (!(await isOwnerUnlocked())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

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
