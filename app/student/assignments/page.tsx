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

  const user = session?.user as any;

  useEffect(() => {
    Promise.all([
      fetch('/api/assignments').then(r => r.json()),
      fetch('/api/submissions').then(r => r.json()),
    ]).then(([a, s]) => {
      setAssignments(a);
      setSubmissions(s);
      setLoading(false);
    });
  }, []);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function hasSubmitted(assignmentId: string) {
    return submissions.some(s => s.assignmentId === assignmentId);
  }

  function getSubmission(assignmentId: string) {
    return submissions.find(s => s.assignmentId === assignmentId);
  }

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
      showToast('Submission successful!');
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

  const isDeadlinePassed = (deadline: string) => new Date(deadline) < new Date();

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 200,
          background: toast.type === 'success' ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(6,214,160,0.4)' : 'rgba(239,71,111,0.4)'}`,
          borderRadius: '10px', padding: '12px 20px',
          color: toast.type === 'success' ? '#06D6A0' : '#EF476F',
          fontSize: '14px', fontWeight: 500
        }}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Assignments
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Browse and submit your assignments</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {[1,2,3].map(i => (
            <div key={i} className="glass-card" style={{ padding: '24px', height: '220px', opacity: 0.5 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '20px', width: '40%', marginBottom: '12px' }} />
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', marginBottom: '8px' }} />
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', width: '70%' }} />
            </div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ color: 'var(--text-secondary)' }}>No assignments available yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }} className="stagger">
          {assignments.map(a => {
            const submitted = hasSubmitted(a.id);
            const sub = getSubmission(a.id);
            const passed = isDeadlinePassed(a.deadline);
            return (
              <div key={a.id} className="glass-card animate-fade-up" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className={`badge-${a.difficulty}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', textTransform: 'capitalize' }}>
                    {a.difficulty}
                  </span>
                  {submitted && sub && (
                    <span className={`badge-${sub.status}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
                      {sub.status === 'needs_improvement' ? 'Needs Work' : sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  )}
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {a.description}
                </p>

                {sub?.feedback && (
                  <div style={{ background: 'rgba(77,112,255,0.08)', border: '1px solid rgba(77,112,255,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
                    <p style={{ fontSize: '11px', color: '#4d70ff', fontWeight: 600, marginBottom: '4px' }}>📝 Instructor Feedback</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sub.feedback}</p>
                  </div>
                )}

                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: passed ? '#EF476F' : 'var(--text-muted)', marginBottom: '2px' }}>
                      {passed ? '⚠ Deadline Passed' : '⏰ Deadline'}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {!submitted ? (
                    <button className="btn-primary" onClick={() => { setSelected(a); setForm({ submissionUrl: '', note: '' }); }} style={{ fontSize: '13px', padding: '8px 16px' }} disabled={passed}>
                      {passed ? 'Expired' : 'Submit'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#06D6A0', fontWeight: 600 }}>✓ Submitted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '32px', border: '1px solid rgba(77,112,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Submit Assignment</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.title}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Submission URL (GitHub/Live Link)</label>
                <input type="url" className="input-field" value={form.submissionUrl} onChange={e => setForm(f => ({ ...f, submissionUrl: e.target.value }))} placeholder="https://github.com/yourname/project" required />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Note to Instructor</label>
                  <button type="button" onClick={improveNote} disabled={improving || !form.note} style={{
                    background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(77,112,255,0.2))',
                    border: '1px solid rgba(123,47,190,0.4)', borderRadius: '8px', padding: '5px 12px',
                    color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                  }}>
                    {improving ? '⏳ Improving...' : '✨ AI Improve'}
                  </button>
                </div>
                <textarea className="input-field" rows={4} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Describe what you built, any challenges, or what you learned..." required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
