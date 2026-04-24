'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/login'); return; }
    if ((session.user as any)?.role !== 'instructor') {
      router.push('/student/assignments');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div style={{ width: '40px', height: '40px', border: '2px solid #4d70ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'instructor') return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="grid-bg">
      <Navbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  );
}
