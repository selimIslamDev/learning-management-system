import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateSubmission } from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'instructor') {
      return NextResponse.json({ error: 'Only instructors can review submissions' }, { status: 403 });
    }

    const body = await request.json();
    const { status, feedback } = body;

    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

    const updated = updateSubmission(params.id, { status, feedback });
    if (!updated) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
