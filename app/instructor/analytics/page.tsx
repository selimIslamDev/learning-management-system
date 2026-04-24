'use client';
import { useState, useEffect } from 'react';
import { AnalyticsData } from '@/types';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid #4d70ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return <p style={{ color: 'var(--text-muted)' }}>Failed to load analytics.</p>;

  const statCards = [
    { label: 'Total Assignments', value: data.totalAssignments, icon: '📋', color: '#4d70ff' },
    { label: 'Total Submissions', value: data.totalSubmissions, icon: '📬', color: '#7B2FBE' },
    { label: 'Accepted', value: data.statusBreakdown.find(s => s.name === 'Accepted')?.value ?? 0, icon: '✅', color: '#06D6A0' },
    { label: 'Needs Improvement', value: data.statusBreakdown.find(s => s.name === 'Needs Improvement')?.value ?? 0, icon: '🔄', color: '#EF476F' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(26,26,39,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px' }}>
          {label && <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>{label}</p>}
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color, fontSize: '13px', fontWeight: 600 }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track student performance and submission trends</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }} className="stagger">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card animate-fade-up" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${card.color}20`, border: `1px solid ${card.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{card.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Submission Status
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Distribution of all submission statuses</p>
          {data.totalSubmissions === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', color: 'var(--text-muted)', fontSize: '14px' }}>No submission data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.statusBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                  {data.statusBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart - Difficulty */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Performance by Difficulty
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Submissions vs accepted by difficulty level</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.difficultyBreakdown} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>} />
              <Bar dataKey="submissions" name="Total" fill="#4d70ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="accepted" name="Accepted" fill="#06D6A0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assignment Performance Table */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Assignment Performance
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Detailed breakdown per assignment</p>
        {data.assignmentPerformance.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No data available yet.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.assignmentPerformance} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="title" width={130} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>} />
                <Bar dataKey="accepted" name="Accepted" stackId="a" fill="#06D6A0" radius={0} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#FFD23F" radius={0} />
                <Bar dataKey="needs_improvement" name="Needs Improvement" stackId="a" fill="#EF476F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Acceptance Rate Table */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Acceptance Rates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.assignmentPerformance.map((ap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '200px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ap.title}</p>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${ap.acceptanceRate}%`, background: 'linear-gradient(90deg, #4d70ff, #06D6A0)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: ap.acceptanceRate > 50 ? '#06D6A0' : '#EF476F', width: '40px', textAlign: 'right' }}>
                      {ap.acceptanceRate}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
