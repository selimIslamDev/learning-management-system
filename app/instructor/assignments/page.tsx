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
    const res = await fetch('/api/assignments');
    const data = await res.json();
    setAssignments(data);
    setLoading(false);
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

  const difficultyColor: Record<string, string> = {
    beginner: '#06D6A0', intermediate: '#FFD23F', advanced: '#EF476F'
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 200, background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.4)', borderRadius: '10px', padding: '12px 20px', color: '#06D6A0', fontSize: '14px', fontWeight: 500 }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Assignments
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Manage and create assignments for your students
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{showForm ? '✕' : '+'}</span>
          {showForm ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(77,112,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4d70ff, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📝</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Create New Assignment</h2>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Title</label>
                <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Build a Todo App" required />
              </div>
              <div>
                <label className="form-label">Difficulty Level</label>
                <select className="input-field" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Description</label>
                <button type="button" onClick={enhanceDescription} disabled={enhancing} style={{
                  background: 'linear-gradient(135deg, rgba(123,47,190,0.2), rgba(77,112,255,0.2))',
                  border: '1px solid rgba(123,47,190,0.4)', borderRadius: '8px', padding: '5px 12px',
                  color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  {enhancing ? '⏳ Enhancing...' : '✨ AI Enhance'}
                </button>
              </div>
              <textarea className="input-field" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the assignment requirements..." required style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input type="datetime-local" className="input-field" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {[1,2,3].map(i => (
            <div key={i} className="glass-card" style={{ padding: '24px', height: '200px', background: 'rgba(26,26,39,0.5)' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '20px', width: '60%', marginBottom: '12px' }} />
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', width: '80%', marginBottom: '8px' }} />
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', height: '16px', width: '40%' }} />
            </div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No assignments yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }} className="stagger">
          {assignments.map(a => (
            <div key={a.id} className="glass-card animate-fade-up" style={{ padding: '24px', transition: 'border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(77,112,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className={`badge-${a.difficulty}`} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', textTransform: 'capitalize', letterSpacing: '0.3px' }}>
                  {a.difficulty}
                </span>
                <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px', padding: '2px' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#EF476F')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
                  🗑
                </button>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {a.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Deadline</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Created</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
