import React, { useEffect, useState } from 'react';
import { getDevices, addDevice, updateDevice, deleteDevice } from '../api';

const STATUS_COLORS = {
  online:      { bg: '#f0fdf4', text: '#057a55', border: '#bbf7d0' },
  offline:     { bg: '#fef2f2', text: '#f05252', border: '#fecaca' },
  maintenance: { bg: '#fffbeb', text: '#e3a008', border: '#fde68a' },
};

const EMPTY_FORM = { name: '', ip_address: '', status: 'online', location: '' };

export default function Devices() {
  const [devices, setDevices]   = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = () => {
    setLoading(true);
    getDevices()
      .then(r => { setDevices(r.data); setLoading(false); })
      .catch(() => { setError('Could not load devices.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editId ? updateDevice(editId, form) : addDevice(form);
    action.then(() => {
      load();
      setForm(EMPTY_FORM);
      setEditId(null);
    });
  };

  const handleEdit = (device) => {
    setEditId(device.id);
    setForm({
      name:       device.name,
      ip_address: device.ip_address,
      status:     device.status,
      location:   device.location || '',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this device?')) {
      deleteDevice(id).then(load);
    }
  };

  const handleToggle = (device) => {
    const next = device.status === 'online' ? 'offline' : 'online';
    updateDevice(device.id, { status: next }).then(load);
  };

  const cancelEdit = () => { setForm(EMPTY_FORM); setEditId(null); };

  return (
    <div>
      <h1 style={s.pageTitle}>Devices</h1>

      {/* Form */}
      <div style={s.formCard}>
        <h3 style={s.formTitle}>{editId ? 'Edit Device' : 'Add New Device'}</h3>
        <form onSubmit={handleSubmit} style={s.form}>
          <input
            required placeholder="Device name (e.g. Lab PC 01)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={s.input}
          />
          <input
            required placeholder="IP address (e.g. 192.168.1.10)"
            value={form.ip_address}
            onChange={e => setForm({ ...form, ip_address: e.target.value })}
            style={s.input}
          />
          <input
            placeholder="Location (e.g. Computer Lab 1)"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            style={s.input}
          />
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            style={s.input}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button type="submit" style={s.btnPrimary}>
            {editId ? 'Save Changes' : 'Add Device'}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} style={s.btnSecondary}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error   && <p style={{ color: '#f05252' }}>{error}</p>}
      {!loading && !error && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Name', 'IP Address', 'Location', 'Status', 'Uptime %', 'Open Tickets', 'Actions']
                  .map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 && (
                <tr><td colSpan={7} style={{ ...s.td, color: '#9ca3af', textAlign: 'center' }}>
                  No devices yet. Add one above.
                </td></tr>
              )}
              {devices.map(d => {
                const c = STATUS_COLORS[d.status];
                return (
                  <tr key={d.id} style={s.tr}>
                    <td style={{ ...s.td, fontWeight: 500 }}>{d.name}</td>
                    <td style={s.td}><code style={s.code}>{d.ip_address}</code></td>
                    <td style={s.td}>{d.location || '—'}</td>
                    <td style={s.td}>
                      <span style={{ background: c.bg, color: c.text,
                        border: `1px solid ${c.border}`,
                        padding: '3px 10px', borderRadius: 12,
                        fontSize: 12, fontWeight: 500 }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        color: d.uptime_percentage >= 90 ? '#057a55' :
                               d.uptime_percentage >= 70 ? '#e3a008' : '#f05252',
                        fontWeight: 600
                      }}>
                        {d.uptime_percentage}%
                      </span>
                    </td>
                    <td style={s.td}>{d.ticket_count}</td>
                    <td style={s.td}>
                      <button onClick={() => handleToggle(d)}  style={s.btnSm}>Toggle</button>
                      <button onClick={() => handleEdit(d)}    style={s.btnSm}>Edit</button>
                      <button onClick={() => handleDelete(d.id)}
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
  pageTitle:  { fontSize: 22, fontWeight: 600, marginBottom: 20, color: '#111827' },
  formCard:   { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 24 },
  formTitle:  { fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#374151' },
  form:       { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  input:      { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, outline: 'none' },
  btnPrimary: { padding: '8px 18px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  btnSecondary: { padding: '8px 18px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  btnSm:      { padding: '4px 10px', marginRight: 4, border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#374151' },
  tableWrap:  { overflowX: 'auto' },
  table:      { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' },
  th:         { padding: '11px 16px', textAlign: 'left', background: '#f9fafb', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' },
  tr:         { borderBottom: '1px solid #f3f4f6' },
  td:         { padding: '12px 16px', fontSize: 13, color: '#374151' },
  code:       { background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 },
};
