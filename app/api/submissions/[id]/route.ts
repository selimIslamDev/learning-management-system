import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubmissionById, updateSubmission } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const submission = await getSubmissionById(id);
    if (!submission) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status, feedback } = body;

    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

    const updated = await updateSubmission(id, { status, feedback });
    if (!updated) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}