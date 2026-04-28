'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const result = await signIn('credentials', { email, password, redirect: false });
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#0f172a', // Deep dark background for 3D contrast
      perspective: '1000px', // 3D depth perspective
      overflow: 'hidden',
    }}>
      {/* Background 3D Blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px',
        background: 'linear-gradient(135deg, #4d70ff 0%, #7B2FBE 100%)',
        filter: 'blur(80px)', borderRadius: '50%', opacity: 0.2,
      }} />

      <div style={{ 
        width: '100%', 
        maxWidth: '440px',
        transform: 'rotateX(2deg)', // Subtle 3D tilt
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '10px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: '0 0 20px rgba(77,112,255,0.4)'
            }}>🎓</div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
              EduTrack
            </h1>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px) saturate(180%)',
          WebkitBackdropFilter: 'blur(15px) saturate(180%)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#fff' }}>Sign In</h2>

          {error && (
            <div style={{
              background: 'rgba(239,71,111,0.15)', borderLeft: '4px solid #EF476F',
              borderRadius: '8px', padding: '12px', marginBottom: '20px',
              color: '#ff7a98', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '6px', fontWeight: 500 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ 
                  width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '6px', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ 
                  width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', outline: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: '10px', padding: '14px', fontSize: '16px', fontWeight: 600,
                borderRadius: '12px', cursor: 'pointer', border: 'none',
                background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', color: '#fff',
                boxShadow: '0 10px 20px -5px rgba(77,112,255,0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '28px' }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
              One-Click Demo
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => fillCredentials('instructor')} 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px', borderRadius: '12px', color: '#fff', cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>👨‍🏫 Instructor</span>
              </button>
              <button 
                onClick={() => fillCredentials('student')} 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px', borderRadius: '12px', color: '#fff', cursor: 'pointer'
                }}
              >
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>👨‍🎓 Student</span>
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
            New here? <Link href="/signup" style={{ color: '#4d70ff', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}






// 'use client';
// import { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     const result = await signIn('credentials', { email, password, redirect: false });
//     if (result?.error) {
//       setError('Invalid email or password');
//       setLoading(false);
//     } else {
//       router.push('/');
//     }
//   };

//   const fillCredentials = (role: 'instructor' | 'student') => {
//     if (role === 'instructor') {
//       setEmail('instructor@ph.com');
//       setPassword('instructor123');
//     } else {
//       setEmail('student@ph.com');
//       setPassword('student123');
//     }
//   };

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
//           <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
//             Assignment & Learning Analytics Platform
//           </p>
//         </div>

//         <div className="glass-card" style={{ padding: '24px' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
//             Sign In
//           </h2>

//           {error && (
//             <div style={{
//               background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)',
//               borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
//               color: '#EF476F', fontSize: '13px'
//             }}>
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
//             <div>
//               <label className="form-label">Email Address</label>
//               <input
//                 type="email"
//                 className="input-field"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
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
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 required
//                 style={{ fontSize: '16px' }}
//               />
//             </div>

//             <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px', padding: '13px', fontSize: '15px' }}>
//               {loading ? (
//                 <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                   <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
//                   Signing in...
//                 </span>
//               ) : 'Sign In'}
//             </button>
//           </form>

//           <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
//             <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
//               Demo Accounts
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//               <button onClick={() => fillCredentials('instructor')} className="btn-secondary" style={{ fontSize: '12px', padding: '10px 8px' }}>
//                 <span style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>👨‍🏫 Instructor</span>
//                 <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>instructor@ph.com</span>
//               </button>
//               <button onClick={() => fillCredentials('student')} className="btn-secondary" style={{ fontSize: '12px', padding: '10px 8px' }}>
//                 <span style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>👨‍🎓 Student</span>
//                 <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>student@ph.com</span>
//               </button>
//             </div>
//           </div>

//           <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
//             Don't have an account?{' '}
//             <Link href="/signup" style={{ color: '#4d70ff', fontWeight: 600 }}>Sign Up</Link>
//           </p>
//         </div>

//         <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
//           Programming Hero © 2024 · EduTrack Platform
//         </p>
//       </div>
//     </div>
//   );
// }