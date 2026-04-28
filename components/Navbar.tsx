'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = session?.user as any;

  const isInstructor = user?.role === 'instructor';

  const navLinks = isInstructor
    ? [
        { href: '/instructor/assignments', label: 'Assignments', icon: '📋' },
        { href: '/instructor/submissions', label: 'Submissions', icon: '📬' },
        { href: '/instructor/analytics', label: 'Analytics', icon: '📊' },
      ]
    : [
        { href: '/student/assignments', label: 'Assignments', icon: '📋' },
        { href: '/student/submissions', label: 'My Submissions', icon: '📬' },
      ];

  return (
    <nav style={{
      background: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 1000,
    }}>
      <div style={{ 
        maxWidth: '1280px', margin: '0 auto', padding: '0 20px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' 
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            boxShadow: '0 8px 16px rgba(77,112,255,0.3)'
          }}>🎓</div>
          <span style={{ fontWeight: 850, fontSize: '20px', color: '#fff', letterSpacing: '-0.5px' }}>
            EduTrack
          </span>
        </Link>

        {/* Desktop Links - Hidden on Mobile */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} style={{
                textDecoration: 'none', padding: '10px 18px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
                color: active ? '#fff' : '#94a3b8',
                background: active ? 'rgba(77,112,255,0.15)' : 'transparent',
                border: active ? '1px solid rgba(77,112,255,0.2)' : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}>
                <span style={{ fontSize: '16px' }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }} className="user-profile-nav">
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>{user?.name?.split(' ')[0]}</p>
            <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
              {isInstructor ? 'Instructor' : 'Student'}
            </p>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ 
              background: 'rgba(239,71,111,0.1)', color: '#EF476F', border: '1px solid rgba(239,71,111,0.2)',
              padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            Sign Out
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', fontSize: '24px', color: '#fff', cursor: 'pointer', display: 'none' }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, right: 0, 
          background: '#0f172a', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} style={{
              textDecoration: 'none', color: '#fff', padding: '15px', borderRadius: '12px',
              background: pathname.startsWith(link.href) ? 'rgba(77,112,255,0.1)' : 'transparent'
            }}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav, .user-profile-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}















// 'use client';
// import { useSession, signOut } from 'next-auth/react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';

// export default function Navbar() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();
//   const user = session?.user as any;

//   const isInstructor = user?.role === 'instructor';

//   const navLinks = isInstructor
//     ? [
//         { href: '/instructor/assignments', label: 'Assignments', icon: '📋' },
//         { href: '/instructor/submissions', label: 'Submissions', icon: '📬' },
//         { href: '/instructor/analytics', label: 'Analytics', icon: '📊' },
//       ]
//     : [
//         { href: '/student/assignments', label: 'Assignments', icon: '📋' },
//         { href: '/student/submissions', label: 'My Submissions', icon: '📬' },
//       ];

//   return (
//     <nav style={{
//       background: 'rgba(18, 18, 26, 0.95)',
//       backdropFilter: 'blur(16px)',
//       borderBottom: '1px solid rgba(255,255,255,0.06)',
//       position: 'sticky', top: 0, zIndex: 100,
//     }}>
//       <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
//         {/* Logo */}
//         <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <div style={{
//             width: '36px', height: '36px', borderRadius: '10px',
//             background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
//           }}>🎓</div>
//           <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
//             EduTrack
//           </span>
//         </Link>

//         {/* Nav links */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//           {navLinks.map((link) => {
//             const active = pathname.startsWith(link.href);
//             return (
//               <Link key={link.href} href={link.href} style={{
//                 textDecoration: 'none',
//                 padding: '8px 16px',
//                 borderRadius: '8px',
//                 fontSize: '14px',
//                 fontWeight: 500,
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 color: active ? '#4d70ff' : 'var(--text-secondary)',
//                 background: active ? 'rgba(77,112,255,0.1)' : 'transparent',
//                 transition: 'all 0.15s ease',
//               }}>
//                 <span>{link.icon}</span>
//                 {link.label}
//               </Link>
//             );
//           })}
//         </div>

//         {/* User info */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div style={{ textAlign: 'right' }}>
//             <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
//             <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
//               {isInstructor ? '👨‍🏫 Instructor' : '👨‍🎓 Student'}
//             </p>
//           </div>
//           <button
//             onClick={() => signOut({ callbackUrl: '/login' })}
//             className="btn-secondary"
//             style={{ padding: '8px 16px', fontSize: '13px' }}
//           >
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
