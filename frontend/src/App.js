import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Tickets from './pages/Tickets';

function Nav() {
  const location = useLocation();
  const active = (path) => ({
    ...styles.link,
    ...(location.pathname === path ? styles.activeLink : {}),
  });
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🖥️ School IT Dashboard</span>
      <div style={styles.navLinks}>
        <Link style={active('/')} to="/">Dashboard</Link>
        <Link style={active('/devices')} to="/devices">Devices</Link>
        <Link style={active('/tickets')} to="/tickets">Tickets</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div style={styles.content}>
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    background: '#1a56db',
    padding: '14px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: '-0.3px',
  },
  navLinks: {
    display: 'flex',
    gap: 8,
  },
  link: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 14,
    padding: '6px 14px',
    borderRadius: 6,
    fontWeight: 400,
  },
  activeLink: {
    color: '#fff',
    background: 'rgba(255,255,255,0.15)',
    fontWeight: 600,
  },
  content: {
    padding: '28px',
    maxWidth: 1100,
    margin: '0 auto',
  },
};
