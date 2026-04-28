
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
      padding: '20px',
      background: '#0f172a',
      perspective: '1200px',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%', width: '300px', height: '300px',
        background: 'linear-gradient(135deg, #7B2FBE 0%, #4d70ff 100%)',
        filter: 'blur(80px)', borderRadius: '50%', opacity: 0.15,
      }} />

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '10px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
            }}>🎓</div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>EduTrack</h1>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          transform: 'rotateY(-2deg)' // Slight depth rotation
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#fff' }}>Join Us</h2>

          {error && (
            <div style={{ background: 'rgba(239,71,111,0.15)', color: '#ff7a98', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Full Name</label>
              <input
                className="3d-input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                minLength={6}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Select Role</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                marginTop: '10px', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
                color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
            Already have an account? <Link href="/login" style={{ color: '#4d70ff', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

















// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function SignupPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const res = await fetch('/api/auth/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       router.push('/login?registered=true');
//     } else {
//       setError(data.error || 'Something went wrong');
//     }
//     setLoading(false);
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '16px',
//       background: 'var(--bg-primary)',
//       position: 'relative',
//       overflow: 'hidden',
//     }}>
//       <div style={{
//         position: 'fixed', top: '-200px', right: '-200px', width: '400px', height: '400px',
//         background: 'radial-gradient(circle, rgba(77,112,255,0.08) 0%, transparent 70%)',
//         pointerEvents: 'none'
//       }} />
//       <div style={{
//         position: 'fixed', bottom: '-200px', left: '-200px', width: '400px', height: '400px',
//         background: 'radial-gradient(circle, rgba(123,47,190,0.08) 0%, transparent 70%)',
//         pointerEvents: 'none'
//       }} />

//       <div style={{ width: '100%', maxWidth: '420px' }}>
//         <div style={{ textAlign: 'center', marginBottom: '24px' }}>
//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
//             <div style={{
//               width: '44px', height: '44px', borderRadius: '12px',
//               background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: '22px', flexShrink: 0
//             }}>🎓</div>
//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
//               EduTrack
//             </h1>
//           </div>
//           <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Join EduTrack today</p>
//         </div>

//         <div className="glass-card" style={{ padding: '24px' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
//             Create Account
//           </h2>

//           {error && (
//             <div style={{
//               background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)',
//               borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
//               color: '#EF476F', fontSize: '13px'
//             }}>
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
//             <div>
//               <label className="form-label">Full Name</label>
//               <input
//                 className="input-field"
//                 value={form.name}
//                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//                 placeholder="Your full name"
//                 required
//                 style={{ fontSize: '16px' }}
//               />
//             </div>
//             <div>
//               <label className="form-label">Email Address</label>
//               <input
//                 type="email"
//                 className="input-field"
//                 value={form.email}
//                 onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
//                 placeholder="your@email.com"
//                 required
//                 style={{ fontSize: '16px' }}
//               />
//             </div>
//             <div>
//               <label className="form-label">Password</label>
//               <input
//                 type="password"
//                 className="input-field"
//                 value={form.password}
//                 onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
//                 placeholder="Min 6 characters"
//                 minLength={6}
//                 required
//                 style={{ fontSize: '16px' }}
//               />
//             </div>
//             <div>
//               <label className="form-label">Role</label>
//               <select
//                 className="input-field"
//                 value={form.role}
//                 onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
//                 style={{ fontSize: '16px' }}
//               >
//                 <option value="student">Student</option>
//                 <option value="instructor">Instructor</option>
//               </select>
//             </div>
//             <button
//               type="submit"
//               className="btn-primary"
//               disabled={loading}
//               style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '4px' }}
//             >
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </form>

//           <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
//             Already have an account?{' '}
//             <Link href="/login" style={{ color: '#4d70ff', fontWeight: 600 }}>Sign In</Link>
//           </p>
//         </div>

//         <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
//           Programming Hero © 2024 · EduTrack Platform
//         </p>
//       </div>
//     </div>
//   );
// }