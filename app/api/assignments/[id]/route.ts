import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAssignmentById } from '@/lib/db';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assignment = await getAssignmentById(id);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }
    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db('edutrack');
    await db.collection('assignments').updateOne(
      { id },
      { $set: { ...body, updatedAt: new Date().toISOString() } }
    );

    const updated = await db.collection('assignments').findOne({ id });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('edutrack');
    await db.collection('assignments').deleteOne({ id });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}