'use client';
import { useState, useEffect } from 'react';
import { Submission, SubmissionStatus } from '@/types';

export default function InstructorSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('pending');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => { fetchSubmissions(); }, []);

  async function fetchSubmissions() {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function openReview(sub: Submission) {
    setSelected(sub);
    setFeedback(sub.feedback || '');
    setStatus(sub.status);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/submissions/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, feedback }),
    });
    if (res.ok) {
      fetchSubmissions();
      setSelected(null);
      showToast('Review saved successfully!');
    }
    setSaving(false);
  }

  async function generateAIFeedback() {
    if (!selected) return;
    setAiLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_feedback',
        data: {
          studentName: selected.studentName,
          assignmentTitle: selected.assignmentTitle,
          submissionNote: selected.note,
          submissionUrl: selected.submissionUrl,
        },
      }),
    });
    const data = await res.json();
    if (data.result) setFeedback(data.result);
    setAiLoading(false);
  }

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    pending: { label: 'Pending', color: '#FFD23F', bg: 'rgba(255,210,63,0.1)' },
    accepted: { label: 'Accepted', color: '#06D6A0', bg: 'rgba(6,214,160,0.1)' },
    needs_improvement: { label: 'Needs Work', color: '#EF476F', bg: 'rgba(239,71,111,0.1)' }
  };

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    needs_improvement: submissions.filter(s => s.status === 'needs_improvement').length,
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Animated Toast */}
      {toast && (
        <div style={{ 
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000, 
          background: '#06D6A0', color: '#fff', borderRadius: '12px', 
          padding: '14px 24px', fontWeight: 600, boxShadow: '0 10px 30px rgba(6,214,160,0.3)',
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideIn 0.3s ease'
        }}>
          <span>✓</span> {toast}
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Submissions</h1>
        <p style={{ color: '#94a3b8', fontSize: '15px' }}>Grade and give feedback on student projects</p>
      </div>

      {/* Filter Tabs - Fully Responsive */}
      <div style={{ 
        display: 'flex', gap: '8px', marginBottom: '32px', padding: '4px',
        background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
        width: 'fit-content', flexWrap: 'wrap'
      }}>
        {(['all', 'pending', 'accepted', 'needs_improvement'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            transition: 'all 0.2s',
            background: filter === f ? 'rgba(77,112,255,0.15)' : 'transparent',
            color: filter === f ? '#4d70ff' : '#64748b',
          }}>
            {f === 'all' ? 'All Submissions' : statusConfig[f].label} 
            <span style={{ marginLeft: '8px', opacity: 0.6, fontSize: '12px' }}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
           <div className="spinner" style={{ width: '30px', height: '30px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4d70ff', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 16px' }} />
           Loading student data...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px', padding: '80px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '16px' }}>No submissions to display in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.map(sub => (
            <div key={sub.id} 
              style={{ 
                background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px 28px',
                border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', 
                justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', transition: '0.2s'
              }}
              className="submission-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: '250px' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '16px', 
                  background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px'
                }}>
                  {sub.studentName.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{sub.studentName}</h3>
                  <p style={{ fontSize: '14px', color: '#4d70ff', fontWeight: 500, marginBottom: '4px' }}>{sub.assignmentTitle}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.note}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '11px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', 
                    background: statusConfig[sub.status].bg, color: statusConfig[sub.status].color,
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    {statusConfig[sub.status].label}
                  </span>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button 
                  onClick={() => openReview(sub)}
                  style={{ 
                    background: '#fff', color: '#000', border: 'none', padding: '10px 24px', 
                    borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Overlay */}
      {selected && (
        <div 
          style={{ 
            position: 'fixed', inset: 0, zIndex: 1000, 
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
          }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}
        >
          <div style={{ 
            width: '100%', maxWidth: '650px', background: '#0f172a', 
            borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}>
            <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Submission Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#64748b', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Student</label>
                  <p style={{ color: '#fff', fontWeight: 600 }}>{selected.studentName}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Assignment</label>
                  <p style={{ color: '#4d70ff', fontWeight: 600 }}>{selected.assignmentTitle}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Project Link</label>
                  <a href={selected.submissionUrl} target="_blank" rel="noreferrer" style={{ color: '#06D6A0', fontSize: '14px', textDecoration: 'underline' }}>{selected.submissionUrl}</a>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>Set Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                  {(['accepted', 'pending', 'needs_improvement'] as SubmissionStatus[]).map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={{
                      padding: '12px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s',
                      background: status === s ? statusConfig[s].bg : 'rgba(255,255,255,0.02)',
                      color: status === s ? statusConfig[s].color : '#475569',
                      border: `1px solid ${status === s ? statusConfig[s].color : 'rgba(255,255,255,0.05)'}`,
                    }}>
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Feedback</label>
                  <button onClick={generateAIFeedback} disabled={aiLoading} style={{
                    background: 'rgba(123,47,190,0.1)', border: '1px solid #7B2FBE40', color: '#c084fc',
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}>
                    {aiLoading ? '✨ Generating...' : '✨ AI Feedback'}
                  </button>
                </div>
                <textarea 
                  value={feedback} onChange={e => setFeedback(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', color: '#fff', minHeight: '120px', fontSize: '14px', lineHeight: '1.6' }}
                  placeholder="Tell the student what they did well or what to fix..."
                />
              </div>
            </div>

            <div style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', padding: '10px 20px' }}>Cancel</button>
              <button 
                onClick={handleSave} disabled={saving}
                style={{ background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 20px rgba(77,112,255,0.2)' }}
              >
                {saving ? 'Saving...' : 'Complete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















// 'use client';
// import { useState, useEffect } from 'react';
// import { Submission, SubmissionStatus } from '@/types';

// export default function InstructorSubmissionsPage() {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<Submission | null>(null);
//   const [feedback, setFeedback] = useState('');
//   const [status, setStatus] = useState<SubmissionStatus>('pending');
//   const [saving, setSaving] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [filter, setFilter] = useState('all');
//   const [toast, setToast] = useState('');

//   useEffect(() => { fetchSubmissions(); }, []);

//   async function fetchSubmissions() {
//     try {
//       const res = await fetch('/api/submissions');
//       const data = await res.json();
//       setSubmissions(Array.isArray(data) ? data : []);
//     } catch (error) {
//       setSubmissions([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function showToast(msg: string) {
//     setToast(msg);
//     setTimeout(() => setToast(''), 3000);
//   }

//   function openReview(sub: Submission) {
//     setSelected(sub);
//     setFeedback(sub.feedback || '');
//     setStatus(sub.status);
//   }

//   async function handleSave() {
//     if (!selected) return;
//     setSaving(true);
//     const res = await fetch(`/api/submissions/${selected.id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status, feedback }),
//     });
//     if (res.ok) {
//       fetchSubmissions();
//       setSelected(null);
//       showToast('Review saved successfully!');
//     }
//     setSaving(false);
//   }

//   async function generateAIFeedback() {
//     if (!selected) return;
//     setAiLoading(true);
//     const res = await fetch('/api/ai', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         action: 'generate_feedback',
//         data: {
//           studentName: selected.studentName,
//           assignmentTitle: selected.assignmentTitle,
//           submissionNote: selected.note,
//           submissionUrl: selected.submissionUrl,
//         },
//       }),
//     });
//     const data = await res.json();
//     if (data.result) setFeedback(data.result);
//     setAiLoading(false);
//   }

//   const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

//   const statusLabel: Record<string, string> = {
//     pending: 'Pending', accepted: 'Accepted', needs_improvement: 'Needs Improvement'
//   };

//   const counts = {
//     all: submissions.length,
//     pending: submissions.filter(s => s.status === 'pending').length,
//     accepted: submissions.filter(s => s.status === 'accepted').length,
//     needs_improvement: submissions.filter(s => s.status === 'needs_improvement').length,
//   };

//   return (
//     <div>
//       {toast && (
//         <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 200, background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.4)', borderRadius: '10px', padding: '12px 20px', color: '#06D6A0', fontSize: '14px', fontWeight: 500 }}>
//           ✓ {toast}
//         </div>
//       )}

//       <div style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
//           Submissions
//         </h1>
//         <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Review student submissions and provide feedback</p>
//       </div>

//       <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
//         {(['all', 'pending', 'accepted', 'needs_improvement'] as const).map(f => (
//           <button key={f} onClick={() => setFilter(f)} style={{
//             padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
//             background: filter === f ? 'rgba(77,112,255,0.2)' : 'rgba(255,255,255,0.04)',
//             color: filter === f ? '#4d70ff' : 'var(--text-secondary)',
//             borderBottom: filter === f ? '2px solid #4d70ff' : '2px solid transparent',
//             fontFamily: 'var(--font-body)',
//           }}>
//             {f === 'all' ? 'All' : statusLabel[f]} ({counts[f]})
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading submissions...</div>
//       ) : filtered.length === 0 ? (
//         <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
//           <p style={{ color: 'var(--text-secondary)' }}>No submissions found.</p>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           {filtered.map(sub => (
//             <div key={sub.id} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'default' }}>
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
//                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
//                     {sub.studentName.charAt(0)}
//                   </div>
//                   <div>
//                     <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{sub.studentName}</p>
//                     <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.studentEmail}</p>
//                   </div>
//                 </div>
//                 <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{sub.assignmentTitle}</p>
//                 <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>{sub.note}</p>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
//                 <span className={`badge-${sub.status}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
//                   {statusLabel[sub.status]}
//                 </span>
//                 <p style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
//                   {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                 </p>
//                 <button className="btn-primary" onClick={() => openReview(sub)} style={{ padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
//                   Review
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selected && (
//         <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
//           onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
//           <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(77,112,255,0.2)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//               <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Review Submission</h2>
//               <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>✕</button>
//             </div>

//             <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
//               <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Student</p>
//               <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{selected.studentName}</p>
//               <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{selected.assignmentTitle}</p>
//               <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Submission URL</p>
//               <a href={selected.submissionUrl} target="_blank" rel="noreferrer" style={{ color: '#4d70ff', fontSize: '13px', wordBreak: 'break-all' }}>{selected.submissionUrl}</a>
//               <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px', marginBottom: '4px' }}>Student's Note</p>
//               <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.note}</p>
//             </div>

//             <div style={{ marginBottom: '16px' }}>
//               <label className="form-label">Update Status</label>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
//                 {(['accepted', 'pending', 'needs_improvement'] as SubmissionStatus[]).map(s => (
//                   <button key={s} onClick={() => setStatus(s)} style={{
//                     padding: '10px 8px', borderRadius: '8px', border: `1px solid ${status === s ? 'currentColor' : 'rgba(255,255,255,0.08)'}`,
//                     cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-body)',
//                     background: status === s ? (s === 'accepted' ? 'rgba(6,214,160,0.15)' : s === 'pending' ? 'rgba(255,210,63,0.15)' : 'rgba(239,71,111,0.15)') : 'rgba(255,255,255,0.03)',
//                     color: s === 'accepted' ? '#06D6A0' : s === 'pending' ? '#FFD23F' : '#EF476F',
//                   }}>
//                     {s === 'accepted' ? '✓ Accepted' : s === 'pending' ? '⏳ Pending' : '↩ Needs Work'}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
//                 <label className="form-label" style={{ margin: 0 }}>Feedback</label>
//                 <button onClick={generateAIFeedback} disabled={aiLoading} style={{
//                   background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(77,112,255,0.2))',
//                   border: '1px solid rgba(123,47,190,0.4)', borderRadius: '8px', padding: '5px 12px',
//                   color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
//                 }}>
//                   {aiLoading ? '⏳ Generating...' : '✨ AI Generate'}
//                 </button>
//               </div>
//               <textarea className="input-field" rows={5} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Write your feedback here, or use AI to generate it..." style={{ resize: 'vertical' }} />
//             </div>

//             <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
//               <button className="btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
//               <button className="btn-primary" onClick={handleSave} disabled={saving}>
//                 {saving ? 'Saving...' : 'Save Review'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }