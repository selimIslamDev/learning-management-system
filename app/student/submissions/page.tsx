
'use client';
import { useState, useEffect } from 'react';
import { Submission } from '@/types';
import Link from 'next/link';

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(data => { 
        setSubmissions(Array.isArray(data) ? data : []); 
        setLoading(false); 
      });
  }, []);

  const stats = {
    total: submissions.length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    needs_improvement: submissions.filter(s => s.status === 'needs_improvement').length,
  };

  const statusConfig: any = {
    pending: { label: 'Awaiting Review', icon: '⏳', color: '#FFD23F', bg: 'rgba(255,210,63,0.1)' },
    accepted: { label: 'Passed / Accepted', icon: '✅', color: '#06D6A0', bg: 'rgba(6,214,160,0.1)' },
    needs_improvement: { label: 'Needs Improvement', icon: '🔄', color: '#EF476F', bg: 'rgba(239,71,111,0.1)' }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Submission History</h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Detailed log of your project submissions and instructor evaluations</p>
      </div>

      {/* Responsive Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        {[
          { label: 'All Submissions', value: stats.total, color: '#4d70ff' },
          { label: 'Accepted', value: stats.accepted, color: '#06D6A0' },
          { label: 'In Review', value: stats.pending, color: '#FFD23F' },
          { label: 'Action Required', value: stats.needs_improvement, color: '#EF476F' },
        ].map((s, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '24px', borderRadius: '20px', textAlign: 'center', transition: '0.3s'
          }}>
            <p style={{ fontSize: '32px', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: '8px' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
           <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#4d70ff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
           <p style={{ color: '#64748b', fontWeight: 500 }}>Fetching your logs...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', 
          padding: '80px 40px', borderRadius: '32px', textAlign: 'center' 
        }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>📁</div>
          <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>No submissions found</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>You haven't submitted any assignments to this course yet.</p>
          <Link href="/student/assignments" style={{ 
            padding: '12px 28px', background: '#fff', color: '#000', borderRadius: '12px', 
            textDecoration: 'none', fontWeight: 700, fontSize: '14px' 
          }}>
            Start Your First Assignment
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {submissions.map(sub => {
            const config = statusConfig[sub.status] || statusConfig.pending;
            return (
              <div key={sub.id} className="sub-card" style={{ 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '24px', transition: '0.3s ease'
              }}>
                {/* Card Top */}
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
                  flexWrap: 'wrap', gap: '20px', marginBottom: '24px' 
                }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <p style={{ fontSize: '12px', color: '#4d70ff', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase' }}>Project Name</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{sub.assignmentTitle}</h3>
                    <a href={sub.submissionUrl} target="_blank" rel="noreferrer" style={{ 
                      fontSize: '14px', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' 
                    }}>
                      <span style={{ fontSize: '16px' }}>🔗</span> {sub.submissionUrl}
                    </a>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      background: config.bg, color: config.color, padding: '8px 16px', 
                      borderRadius: '12px', fontSize: '13px', fontWeight: 700, border: `1px solid ${config.color}20`,
                      display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px'
                    }}>
                      <span>{config.icon}</span> {config.label}
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                      Submitted {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Content Sections */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: sub.feedback ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr', 
                  gap: '16px' 
                }}>
                  {/* Student Note */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '20px' }}>
                    <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Submission Note</p>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>{sub.note}</p>
                  </div>

                  {/* Feedback Section */}
                  {sub.feedback ? (
                    <div style={{ background: 'rgba(77,112,255,0.05)', border: '1px solid rgba(77,112,255,0.1)', borderRadius: '16px', padding: '20px' }}>
                      <p style={{ fontSize: '11px', color: '#4d70ff', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Instructor Evaluation</p>
                      <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6, fontStyle: 'italic' }}>"{sub.feedback}"</p>
                    </div>
                  ) : sub.status === 'pending' && (
                    <div style={{ 
                      background: 'rgba(255,210,63,0.03)', border: '1px dashed rgba(255,210,63,0.2)', 
                      borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <p style={{ fontSize: '13px', color: '#FFD23F', fontWeight: 600 }}>Your project is currently in the queue for manual review.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .sub-card:hover { border-color: rgba(255,255,255,0.2) !important; background: rgba(255,255,255,0.05) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
















// 'use client';
// import { useState, useEffect } from 'react';
// import { Submission } from '@/types';

// export default function StudentSubmissionsPage() {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('/api/submissions')
//       .then(r => r.json())
//       .then(data => { setSubmissions(data); setLoading(false); });
//   }, []);

//   const statusLabel: Record<string, string> = {
//     pending: 'Pending Review', accepted: 'Accepted', needs_improvement: 'Needs Improvement'
//   };

//   const statusIcon: Record<string, string> = {
//     pending: '⏳', accepted: '✅', needs_improvement: '🔄'
//   };

//   const stats = {
//     total: submissions.length,
//     accepted: submissions.filter(s => s.status === 'accepted').length,
//     pending: submissions.filter(s => s.status === 'pending').length,
//     needs_improvement: submissions.filter(s => s.status === 'needs_improvement').length,
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
//           My Submissions
//         </h1>
//         <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track your submitted assignments and feedback</p>
//       </div>

//       {/* Stats */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
//         {[
//           { label: 'Total', value: stats.total, color: '#4d70ff' },
//           { label: 'Accepted', value: stats.accepted, color: '#06D6A0' },
//           { label: 'Pending', value: stats.pending, color: '#FFD23F' },
//           { label: 'Needs Work', value: stats.needs_improvement, color: '#EF476F' },
//         ].map((s, i) => (
//           <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
//             <p style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
//             <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>{s.label}</p>
//           </div>
//         ))}
//       </div>

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading...</div>
//       ) : submissions.length === 0 ? (
//         <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
//           <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>You haven't submitted any assignments yet.</p>
//           <a href="/student/assignments" style={{ display: 'inline-block', marginTop: '16px', color: '#4d70ff', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>
//             Browse Assignments →
//           </a>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="stagger">
//           {submissions.map(sub => (
//             <div key={sub.id} className="glass-card animate-fade-up" style={{ padding: '24px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
//                     {sub.assignmentTitle}
//                   </h3>
//                   <a href={sub.submissionUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#4d70ff', textDecoration: 'none' }}>
//                     🔗 View Submission
//                   </a>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
//                   <span className={`badge-${sub.status}`} style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                     {statusIcon[sub.status]} {statusLabel[sub.status]}
//                   </span>
//                   <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
//                     Submitted {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </p>
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: sub.feedback ? '1fr 1fr' : '1fr', gap: '12px' }}>
//                 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px' }}>
//                   <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Note</p>
//                   <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sub.note}</p>
//                 </div>

//                 {sub.feedback ? (
//                   <div style={{ background: 'rgba(77,112,255,0.06)', border: '1px solid rgba(77,112,255,0.15)', borderRadius: '10px', padding: '14px' }}>
//                     <p style={{ fontSize: '11px', color: '#4d70ff', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Instructor Feedback</p>
//                     <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sub.feedback}</p>
//                   </div>
//                 ) : sub.status === 'pending' ? (
//                   <div style={{ background: 'rgba(255,210,63,0.05)', border: '1px solid rgba(255,210,63,0.15)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <p style={{ fontSize: '13px', color: '#FFD23F', textAlign: 'center' }}>⏳ Awaiting instructor review...</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
