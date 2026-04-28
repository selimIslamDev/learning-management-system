'use client';
import { useState, useEffect } from 'react';
import { Assignment } from '@/types';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', difficulty: 'beginner' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchAssignments(); }, []);

  async function fetchAssignments() {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: '', description: '', deadline: '', difficulty: 'beginner' });
      setShowForm(false);
      fetchAssignments();
      showToast('Assignment created successfully!');
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this assignment?')) return;
    await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    fetchAssignments();
    showToast('Assignment deleted.');
  }

  async function enhanceDescription() {
    if (!form.title || !form.description) return alert('Enter title and description first.');
    setEnhancing(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'enhance_description', data: { title: form.title, description: form.description, difficulty: form.difficulty } }),
    });
    const data = await res.json();
    if (data.result) setForm(f => ({ ...f, description: data.result }));
    setEnhancing(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* 3D Toast Notification */}
      {toast && (
        <div style={{ 
          position: 'fixed', top: '30px', right: '30px', zIndex: 1000, 
          background: '#06D6A0', color: '#fff', borderRadius: '16px', 
          padding: '16px 24px', fontWeight: 600, fontSize: '14px',
          boxShadow: '0 20px 40px rgba(6,214,160,0.3)',
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'fadeSlideIn 0.4s ease-out'
        }}>
          <span style={{ fontSize: '18px' }}>🚀</span> {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 850, color: '#fff', marginBottom: '8px' }}>
            Assignments
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            Create and manage course tasks for students
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={{ 
            background: showForm ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #4d70ff, #7B2FBE)',
            color: '#fff', border: showForm ? '1px solid rgba(255,255,255,0.1)' : 'none',
            padding: '14px 28px', borderRadius: '16px', fontWeight: 600, fontSize: '15px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: showForm ? 'none' : '0 10px 25px rgba(77,112,255,0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontSize: '20px' }}>{showForm ? '✕' : '+'}</span>
          {showForm ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {/* Modern Creation Form */}
      {showForm && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)',
          borderRadius: '30px', padding: '35px', marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(77,112,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✍️</div>
             <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>New Assignment</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>Assignment Title</label>
                <input 
                  style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Redux State Management" required 
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>Difficulty</label>
                <select 
                  style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                >
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>Description</label>
                <button 
                  type="button" onClick={enhanceDescription} disabled={enhancing}
                  style={{ 
                    background: 'rgba(123,47,190,0.15)', border: '1px solid #7B2FBE60',
                    padding: '6px 14px', borderRadius: '10px', color: '#c084fc', fontSize: '12px',
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  {enhancing ? '🪄 Working...' : '✨ AI Enhance'}
                </button>
              </div>
              <textarea 
                style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', minHeight: '120px' }}
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Explain the assignment details..." required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
               <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>Submission Deadline</label>
                  <input 
                    type="datetime-local" style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required 
                  />
               </div>
               <button 
                type="submit" disabled={submitting}
                style={{ 
                  background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', color: '#fff',
                  padding: '15px', borderRadius: '14px', border: 'none', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 10px 20px rgba(77,112,255,0.3)'
                }}
               >
                {submitting ? 'Creating...' : 'Publish Assignment'}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '220px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div style={{ padding: '80px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '30px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📁</div>
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 600 }}>No Assignments Found</h3>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Start by creating a new assignment for your students.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {assignments.map(a => (
            <div 
              key={a.id} 
              style={{ 
                background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)', position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default',
                display: 'flex', flexDirection: 'column', gap: '15px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(77,112,255,0.3)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '10px',
                  background: a.difficulty === 'advanced' ? 'rgba(239,71,111,0.1)' : a.difficulty === 'intermediate' ? 'rgba(255,210,63,0.1)' : 'rgba(6,214,160,0.1)',
                  color: a.difficulty === 'advanced' ? '#EF476F' : a.difficulty === 'intermediate' ? '#FFD23F' : '#06D6A0',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  {a.difficulty}
                </span>
                <button 
                  onClick={() => handleDelete(a.id)}
                  style={{ background: 'rgba(239,71,111,0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', color: '#EF476F', cursor: 'pointer', transition: '0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EF476F30'}
                  onMouseLeave={e => e.currentTarget.style.background = '#EF476F10'}
                >
                  🗑
                </button>
              </div>

              <h3 style={{ fontSize: '19px', fontWeight: 750, color: '#fff', lineHeight: 1.4 }}>{a.title}</h3>
              
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {a.description}
              </p>

              <div style={{ 
                marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Due Date</p>
                  <p style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: 600 }}>
                    {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Submissions</p>
                  <p style={{ fontSize: '13px', color: '#4d70ff', fontWeight: 800 }}>Live</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




















// 'use client';
// import { useState, useEffect } from 'react';
// import { Assignment } from '@/types';

// const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// export default function InstructorAssignmentsPage() {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [enhancing, setEnhancing] = useState(false);
//   const [form, setForm] = useState({ title: '', description: '', deadline: '', difficulty: 'beginner' });
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast] = useState('');

//   useEffect(() => { fetchAssignments(); }, []);

//   async function fetchAssignments() {
//     try {
//       const res = await fetch('/api/assignments');
//       const data = await res.json();
//       setAssignments(Array.isArray(data) ? data : []);
//     } catch (error) {
//       setAssignments([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function showToast(msg: string) {
//     setToast(msg);
//     setTimeout(() => setToast(''), 3000);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSubmitting(true);
//     const res = await fetch('/api/assignments', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       setForm({ title: '', description: '', deadline: '', difficulty: 'beginner' });
//       setShowForm(false);
//       fetchAssignments();
//       showToast('Assignment created successfully!');
//     }
//     setSubmitting(false);
//   }

//   async function handleDelete(id: string) {
//     if (!confirm('Delete this assignment?')) return;
//     await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
//     fetchAssignments();
//     showToast('Assignment deleted.');
//   }

//   async function enhanceDescription() {
//     if (!form.title || !form.description) return alert('Enter title and description first.');
//     setEnhancing(true);
//     const res = await fetch('/api/ai', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ action: 'enhance_description', data: { title: form.title, description: form.description, difficulty: form.difficulty } }),
//     });
//     const data = await res.json();
//     if (data.result) setForm(f => ({ ...f, description: data.result }));
//     setEnhancing(false);
//   }

//   return (
//     <div>
//       {toast && (
//         <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 200, background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.4)', borderRadius: '10px', padding: '12px 20px', color: '#06D6A0', fontSize: '14px', fontWeight: 500 }}>
//           ✓ {toast}
//         </div>
//       )}

//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
//         <div>
//           <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
//             Assignments
//           </h1>
//           <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
//             Manage and create assignments for your students
//           </p>
//         </div>
//         <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <span style={{ fontSize: '18px' }}>{showForm ? '✕' : '+'}</span>
//           {showForm ? 'Cancel' : 'New Assignment'}
//         </button>
//       </div>

//       {showForm && (
//         <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(77,112,255,0.2)' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
//             <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📝</div>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Create New Assignment</h2>
//           </div>
//           <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//               <div>
//                 <label className="form-label">Title</label>
//                 <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Build a Todo App" required />
//               </div>
//               <div>
//                 <label className="form-label">Difficulty Level</label>
//                 <select className="input-field" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
//                   {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
//                 </select>
//               </div>
//             </div>
//             <div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
//                 <label className="form-label" style={{ margin: 0 }}>Description</label>
//                 <button type="button" onClick={enhanceDescription} disabled={enhancing} style={{
//                   background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(77,112,255,0.2))',
//                   border: '1px solid rgba(123,47,190,0.4)', borderRadius: '8px', padding: '5px 12px',
//                   color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
//                 }}>
//                   {enhancing ? '⏳ Enhancing...' : '✨ AI Enhance'}
//                 </button>
//               </div>
//               <textarea className="input-field" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the assignment requirements..." required style={{ resize: 'vertical' }} />
//             </div>
//             <div>
//               <label className="form-label">Deadline</label>
//               <input type="datetime-local" className="input-field" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required />
//             </div>
//             <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
//               <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
//               <button type="submit" className="btn-primary" disabled={submitting}>
//                 {submitting ? 'Creating...' : 'Create Assignment'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
//           {[1,2,3].map(i => (
//             <div key={i} className="glass-card" style={{ padding: '24px', height: '200px', background: 'rgba(26,26,39,0.5)' }}>
//               <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '20px', width: '60%', marginBottom: '12px' }} />
//               <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', width: '80%', marginBottom: '8px' }} />
//               <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', width: '40%' }} />
//             </div>
//           ))}
//         </div>
//       ) : assignments.length === 0 ? (
//         <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
//           <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No assignments yet. Create your first one!</p>
//         </div>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }} className="stagger">
//           {assignments.map(a => (
//             <div key={a.id} className="glass-card animate-fade-up" style={{ padding: '24px', transition: 'border-color 0.2s', cursor: 'default' }}
//               onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(77,112,255,0.3)')}
//               onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
//                 <span className={`badge-${a.difficulty}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', textTransform: 'capitalize', letterSpacing: '0.3px' }}>
//                   {a.difficulty}
//                 </span>
//                 <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px', padding: '2px' }}
//                   onMouseEnter={e => ((e.target as HTMLElement).style.color = '#EF476F')}
//                   onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
//                   🗑
//                 </button>
//               </div>
//               <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>{a.title}</h3>
//               <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//                 {a.description}
//               </p>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
//                 <div>
//                   <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Deadline</p>
//                   <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
//                     {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </p>
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                   <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Created</p>
//                   <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
//                     {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }