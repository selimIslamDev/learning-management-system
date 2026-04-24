'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    } else {
      const role = (session.user as any)?.role;
      if (role === 'instructor') router.push('/instructor/assignments');
      else router.push('/student/assignments');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>Loading EduTrack...</p>
      </div>
    </div>
  );
}
