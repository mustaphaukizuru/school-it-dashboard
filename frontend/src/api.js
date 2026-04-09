import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const getStats     = ()       => axios.get(`${BASE}/stats/`);
export const getDevices   = ()       => axios.get(`${BASE}/devices/`);
export const addDevice    = (d)      => axios.post(`${BASE}/devices/`, d);
export const updateDevice = (id, d)  => axios.patch(`${BASE}/devices/${id}/`, d);
export const deleteDevice = (id)     => axios.delete(`${BASE}/devices/${id}/`);
export const getTickets   = ()       => axios.get(`${BASE}/tickets/`);
export const addTicket    = (t)      => axios.post(`${BASE}/tickets/`, t);
export const updateTicket = (id, t)  => axios.patch(`${BASE}/tickets/${id}/`, t);
export const deleteTicket = (id)     => axios.delete(`${BASE}/tickets/${id}/`);
