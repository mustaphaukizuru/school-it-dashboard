import React, { useEffect, useState } from 'react';
import { getTickets, addTicket, updateTicket, deleteTicket, getDevices } from '../api';

const PRIORITY_COLORS = {
  low:    { bg: '#f0fdf4', text: '#057a55', border: '#bbf7d0' },
  medium: { bg: '#fffbeb', text: '#e3a008', border: '#fde68a' },
  high:   { bg: '#fef2f2', text: '#f05252', border: '#fecaca' },
};
const STATUS_COLORS = {
  open:        { bg: '#fef2f2', text: '#f05252' },
  in_progress: { bg: '#fffbeb', text: '#e3a008' },
  closed:      { bg: '#f0fdf4', text: '#057a55' },
};
const STATUS_NEXT = { open: 'in_progress', in_progress: 'closed', closed: 'open' };
const STATUS_LABEL = { open: 'Open', in_progress: 'In Progress', closed: 'Closed' };

const EMPTY_FORM = { title: '', description: '', priority: 'medium', status: 'open', device: '' };

export default function Tickets() {
  const [tickets, setTickets]   = useState([]);
  const [devices, setDevices]   = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [filterStatus, setFilter] = useState('all');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getTickets(), getDevices()])
      .then(([t, d]) => {
        setTickets(t.data);
        setDevices(d.data);
        setLoading(false);
      })
      .catch(() => { setError('Could not load tickets.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, device: form.device || null };
    const action  = editId ? updateTicket(editId, payload) : addTicket(payload);
    action.then(() => { load(); setForm(EMPTY_FORM); setEditId(null); });
  };

  const handleEdit = (ticket) => {
    setEditId(ticket.id);
    setForm({
      title:       ticket.title,
      description: ticket.description,
      priority:    ticket.priority,
      status:      ticket.status,
      device:      ticket.device || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this ticket?')) deleteTicket(id).then(load);
  };

  const cycleStatus = (ticket) => {
    updateTicket(ticket.id, { status: STATUS_NEXT[ticket.status] }).then(load);
  };

  const cancelEdit = () => { setForm(EMPTY_FORM); setEditId(null); };

  const visible = filterStatus === 'all'
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  return (
    <div>
      <h1 style={s.pageTitle}>Tickets</h1>

      {/* Form */}
      <div style={s.formCard}>
        <h3 style={s.formTitle}>{editId ? 'Edit Ticket' : 'Create New Ticket'}</h3>
        <form onSubmit={handleSubmit} style={s.form}>
          <input
            required placeholder="Ticket title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ ...s.input, minWidth: 200 }}
          />
          <input
            required placeholder="Description of the issue"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...s.input, flex: 2, minWidth: 200 }}
          />
          <select value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })} style={s.input}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <select value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })} style={s.input}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select value={form.device}
            onChange={e => setForm({ ...form, device: e.target.value })} style={s.input}>
            <option value="">No device linked</option>
            {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button type="submit" style={s.btnPrimary}>
            {editId ? 'Save Changes' : 'Create Ticket'}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} style={s.btnSecondary}>Cancel</button>
          )}
        </form>
      </div>

      {/* Filter bar */}
      <div style={s.filterBar}>
        {['all', 'open', 'in_progress', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.filterBtn, ...(filterStatus === f ? s.filterActive : {}) }}>
            {f === 'all' ? 'All' : STATUS_LABEL[f]}
            <span style={s.filterCount}>
              {f === 'all' ? tickets.length : tickets.filter(t => t.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error   && <p style={{ color: '#f05252' }}>{error}</p>}
      {!loading && !error && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Title', 'Description', 'Priority', 'Status', 'Device', 'Created', 'Actions']
                  .map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={7} style={{ ...s.td, color: '#9ca3af', textAlign: 'center' }}>
                  No tickets found.
                </td></tr>
              )}
              {visible.map(t => {
                const pc = PRIORITY_COLORS[t.priority];
                const sc = STATUS_COLORS[t.status];
                return (
                  <tr key={t.id} style={s.tr}>
                    <td style={{ ...s.td, fontWeight: 500, maxWidth: 160 }}>{t.title}</td>
                    <td style={{ ...s.td, color: '#6b7280', maxWidth: 200,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </td>
                    <td style={s.td}>
                      <span style={{ background: pc.bg, color: pc.text,
                        border: `1px solid ${pc.border}`,
                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                        {t.priority}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ background: sc.bg, color: sc.text,
                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                        {STATUS_LABEL[t.status]}
                      </span>
                    </td>
                    <td style={s.td}>{t.device_name || '—'}</td>
                    <td style={{ ...s.td, color: '#9ca3af', fontSize: 12 }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td style={s.td}>
                      <button onClick={() => cycleStatus(t)} style={s.btnSm}>
                        → {STATUS_LABEL[STATUS_NEXT[t.status]]}
                      </button>
                      <button onClick={() => handleEdit(t)} style={s.btnSm}>Edit</button>
                      <button onClick={() => handleDelete(t.id)}
                        style={{ ...s.btnSm, color: '#f05252', borderColor: '#fca5a5' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  pageTitle:    { fontSize: 22, fontWeight: 600, marginBottom: 20, color: '#111827' },
  formCard:     { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 20 },
  formTitle:    { fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#374151' },
  form:         { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  input:        { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 },
  btnPrimary:   { padding: '8px 18px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  btnSecondary: { padding: '8px 18px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  btnSm:        { padding: '4px 10px', marginRight: 4, border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#374151', whiteSpace: 'nowrap' },
  filterBar:    { display: 'flex', gap: 8, marginBottom: 16 },
  filterBtn:    { padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13, background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', gap: 6 },
  filterActive: { background: '#1a56db', color: '#fff', borderColor: '#1a56db' },
  filterCount:  { background: 'rgba(0,0,0,0.12)', borderRadius: 10, padding: '1px 7px', fontSize: 11 },
  tableWrap:    { overflowX: 'auto' },
  table:        { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' },
  th:           { padding: '11px 16px', textAlign: 'left', background: '#f9fafb', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' },
  tr:           { borderBottom: '1px solid #f3f4f6' },
  td:           { padding: '12px 16px', fontSize: 13, color: '#374151' },
};
