import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubmissions, createSubmission } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    const submissions = await getSubmissions();

    if (user.role === 'student') {
      return NextResponse.json(submissions.filter((s) => s.studentId === user.id));
    }

    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { assignmentId, assignmentTitle, submissionUrl, note } = body;

    if (!assignmentId || !submissionUrl || !note) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const submission = await createSubmission({
      assignmentId,
      assignmentTitle,
      studentId: user.id,
      studentName: user.name || 'Student',
      studentEmail: user.email || '',
      submissionUrl,
      note,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Already submitted') {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}