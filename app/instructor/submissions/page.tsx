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

  const statusLabel: Record<string, string> = {
    pending: 'Pending', accepted: 'Accepted', needs_improvement: 'Needs Improvement'
  };

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    needs_improvement: submissions.filter(s => s.status === 'needs_improvement').length,
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 200, background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.4)', borderRadius: '10px', padding: '12px 20px', color: '#06D6A0', fontSize: '14px', fontWeight: 500 }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Submissions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Review student submissions and provide feedback</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'accepted', 'needs_improvement'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            background: filter === f ? 'rgba(77,112,255,0.2)' : 'rgba(255,255,255,0.04)',
            color: filter === f ? '#4d70ff' : 'var(--text-secondary)',
            borderBottom: filter === f ? '2px solid #4d70ff' : '2px solid transparent',
            fontFamily: 'var(--font-body)',
          }}>
            {f === 'all' ? 'All' : statusLabel[f]} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
          <p style={{ color: 'var(--text-secondary)' }}>No submissions found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(sub => (
            <div key={sub.id} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'default' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {sub.studentName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{sub.studentName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.studentEmail}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{sub.assignmentTitle}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>{sub.note}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <span className={`badge-${sub.status}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  {statusLabel[sub.status]}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <button className="btn-primary" onClick={() => openReview(sub)} style={{ padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(77,112,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Review Submission</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>✕</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Student</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{selected.studentName}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{selected.assignmentTitle}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Submission URL</p>
              <a href={selected.submissionUrl} target="_blank" rel="noreferrer" style={{ color: '#4d70ff', fontSize: '13px', wordBreak: 'break-all' }}>{selected.submissionUrl}</a>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px', marginBottom: '4px' }}>Student's Note</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.note}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Update Status</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['accepted', 'pending', 'needs_improvement'] as SubmissionStatus[]).map(s => (
                  <button key={s} onClick={() => setStatus(s)} style={{
                    padding: '10px 8px', borderRadius: '8px', border: `1px solid ${status === s ? 'currentColor' : 'rgba(255,255,255,0.08)'}`,
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-body)',
                    background: status === s ? (s === 'accepted' ? 'rgba(6,214,160,0.15)' : s === 'pending' ? 'rgba(255,210,63,0.15)' : 'rgba(239,71,111,0.15)') : 'rgba(255,255,255,0.03)',
                    color: s === 'accepted' ? '#06D6A0' : s === 'pending' ? '#FFD23F' : '#EF476F',
                  }}>
                    {s === 'accepted' ? '✓ Accepted' : s === 'pending' ? '⏳ Pending' : '↩ Needs Work'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Feedback</label>
                <button onClick={generateAIFeedback} disabled={aiLoading} style={{
                  background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(77,112,255,0.2))',
                  border: '1px solid rgba(123,47,190,0.4)', borderRadius: '8px', padding: '5px 12px',
                  color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                }}>
                  {aiLoading ? '⏳ Generating...' : '✨ AI Generate'}
                </button>
              </div>
              <textarea className="input-field" rows={5} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Write your feedback here, or use AI to generate it..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}