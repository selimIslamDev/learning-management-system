'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/login'); return; }
    if ((session.user as any)?.role !== 'student') {
      router.push('/instructor/assignments');
    }
  }, [session, status, router]);

  // Loading State with Smooth Spinner
  if (status === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', background: '#0a0a0f', display: 'flex', 
        alignItems: 'center', justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '45px', height: '45px', border: '3px solid rgba(77,112,255,0.1)', 
            borderTopColor: '#4d70ff', borderRadius: '50%', 
            animation: 'spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite' 
          }} />
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '16px', fontWeight: 500, letterSpacing: '0.5px' }}>
            Preparing your dashboard...
          </p>
        </div>
        <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'student') return null;

  return (
    <div style={{ 
      minHeight: '100vh', background: '#0a0a0f', 
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #0a0a0f 80%)',
      color: '#fff'
    }}>
      <Navbar />
      
      <main style={{ 
        maxWidth: '1280px', margin: '0 auto', 
        padding: 'clamp(20px, 5vw, 40px) 20px', // Mobile friendly padding
        animation: 'fadeIn 0.6s ease-out'
      }}>
        {children}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Global scrollbar styling for a premium feel */
        :global(::-webkit-scrollbar) {
          width: 8px;
        }
        :global(::-webkit-scrollbar-track) {
          background: #0a0a0f;
        }
        :global(::-webkit-scrollbar-thumb) {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        :global(::-webkit-scrollbar-thumb:hover) {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}












// 'use client';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import Navbar from '@/components/Navbar';

// export default function StudentLayout({ children }: { children: React.ReactNode }) {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) { router.push('/login'); return; }
//     if ((session.user as any)?.role !== 'student') {
//       router.push('/instructor/assignments');
//     }
//   }, [session, status, router]);

//   if (status === 'loading') {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{ width: '40px', height: '40px', border: '2px solid #4d70ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//       </div>
//     );
//   }

//   if (!session || (session.user as any)?.role !== 'student') return null;

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="grid-bg">
//       <Navbar />
//       <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
//         {children}
//       </main>
//     </div>
//   );
// }
