export type Role = 'instructor' | 'student';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SubmissionStatus = 'pending' | 'accepted' | 'needs_improvement';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: DifficultyLevel;
  instructorId: string;
  instructorName: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionUrl: string;
  note: string;
  status: SubmissionStatus;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totalAssignments: number;
  totalSubmissions: number;
  statusBreakdown: { name: string; value: number; color: string }[];
  difficultyBreakdown: { name: string; submissions: number; accepted: number }[];
  assignmentPerformance: {
    title: string;
    total: number;
    accepted: number;
    pending: number;
    needs_improvement: number;
    acceptanceRate: number;
  }[];
}
