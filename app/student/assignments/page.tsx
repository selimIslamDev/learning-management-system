'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Assignment, Submission } from '@/types';

export default function StudentAssignmentsPage() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [form, setForm] = useState({ submissionUrl: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [improving, setImproving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/assignments').then(r => r.json()),
      fetch('/api/submissions').then(r => r.json()),
    ]).then(([a, s]) => {
      setAssignments(Array.isArray(a) ? a : []);
      setSubmissions(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, []);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const hasSubmitted = (assignmentId: string) => submissions.some(s => s.assignmentId === assignmentId);
  const getSubmission = (assignmentId: string) => submissions.find(s => s.assignmentId === assignmentId);
  const isDeadlinePassed = (deadline: string) => new Date(deadline) < new Date();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId: selected.id, ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setSubmissions(prev => [...prev, data]);
      setSelected(null);
      setForm({ submissionUrl: '', note: '' });
      showToast('Assignment submitted successfully!');
    } else {
      showToast(data.error || 'Submission failed', 'error');
    }
    setSubmitting(false);
  }

  async function improveNote() {
    if (!form.note || !selected) return;
    setImproving(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'improve_note', data: { note: form.note, assignmentTitle: selected.title } }),
    });
    const data = await res.json();
    if (data.result) setForm(f => ({ ...f, note: data.result }));
    setImproving(false);
  }

  const diffColor: any = { easy: '#06D6A0', medium: '#FFD23F', hard: '#EF476F' };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
          background: toast.type === 'success' ? '#06D6A0' : '#EF476F',
          color: '#fff', borderRadius: '12px', padding: '14px 24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)', fontWeight: 600, animation: 'slideIn 0.3s ease'
        }}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Course Assignments</h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Track your progress and submit your technical tasks</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '250px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {assignments.map(a => {
            const sub = getSubmission(a.id);
            const passed = isDeadlinePassed(a.deadline);
            return (
              <div key={a.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column',
                transition: '0.3s ease', position: 'relative', overflow: 'hidden'
              }} className="assignment-card">
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ 
                    fontSize: '11px', fontWeight: 800, padding: '5px 12px', borderRadius: '8px', 
                    background: `${diffColor[a.difficulty]}15`, color: diffColor[a.difficulty],
                    textTransform: 'uppercase', border: `1px solid ${diffColor[a.difficulty]}30`
                  }}>
                    {a.difficulty}
                  </span>
                  {sub && (
                    <span style={{ fontSize: '12px', fontWeight: 700, color: sub.status === 'accepted' ? '#06D6A0' : '#FFD23F' }}>
                      ● {sub.status.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.4 }}>{a.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>{a.description}</p>

                {sub?.feedback && (
                  <div style={{ background: 'rgba(77,112,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '20px', borderLeft: '4px solid #4d70ff' }}>
                    <p style={{ fontSize: '12px', color: '#4d70ff', fontWeight: 700, marginBottom: '4px' }}>INSTRUCTOR FEEDBACK</p>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', fontStyle: 'italic' }}>"{sub.feedback}"</p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: passed && !sub ? '#EF476F' : '#64748b', marginBottom: '4px', fontWeight: 600 }}>DEADLINE</p>
                    <p style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>
                      {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  
                  {!sub ? (
                    <button 
                      disabled={passed}
                      onClick={() => setSelected(a)}
                      style={{
                        padding: '10px 24px', borderRadius: '12px', border: 'none',
                        background: passed ? 'rgba(255,255,255,0.05)' : '#fff',
                        color: passed ? '#475569' : '#000',
                        fontWeight: 700, fontSize: '14px', cursor: passed ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {passed ? 'Expired' : 'Submit Now'}
                    </button>
                  ) : (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#06D6A0', fontWeight: 700, fontSize: '14px' }}>✓ Submitted</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Full Glass Design */}
      {selected && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.85)', 
          backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
        }} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          
          <div style={{ 
            width: '100%', maxWidth: '550px', background: '#0f172a', borderRadius: '32px', 
            border: '1px solid rgba(255,255,255,0.1)', padding: '40px', position: 'relative'
          }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Submit Work</h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '32px' }}>{selected.title}</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>PROJECT URL (GITHUB / LIVE LINK)</label>
                <input 
                  type="url" required 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 18px', color: '#fff', fontSize: '15px' }}
                  placeholder="https://github.com/username/repo"
                  value={form.submissionUrl} onChange={e => setForm({ ...form, submissionUrl: e.target.value })}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600 }}>SUBMISSION NOTE</label>
                  <button type="button" onClick={improveNote} disabled={improving || !form.note} style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {improving ? '✨ Working...' : '✨ AI Improve'}
                  </button>
                </div>
                <textarea 
                  required rows={5}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 18px', color: '#fff', fontSize: '15px', resize: 'none' }}
                  placeholder="Briefly explain your solution or any specific features..."
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <button type="button" onClick={() => setSelected(null)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ 
                  flex: 2, padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', 
                  color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(77,112,255,0.3)' 
                }}>
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .assignment-card:hover { transform: translateY(-5px); border-color: rgba(77,112,255,0.3) !important; background: rgba(255,255,255,0.05) !important; }
        @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}


















// 'use client';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { Assignment, Submission } from '@/types';

// export default function StudentAssignmentsPage() {
//   const { data: session } = useSession();
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<Assignment | null>(null);
//   const [form, setForm] = useState({ submissionUrl: '', note: '' });
//   const [submitting, setSubmitting] = useState(false);
//   const [improving, setImproving] = useState(false);
//   const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

//   const user = session?.user as any;

//   useEffect(() => {
//     Promise.all([
//       fetch('/api/assignments').then(r => r.json()),
//       fetch('/api/submissions').then(r => r.json()),
//     ]).then(([a, s]) => {
//       setAssignments(a);
//       setSubmissions(s);
//       setLoading(false);
//     });
//   }, []);

//   function showToast(msg: string, type: 'success' | 'error' = 'success') {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   }

//   function hasSubmitted(assignmentId: string) {
//     return submissions.some(s => s.assignmentId === assignmentId);
//   }

//   function getSubmission(assignmentId: string) {
//     return submissions.find(s => s.assignmentId === assignmentId);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!selected) return;
//     setSubmitting(true);
//     const res = await fetch('/api/submissions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ assignmentId: selected.id, ...form }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setSubmissions(prev => [...prev, data]);
//       setSelected(null);
//       setForm({ submissionUrl: '', note: '' });
//       showToast('Submission successful!');
//     } else {
//       showToast(data.error || 'Submission failed', 'error');
//     }
//     setSubmitting(false);
//   }

//   async function improveNote() {
//     if (!form.note || !selected) return;
//     setImproving(true);
//     const res = await fetch('/api/ai', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ action: 'improve_note', data: { note: form.note, assignmentTitle: selected.title } }),
//     });
//     const data = await res.json();
//     if (data.result) setForm(f => ({ ...f, note: data.result }));
//     setImproving(false);
//   }

//   const isDeadlinePassed = (deadline: string) => new Date(deadline) < new Date();

//   return (
//     <div>
//       {toast && (
//         <div style={{
//           position: 'fixed', top: '80px', right: '24px', zIndex: 200,
//           background: toast.type === 'success' ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
//           border: `1px solid ${toast.type === 'success' ? 'rgba(6,214,160,0.4)' : 'rgba(239,71,111,0.4)'}`,
//           borderRadius: '10px', padding: '12px 20px',
//           color: toast.type === 'success' ? '#06D6A0' : '#EF476F',
//           fontSize: '14px', fontWeight: 500
//         }}>
//           {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
//         </div>
//       )}

//       <div style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
//           Assignments
//         </h1>
//         <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Browse and submit your assignments</p>
//       </div>

//       {loading ? (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
//           {[1,2,3].map(i => (
//             <div key={i} className="glass-card" style={{ padding: '24px', height: '220px', opacity: 0.5 }}>
//               <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '20px', width: '40%', marginBottom: '12px' }} />
//               <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', marginBottom: '8px' }} />
//               <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', width: '70%' }} />
//             </div>
//           ))}
//         </div>
//       ) : assignments.length === 0 ? (
//         <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
//           <p style={{ color: 'var(--text-secondary)' }}>No assignments available yet.</p>
//         </div>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }} className="stagger">
//           {assignments.map(a => {
//             const submitted = hasSubmitted(a.id);
//             const sub = getSubmission(a.id);
//             const passed = isDeadlinePassed(a.deadline);
//             return (
//               <div key={a.id} className="glass-card animate-fade-up" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                   <span className={`badge-${a.difficulty}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', textTransform: 'capitalize' }}>
//                     {a.difficulty}
//                   </span>
//                   {submitted && sub && (
//                     <span className={`badge-${sub.status}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
//                       {sub.status === 'needs_improvement' ? 'Needs Work' : sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
//                     </span>
//                   )}
//                 </div>

//                 <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{a.title}</h3>
//                 <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
//                   {a.description}
//                 </p>

//                 {sub?.feedback && (
//                   <div style={{ background: 'rgba(77,112,255,0.08)', border: '1px solid rgba(77,112,255,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
//                     <p style={{ fontSize: '11px', color: '#4d70ff', fontWeight: 600, marginBottom: '4px' }}>📝 Instructor Feedback</p>
//                     <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sub.feedback}</p>
//                   </div>
//                 )}

//                 <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div>
//                     <p style={{ fontSize: '11px', color: passed ? '#EF476F' : 'var(--text-muted)', marginBottom: '2px' }}>
//                       {passed ? '⚠ Deadline Passed' : '⏰ Deadline'}
//                     </p>
//                     <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
//                       {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                     </p>
//                   </div>
//                   {!submitted ? (
//                     <button className="btn-primary" onClick={() => { setSelected(a); setForm({ submissionUrl: '', note: '' }); }} style={{ fontSize: '13px', padding: '8px 16px' }} disabled={passed}>
//                       {passed ? 'Expired' : 'Submit'}
//                     </button>
//                   ) : (
//                     <span style={{ fontSize: '13px', color: '#06D6A0', fontWeight: 600 }}>✓ Submitted</span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Submit Modal */}
//       {selected && (
//         <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
//           onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
//           <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '32px', border: '1px solid rgba(77,112,255,0.2)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
//               <div>
//                 <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Submit Assignment</h2>
//                 <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.title}</p>
//               </div>
//               <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>✕</button>
//             </div>

//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <div>
//                 <label className="form-label">Submission URL (GitHub/Live Link)</label>
//                 <input type="url" className="input-field" value={form.submissionUrl} onChange={e => setForm(f => ({ ...f, submissionUrl: e.target.value }))} placeholder="https://github.com/yourname/project" required />
//               </div>
//               <div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
//                   <label className="form-label" style={{ margin: 0 }}>Note to Instructor</label>
//                   <button type="button" onClick={improveNote} disabled={improving || !form.note} style={{
//                     background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(77,112,255,0.2))',
//                     border: '1px solid rgba(123,47,190,0.4)', borderRadius: '8px', padding: '5px 12px',
//                     color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
//                   }}>
//                     {improving ? '⏳ Improving...' : '✨ AI Improve'}
//                   </button>
//                 </div>
//                 <textarea className="input-field" rows={4} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Describe what you built, any challenges, or what you learned..." required style={{ resize: 'vertical' }} />
//               </div>
//               <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
//                 <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
//                 <button type="submit" className="btn-primary" disabled={submitting}>
//                   {submitting ? 'Submitting...' : 'Submit Assignment'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
