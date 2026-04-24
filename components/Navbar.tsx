'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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
      background: 'rgba(18, 18, 26, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>🎓</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
            EduTrack
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px',
                color: active ? '#4d70ff' : 'var(--text-secondary)',
                background: active ? 'rgba(77,112,255,0.1)' : 'transparent',
                transition: 'all 0.15s ease',
              }}>
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {isInstructor ? '👨‍🏫 Instructor' : '👨‍🎓 Student'}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
