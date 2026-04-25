import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAssignments, getSubmissions } from '@/lib/db';
import { AnalyticsData } from '@/types';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = session.user as any;
    if (user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const assignments = await getAssignments();
    const submissions = await getSubmissions();

    const accepted = submissions.filter((s) => s.status === 'accepted').length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const needsImprovement = submissions.filter((s) => s.status === 'needs_improvement').length;

    const difficultyMap: Record<string, { submissions: number; accepted: number }> = {
      beginner: { submissions: 0, accepted: 0 },
      intermediate: { submissions: 0, accepted: 0 },
      advanced: { submissions: 0, accepted: 0 },
    };

    submissions.forEach((sub) => {
      const assignment = assignments.find((a) => a.id === sub.assignmentId);
      if (assignment) {
        difficultyMap[assignment.difficulty].submissions++;
        if (sub.status === 'accepted') difficultyMap[assignment.difficulty].accepted++;
      }
    });

    const assignmentPerformance = assignments.map((asgn) => {
      const subs = submissions.filter((s) => s.assignmentId === asgn.id);
      const total = subs.length;
      const acc = subs.filter((s) => s.status === 'accepted').length;
      const pend = subs.filter((s) => s.status === 'pending').length;
      const ni = subs.filter((s) => s.status === 'needs_improvement').length;
      return {
        title: asgn.title.length > 25 ? asgn.title.substring(0, 22) + '...' : asgn.title,
        total,
        accepted: acc,
        pending: pend,
        needs_improvement: ni,
        acceptanceRate: total > 0 ? Math.round((acc / total) * 100) : 0,
      };
    });

    const analytics: AnalyticsData = {
      totalAssignments: assignments.length,
      totalSubmissions: submissions.length,
      statusBreakdown: [
        { name: 'Accepted', value: accepted, color: '#06D6A0' },
        { name: 'Pending', value: pending, color: '#FFD23F' },
        { name: 'Needs Improvement', value: needsImprovement, color: '#EF476F' },
      ],
      difficultyBreakdown: [
        { name: 'Beginner', ...difficultyMap.beginner },
        { name: 'Intermediate', ...difficultyMap.intermediate },
        { name: 'Advanced', ...difficultyMap.advanced },
      ],
      assignmentPerformance,
    };

    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}