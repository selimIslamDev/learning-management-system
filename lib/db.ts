import fs from 'fs';
import path from 'path';
import { User, Assignment, Submission } from '@/types';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readFile<T>(filename: string, defaultData: T): T {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return defaultData;
  }
}

function writeFile<T>(filename: string, data: T): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Seed default users
async function seedUsers() {
  const users = readFile<User[]>('users.json', []);
  if (users.length === 0) {
    const hashedPw1 = await bcrypt.hash('instructor123', 10);
    const hashedPw2 = await bcrypt.hash('student123', 10);
    const defaultUsers: User[] = [
      {
        id: 'usr_instructor_1',
        name: 'Jhankar Mahbub',
        email: 'instructor@ph.com',
        password: hashedPw1,
        role: 'instructor',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_student_1',
        name: 'Rakib Hasan',
        email: 'student@ph.com',
        password: hashedPw2,
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_student_2',
        name: 'Nusrat Jahan',
        email: 'nusrat@ph.com',
        password: hashedPw2,
        role: 'student',
        createdAt: new Date().toISOString(),
      },
    ];
    writeFile('users.json', defaultUsers);
    return defaultUsers;
  }
  return users;
}

// Users
export async function getUsers(): Promise<User[]> {
  return seedUsers();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

// Assignments
export function getAssignments(): Assignment[] {
  const sample: Assignment[] = [
    {
      id: 'asgn_1',
      title: 'Build a Todo App with React',
      description: 'Create a fully functional Todo application using React hooks. Include features like add, delete, mark complete, and filter by status. Style it with Tailwind CSS.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      difficulty: 'beginner',
      instructorId: 'usr_instructor_1',
      instructorName: 'Jhankar Mahbub',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'asgn_2',
      title: 'REST API with Express & MongoDB',
      description: 'Build a complete RESTful API for a blog platform. Implement CRUD operations for posts and comments. Include authentication using JWT tokens and proper error handling.',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      difficulty: 'intermediate',
      instructorId: 'usr_instructor_1',
      instructorName: 'Jhankar Mahbub',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'asgn_3',
      title: 'Full-Stack E-Commerce Platform',
      description: 'Develop a complete e-commerce application with Next.js, Stripe payments, inventory management, admin dashboard, and real-time order tracking.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      difficulty: 'advanced',
      instructorId: 'usr_instructor_1',
      instructorName: 'Jhankar Mahbub',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  return readFile<Assignment[]>('assignments.json', sample);
}

export function saveAssignments(assignments: Assignment[]): void {
  writeFile('assignments.json', assignments);
}

export function getAssignmentById(id: string): Assignment | null {
  return getAssignments().find((a) => a.id === id) || null;
}

export function createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Assignment {
  const assignments = getAssignments();
  const newAssignment: Assignment = {
    ...data,
    id: `asgn_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  assignments.push(newAssignment);
  saveAssignments(assignments);
  return newAssignment;
}

// Submissions
export function getSubmissions(): Submission[] {
  const sample: Submission[] = [
    {
      id: 'sub_1',
      assignmentId: 'asgn_1',
      assignmentTitle: 'Build a Todo App with React',
      studentId: 'usr_student_1',
      studentName: 'Rakib Hasan',
      studentEmail: 'student@ph.com',
      submissionUrl: 'https://github.com/rakib/todo-app',
      note: 'I implemented all the required features. Added drag and drop as a bonus feature.',
      status: 'accepted',
      feedback: 'Excellent work! The drag and drop feature shows great initiative.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub_2',
      assignmentId: 'asgn_2',
      assignmentTitle: 'REST API with Express & MongoDB',
      studentId: 'usr_student_1',
      studentName: 'Rakib Hasan',
      studentEmail: 'student@ph.com',
      submissionUrl: 'https://github.com/rakib/blog-api',
      note: 'Completed CRUD for posts. Had some trouble with JWT refresh tokens.',
      status: 'needs_improvement',
      feedback: 'Good foundation but JWT implementation needs work. Please review refresh token logic.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sub_3',
      assignmentId: 'asgn_1',
      assignmentTitle: 'Build a Todo App with React',
      studentId: 'usr_student_2',
      studentName: 'Nusrat Jahan',
      studentEmail: 'nusrat@ph.com',
      submissionUrl: 'https://github.com/nusrat/todo-react',
      note: 'Completed all features. Used Context API for state management.',
      status: 'pending',
      feedback: '',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ];
  return readFile<Submission[]>('submissions.json', sample);
}

export function saveSubmissions(submissions: Submission[]): void {
  writeFile('submissions.json', submissions);
}

export function getSubmissionById(id: string): Submission | null {
  return getSubmissions().find((s) => s.id === id) || null;
}

export function getSubmissionsByStudent(studentId: string): Submission[] {
  return getSubmissions().filter((s) => s.studentId === studentId);
}

export function getSubmissionsByAssignment(assignmentId: string): Submission[] {
  return getSubmissions().filter((s) => s.assignmentId === assignmentId);
}

export function createSubmission(data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedback'>): Submission {
  const submissions = getSubmissions();
  const existing = submissions.find(
    (s) => s.assignmentId === data.assignmentId && s.studentId === data.studentId
  );
  if (existing) throw new Error('Already submitted');

  const newSubmission: Submission = {
    ...data,
    id: `sub_${Date.now()}`,
    status: 'pending',
    feedback: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  saveSubmissions(submissions);
  return newSubmission;
}

export function updateSubmission(id: string, updates: Partial<Submission>): Submission | null {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  submissions[idx] = { ...submissions[idx], ...updates, updatedAt: new Date().toISOString() };
  saveSubmissions(submissions);
  return submissions[idx];
}
