import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getStats } from '../api';

const DEVICE_COLORS  = ['#057a55', '#f05252', '#e3a008'];
const TICKET_COLORS  = ['#f05252', '#e3a008', '#057a55'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then(r => setStats(r.data))
      .catch(() => setError('Could not connect to backend. Is it running?'));
  }, []);

  if (error)  return <p style={{ color: '#f05252' }}>{error}</p>;
  if (!stats) return <p style={{ color: '#6b7280' }}>Loading stats...</p>;

  const deviceData = [
    { name: 'Online',      value: stats.devices.online },
    { name: 'Offline',     value: stats.devices.offline },
    { name: 'Maintenance', value: stats.devices.maintenance },
  ];
  const ticketData = [
    { name: 'Open',        value: stats.tickets.open },
    { name: 'In Progress', value: stats.tickets.in_progress },
    { name: 'Closed',      value: stats.tickets.closed },
  ];

  return (
    <div>
      <h1 style={styles.pageTitle}>Overview</h1>

      {/* Stat cards */}
      <div style={styles.cardGrid}>
        <StatCard label="Total Devices"   value={stats.devices.total}         color="#1a56db" />
        <StatCard label="Online"          value={stats.devices.online}        color="#057a55" />
        <StatCard label="Offline"         value={stats.devices.offline}       color="#f05252" />
        <StatCard label="Open Tickets"    value={stats.tickets.open}          color="#f05252" />
        <StatCard label="In Progress"     value={stats.tickets.in_progress}   color="#e3a008" />
        <StatCard label="High Priority"   value={stats.tickets.high_priority} color="#c81e1e" />
      </div>

      {/* Charts */}
      <div style={styles.chartRow}>
        <ChartBox title="Device Status">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={deviceData} dataKey="value" nameKey="name"
                   outerRadius={85} label={({ name, value }) => `${name}: ${value}`}>
                {deviceData.map((_, i) => <Cell key={i} fill={DEVICE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Ticket Status">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ticketData} barSize={40}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {ticketData.map((_, i) => <Cell key={i} fill={TICKET_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div style={styles.chartBox}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {children}
    </div>
  );
}

const styles = {
  pageTitle: { fontSize: 22, fontWeight: 600, marginBottom: 20, color: '#111827' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    background: '#f9fafb',
    borderRadius: 8,
    padding: '16px 20px',
    border: '1px solid #e5e7eb',
  },
  cardLabel: { fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: 500 },
  cardValue: { fontSize: 30, fontWeight: 700 },
  chartRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  chartBox: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '16px 20px',
    flex: 1,
    minWidth: 280,
  },
  chartTitle: { fontSize: 15, fontWeight: 600, marginBottom: 12, color: '#374151' },
};
