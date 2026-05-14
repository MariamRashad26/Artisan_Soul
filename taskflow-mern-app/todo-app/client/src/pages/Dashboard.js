import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PRIORITY_COLORS = {
  low: 'var(--priority-low)',
  medium: 'var(--priority-medium)',
  high: 'var(--priority-high)',
  urgent: 'var(--priority-urgent)',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  if (!stats) return <div className="empty-state"><div>Failed to load dashboard</div></div>;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.totalTasks, icon: '📋', color: 'var(--info)', bg: 'var(--info-bg)' },
    { label: 'Completed', value: stats.completedTasks, icon: '✅', color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Pending', value: stats.pendingTasks, icon: '⏳', color: 'var(--warning)', bg: 'var(--warning-bg)' },
    { label: 'Overdue', value: stats.overdueTasks, icon: '🔴', color: 'var(--danger)', bg: 'var(--danger-bg)' },
    { label: 'Due Today', value: stats.dueTodayTasks, icon: '📅', color: 'var(--accent)', bg: 'var(--accent-subtle)' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: '🎯', color: 'var(--success)', bg: 'var(--success-bg)' },
  ];

  const pieData = stats.priorityBreakdown.map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.count,
    color: PRIORITY_COLORS[p._id],
  }));

  const trendData = stats.completionTrend.map(d => ({
    date: format(new Date(d._id), 'MMM d'),
    completed: d.count,
  }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">{format(new Date(), 'EEEE, MMMM d, yyyy')} — Here's your productivity overview</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
          + New Task
        </button>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="stat-card"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
            <div className="stat-card-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        {/* Completion Trend */}
        <div className="chart-card">
          <div className="chart-title">📈 Completions (Last 7 Days)</div>
          {trendData.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Complete tasks to see your trend</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                  }}
                />
                <Bar dataKey="completed" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Priority Breakdown */}
        <div className="chart-card">
          <div className="chart-title">🎯 Priority Breakdown</div>
          {pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No tasks yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '0.78rem' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Progress + Recent Activity */}
      <div className="dashboard-charts">
        {/* Category Progress */}
        <div className="chart-card">
          <div className="chart-title">📁 Categories</div>
          <div className="progress-bar-container">
            {stats.categoryBreakdown.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No categories yet</p>
            ) : stats.categoryBreakdown.map((cat) => {
              const rate = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
              return (
                <div className="progress-item" key={cat._id}>
                  <div className="progress-item-header">
                    <span>{cat._id}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{cat.completed}/{cat.count} ({rate}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${rate}%`, background: rate === 100 ? 'var(--success)' : 'var(--accent)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="chart-card">
          <div className="chart-title">🕐 Recent Activity</div>
          <div className="activity-list">
            {stats.recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent activity</p>
            ) : stats.recentActivity.map((task) => (
              <div className="activity-item" key={task._id}>
                <div
                  className="activity-dot"
                  style={{ background: task.completed ? 'var(--success)' : 'var(--accent)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {task.completed ? '✓ Completed' : '⏳ Pending'} · {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                  </div>
                </div>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
