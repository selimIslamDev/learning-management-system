'use client';
import { useState, useEffect } from 'react';
import { Submission } from '@/types';

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(data => { setSubmissions(data); setLoading(false); });
  }, []);

  const statusLabel: Record<string, string> = {
    pending: 'Pending Review', accepted: 'Accepted', needs_improvement: 'Needs Improvement'
  };

  const statusIcon: Record<string, string> = {
    pending: '⏳', accepted: '✅', needs_improvement: '🔄'
  };

  const stats = {
    total: submissions.length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    needs_improvement: submissions.filter(s => s.status === 'needs_improvement').length,
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          My Submissions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track your submitted assignments and feedback</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total', value: stats.total, color: '#4d70ff' },
          { label: 'Accepted', value: stats.accepted, color: '#06D6A0' },
          { label: 'Pending', value: stats.pending, color: '#FFD23F' },
          { label: 'Needs Work', value: stats.needs_improvement, color: '#EF476F' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>You haven't submitted any assignments yet.</p>
          <a href="/student/assignments" style={{ display: 'inline-block', marginTop: '16px', color: '#4d70ff', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>
            Browse Assignments →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="stagger">
          {submissions.map(sub => (
            <div key={sub.id} className="glass-card animate-fade-up" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {sub.assignmentTitle}
                  </h3>
                  <a href={sub.submissionUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#4d70ff', textDecoration: 'none' }}>
                    🔗 View Submission
                  </a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <span className={`badge-${sub.status}`} style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {statusIcon[sub.status]} {statusLabel[sub.status]}
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Submitted {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: sub.feedback ? '1fr 1fr' : '1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Note</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sub.note}</p>
                </div>

                {sub.feedback ? (
                  <div style={{ background: 'rgba(77,112,255,0.06)', border: '1px solid rgba(77,112,255,0.15)', borderRadius: '10px', padding: '14px' }}>
                    <p style={{ fontSize: '11px', color: '#4d70ff', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Instructor Feedback</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sub.feedback}</p>
                  </div>
                ) : sub.status === 'pending' ? (
                  <div style={{ background: 'rgba(255,210,63,0.05)', border: '1px solid rgba(255,210,63,0.15)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#FFD23F', textAlign: 'center' }}>⏳ Awaiting instructor review...</p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
