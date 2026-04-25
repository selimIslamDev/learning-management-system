'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/login?registered=true');
    } else {
      setError(data.error || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Join EduTrack today</p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#EF476F', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="input-field" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" minLength={6} required />
            </div>
            <div>
              <label className="form-label">Role</label>
              <select className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#4d70ff', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}