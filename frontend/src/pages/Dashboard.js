import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#e67e22', '#2980b9', '#27ae60', '#7f8c8d'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get('/tickets/stats/summary')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center">Loading dashboard...</div>;
  if (!stats) return <div className="page-center">Could not load stats.</div>;

  const statusData = stats.statusCounts.map((s) => ({ name: s._id, value: s.count }));
  const categoryData = stats.categoryCounts.map((c) => ({ name: c._id, count: c.count }));

  return (
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <p className="subtitle">Here's an overview of {user.role === 'user' ? 'your' : 'all'} tickets.</p>

      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Tickets</span>
        </div>
        {statusData.map((s) => (
          <div className="stat-box" key={s.name}>
            <span className="stat-number">{s.value}</span>
            <span className="stat-label">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Tickets by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2980b9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
