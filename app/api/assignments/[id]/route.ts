import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAssignments, saveAssignments, getAssignmentById } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const assignments = getAssignments();
    const idx = assignments.findIndex((a) => a.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    assignments[idx] = { ...assignments[idx], ...body };
    saveAssignments(assignments);
    return NextResponse.json(assignments[idx]);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'instructor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const assignments = getAssignments();
    const filtered = assignments.filter((a) => a.id !== params.id);
    saveAssignments(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
