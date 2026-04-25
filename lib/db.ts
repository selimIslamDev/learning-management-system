import clientPromise from '@/lib/mongodb';
import { User, Assignment, Submission } from '@/types';
import bcrypt from 'bcryptjs';

async function getDb() {
  const client = await clientPromise;
  return client.db('edutrack');
}

async function seedUsers() {
  const db = await getDb();
  const count = await db.collection('users').countDocuments();
  if (count === 0) {
    const hashedPw1 = await bcrypt.hash('instructor123', 10);
    const hashedPw2 = await bcrypt.hash('student123', 10);
    const defaultUsers = [
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
    await db.collection('users').insertMany(defaultUsers);
  }
}

export async function getUsers(): Promise<User[]> {
  await seedUsers();
  const db = await getDb();
  const users = await db.collection('users').find({}).toArray();
  return users as unknown as User[];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await seedUsers();
  const db = await getDb();
  const user = await db.collection('users').findOne({ email });
  return user as unknown as User | null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection('users').findOne({ id });
  return user as unknown as User | null;
}

export async function getAssignments(): Promise<Assignment[]> {
  const db = await getDb();
  const count = await db.collection('assignments').countDocuments();
  if (count === 0) {
    const sample = [
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
    await db.collection('assignments').insertMany(sample);
  }
  const assignments = await db.collection('assignments').find({}).toArray();
  return assignments as unknown as Assignment[];
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  const db = await getDb();
  const assignment = await db.collection('assignments').findOne({ id });
  return assignment as unknown as Assignment | null;
}

export async function createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
  const db = await getDb();
  const newAssignment: Assignment = {
    ...data,
    id: `asgn_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  await db.collection('assignments').insertOne({ ...newAssignment });
  return newAssignment;
}

export async function getSubmissions(): Promise<Submission[]> {
  const db = await getDb();
  const count = await db.collection('submissions').countDocuments();
  if (count === 0) {
    const sample = [
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
    await db.collection('submissions').insertMany(sample);
  }
  const submissions = await db.collection('submissions').find({}).toArray();
  return submissions as unknown as Submission[];
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const db = await getDb();
  const submission = await db.collection('submissions').findOne({ id });
  return submission as unknown as Submission | null;
}

export async function getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
  const db = await getDb();
  const submissions = await db.collection('submissions').find({ studentId }).toArray();
  return submissions as unknown as Submission[];
}

export async function getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
  const db = await getDb();
  const submissions = await db.collection('submissions').find({ assignmentId }).toArray();
  return submissions as unknown as Submission[];
}

export async function createSubmission(data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedback'>): Promise<Submission> {
  const db = await getDb();
  const existing = await db.collection('submissions').findOne({
    assignmentId: data.assignmentId,
    studentId: data.studentId,
  });
  if (existing) throw new Error('Already submitted');

  const newSubmission: Submission = {
    ...data,
    id: `sub_${Date.now()}`,
    status: 'pending',
    feedback: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('submissions').insertOne({ ...newSubmission });
  return newSubmission;
}

export async function updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission | null> {
  const db = await getDb();
  const result = await db.collection('submissions').findOneAndUpdate(
    { id },
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );
  return result as unknown as Submission | null;
}