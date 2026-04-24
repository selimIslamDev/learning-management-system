'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  const fillCredentials = (role: 'instructor' | 'student') => {
    if (role === 'instructor') {
      setEmail('instructor@ph.com');
      setPassword('instructor123');
    } else {
      setEmail('student@ph.com');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Background decorations */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(77,112,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', left: '-200px', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(123,47,190,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px'
            }}>🎓</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
              EduTrack
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Assignment & Learning Analytics Platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#EF476F', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Demo Accounts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => fillCredentials('instructor')} className="btn-secondary" style={{ fontSize: '13px', padding: '10px' }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>👨‍🏫 Instructor</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>instructor@ph.com</span>
              </button>
              <button onClick={() => fillCredentials('student')} className="btn-secondary" style={{ fontSize: '13px', padding: '10px' }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>👨‍🎓 Student</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>student@ph.com</span>
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Programming Hero © 2024 · EduTrack Platform
        </p>
      </div>
    </div>
  );
}
