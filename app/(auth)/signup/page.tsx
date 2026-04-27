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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(77,112,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', left: '-200px', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(123,47,190,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0
            }}>🎓</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              EduTrack
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Join EduTrack today</p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
            Create Account
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              color: '#EF476F', fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                className="input-field"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                required
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                required
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 characters"
                minLength={6}
                required
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="form-label">Role</label>
              <select
                className="input-field"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ fontSize: '16px' }}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '4px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#4d70ff', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Programming Hero © 2024 · EduTrack Platform
        </p>
      </div>
    </div>
  );
}