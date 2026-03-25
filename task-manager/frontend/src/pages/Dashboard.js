import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle, Clock, ListTodo, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/tasks/analytics')
      .then(res => { setAnalytics(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.loading}>Loading analytics...</div>
    </div>
  );

  const pieData = [
    { name: 'Done', value: analytics?.completed || 0 },
    { name: 'In Progress', value: analytics?.inProgress || 0 },
    { name: 'Todo', value: analytics?.todo || 0 },
  ];

  const barData = [
    { name: 'Total', value: analytics?.total || 0 },
    { name: 'Done', value: analytics?.completed || 0 },
    { name: 'In Progress', value: analytics?.inProgress || 0 },
    { name: 'Todo', value: analytics?.todo || 0 },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#6366f1'];

  const statCards = [
    { label: 'Total Tasks', value: analytics?.total || 0, icon: <ListTodo size={22} />, color: '#6366f1', bg: '#1e1b4b' },
    { label: 'Completed', value: analytics?.completed || 0, icon: <CheckCircle size={22} />, color: '#22c55e', bg: '#052e16' },
    { label: 'In Progress', value: analytics?.inProgress || 0, icon: <Clock size={22} />, color: '#f59e0b', bg: '#451a03' },
    { label: 'Completion %', value: `${analytics?.completionPercentage || 0}%`, icon: <BarChart2 size={22} />, color: '#a78bfa', bg: '#2e1065' },
  ];

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>📊 Analytics Dashboard</h1>
        <p style={styles.sub}>Track your productivity at a glance</p>

        <div style={styles.statsGrid}>
          {statCards.map((card, i) => (
            <div key={i} style={{ ...styles.statCard, background: card.bg, borderColor: card.color + '44' }}>
              <div style={{ ...styles.statIcon, color: card.color }}>{card.icon}</div>
              <div style={{ ...styles.statValue, color: card.color }}>{card.value}</div>
              <div style={styles.statLabel}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Task Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90}
                  dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Task Overview</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 13 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 13 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {analytics?.total > 0 && (
          <div style={styles.progressCard}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Overall Completion</span>
              <span style={styles.progressValue}>{analytics.completionPercentage}%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${analytics.completionPercentage}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '36px 24px' },
  heading: { color: '#e2e8f0', fontSize: '28px', fontWeight: '800', margin: '0 0 6px' },
  sub: { color: '#64748b', fontSize: '15px', marginBottom: '32px' },
  loading: { color: '#94a3b8', textAlign: 'center', marginTop: '100px', fontSize: '18px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' },
  statCard: { borderRadius: '16px', padding: '24px', border: '1px solid', display: 'flex', flexDirection: 'column', gap: '10px' },
  statIcon: { display: 'flex' },
  statValue: { fontSize: '36px', fontWeight: '800' },
  statLabel: { color: '#94a3b8', fontSize: '14px', fontWeight: '500' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' },
  chartCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' },
  chartTitle: { color: '#e2e8f0', fontSize: '16px', fontWeight: '700', margin: '0 0 20px' },
  progressCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  progressLabel: { color: '#94a3b8', fontSize: '15px', fontWeight: '600' },
  progressValue: { color: '#6366f1', fontSize: '15px', fontWeight: '700' },
  progressBar: { background: '#0f172a', borderRadius: '999px', height: '12px', overflow: 'hidden' },
  progressFill: { background: 'linear-gradient(90deg, #6366f1, #22c55e)', height: '100%', borderRadius: '999px', transition: 'width 0.5s ease' },
};

export default Dashboard;