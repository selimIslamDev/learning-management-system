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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', height: '50px', border: '3px solid rgba(77,112,255,0.1)', 
            borderTopColor: '#4d70ff', borderRadius: '50%', 
            animation: 'spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite', 
            margin: '0 auto 20px',
            boxShadow: '0 0 15px rgba(77,112,255,0.3)'
          }} />
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px' }}>Gathering Insights...</p>
        </div>
      </div>
    );
  }

  if (!data) return <p style={{ color: '#ef4444', textAlign: 'center', padding: '40px' }}>Failed to load analytics.</p>;

  const statCards = [
    { label: 'Total Assignments', value: data.totalAssignments, icon: '📋', color: '#4d70ff', shadow: 'rgba(77,112,255,0.25)' },
    { label: 'Total Submissions', value: data.totalSubmissions, icon: '📬', color: '#7B2FBE', shadow: 'rgba(123,47,190,0.25)' },
    { label: 'Accepted', value: data.statusBreakdown.find(s => s.name === 'Accepted')?.value ?? 0, icon: '✅', color: '#06D6A0', shadow: 'rgba(6,214,160,0.25)' },
    { label: 'Needs Improvement', value: data.statusBreakdown.find(s => s.name === 'Needs Improvement')?.value ?? 0, icon: '🔄', color: '#EF476F', shadow: 'rgba(239,71,111,0.25)' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.9)', 
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '12px', padding: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
        }}>
          {label && <p style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>}
          {payload.map((p: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                <p style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{p.name}: {p.value}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 850, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          Analytics Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06D6A0', boxShadow: '0 0 10px #06D6A0' }} />
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>Live performance tracking enabled</p>
        </div>
      </div>

      {/* Stat Cards with 3D Float */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map((card, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: `0 20px 25px -5px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05)`,
            transition: 'transform 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '18px', 
              background: `linear-gradient(135deg, ${card.color}15, ${card.color}30)`, 
              border: `1px solid ${card.color}40`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '28px', boxShadow: `0 10px 20px ${card.shadow}`
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>{card.label}</p>
              <p style={{ fontSize: '34px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Pie Chart Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', borderRadius: '28px', padding: '32px', 
          border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Submission Status</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>Overview of grading progress</p>
          {data.totalSubmissions === 0 ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>Data unavailable</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.statusBreakdown} cx="50%" cy="50%" innerRadius={85} outerRadius={115} paddingAngle={8} dataKey="value" stroke="none">
                  {data.statusBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color}40)` }} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', borderRadius: '28px', padding: '32px', 
          border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Performance by Difficulty</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>Success rate across levels</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.difficultyBreakdown} barGap={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomTooltip />} />
              <Bar dataKey="submissions" name="Total" fill="#4d70ff" radius={[8, 8, 0, 0]} barSize={30} />
              <Bar dataKey="accepted" name="Accepted" fill="#06D6A0" radius={[8, 8, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vertical Performance Table */}
      <div style={{ 
        background: 'rgba(255,255,255,0.02)', borderRadius: '28px', padding: '32px', 
        border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
      }}>
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Assignment Performance</h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Detailed completion analysis</p>
        </div>

        {data.assignmentPerformance.length === 0 ? (
          <p style={{ color: '#475569', textAlign: 'center', padding: '60px' }}>No records found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '32px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.assignmentPerformance} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="title" width={140} tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomTooltip />} />
                <Bar dataKey="accepted" stackId="v" fill="#06D6A0" barSize={18} radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="v" fill="#FFD23F" barSize={18} />
                <Bar dataKey="needs_improvement" stackId="v" fill="#EF476F" barSize={18} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Acceptance Progress List */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Acceptance Rates</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                {data.assignmentPerformance.map((ap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <p style={{ fontSize: '14px', color: '#f1f5f9', width: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ap.title}</p>
                    <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', width: `${ap.acceptanceRate}%`, 
                        background: `linear-gradient(90deg, #4d70ff, ${ap.acceptanceRate > 60 ? '#06D6A0' : '#EF476F'})`, 
                        borderRadius: '10px', boxShadow: '0 0 10px rgba(77,112,255,0.3)'
                      }} />
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: ap.acceptanceRate > 60 ? '#06D6A0' : '#EF476F', width: '45px', textAlign: 'right' }}>
                      {ap.acceptanceRate}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

















// 'use client';
// import { useState, useEffect } from 'react';
// import { AnalyticsData } from '@/types';
// import {
//   PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
// } from 'recharts';

// export default function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('/api/analytics')
//       .then(r => r.json())
//       .then(d => { setData(d); setLoading(false); });
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ width: '40px', height: '40px', border: '2px solid #4d70ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
//           <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!data) return <p style={{ color: 'var(--text-muted)' }}>Failed to load analytics.</p>;

//   const statCards = [
//     { label: 'Total Assignments', value: data.totalAssignments, icon: '📋', color: '#4d70ff' },
//     { label: 'Total Submissions', value: data.totalSubmissions, icon: '📬', color: '#7B2FBE' },
//     { label: 'Accepted', value: data.statusBreakdown.find(s => s.name === 'Accepted')?.value ?? 0, icon: '✅', color: '#06D6A0' },
//     { label: 'Needs Improvement', value: data.statusBreakdown.find(s => s.name === 'Needs Improvement')?.value ?? 0, icon: '🔄', color: '#EF476F' },
//   ];

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{ background: 'rgba(26,26,39,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px' }}>
//           {label && <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>{label}</p>}
//           {payload.map((p: any, i: number) => (
//             <p key={i} style={{ color: p.color, fontSize: '13px', fontWeight: 600 }}>{p.name}: {p.value}</p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
//           Analytics Dashboard
//         </h1>
//         <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track student performance and submission trends</p>
//       </div>

//       {/* Stat Cards */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }} className="stagger">
//         {statCards.map((card, i) => (
//           <div key={i} className="glass-card animate-fade-up" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${card.color}20`, border: `1px solid ${card.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
//               {card.icon}
//             </div>
//             <div>
//               <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{card.label}</p>
//               <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts Row */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
//         {/* Pie Chart */}
//         <div className="glass-card" style={{ padding: '28px' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
//             Submission Status
//           </h2>
//           <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Distribution of all submission statuses</p>
//           {data.totalSubmissions === 0 ? (
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', color: 'var(--text-muted)', fontSize: '14px' }}>No submission data yet</div>
//           ) : (
//             <ResponsiveContainer width="100%" height={260}>
//               <PieChart>
//                 <Pie data={data.statusBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
//                   {data.statusBreakdown.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} stroke="transparent" />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>} />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Bar Chart - Difficulty */}
//         <div className="glass-card" style={{ padding: '28px' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
//             Performance by Difficulty
//           </h2>
//           <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Submissions vs accepted by difficulty level</p>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={data.difficultyBreakdown} barGap={4}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
//               <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>} />
//               <Bar dataKey="submissions" name="Total" fill="#4d70ff" radius={[6, 6, 0, 0]} />
//               <Bar dataKey="accepted" name="Accepted" fill="#06D6A0" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Assignment Performance Table */}
//       <div className="glass-card" style={{ padding: '28px' }}>
//         <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
//           Assignment Performance
//         </h2>
//         <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Detailed breakdown per assignment</p>
//         {data.assignmentPerformance.length === 0 ? (
//           <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No data available yet.</p>
//         ) : (
//           <>
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={data.assignmentPerformance} layout="vertical" barGap={2}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
//                 <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <YAxis type="category" dataKey="title" width={130} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>} />
//                 <Bar dataKey="accepted" name="Accepted" stackId="a" fill="#06D6A0" radius={0} />
//                 <Bar dataKey="pending" name="Pending" stackId="a" fill="#FFD23F" radius={0} />
//                 <Bar dataKey="needs_improvement" name="Needs Improvement" stackId="a" fill="#EF476F" radius={[0, 6, 6, 0]} />
//               </BarChart>
//             </ResponsiveContainer>

//             {/* Acceptance Rate Table */}
//             <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
//               <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Acceptance Rates</h3>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 {data.assignmentPerformance.map((ap, i) => (
//                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                     <p style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '200px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ap.title}</p>
//                     <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
//                       <div style={{ height: '100%', width: `${ap.acceptanceRate}%`, background: 'linear-gradient(90deg, #4d70ff, #06D6A0)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
//                     </div>
//                     <p style={{ fontSize: '13px', fontWeight: 700, color: ap.acceptanceRate > 50 ? '#06D6A0' : '#EF476F', width: '40px', textAlign: 'right' }}>
//                       {ap.acceptanceRate}%
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
