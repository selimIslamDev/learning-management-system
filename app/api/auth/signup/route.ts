import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('edutrack');

    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}