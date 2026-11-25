import React, { useState } from 'react';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard/dashboard';
import Register from './pages/Register/register';

// Token ichidan rolni va muddatini xavfsiz o'qiydi (server baribir har so'rovda tekshiradi)
const readToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const p = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (p.exp && p.exp * 1000 < Date.now()) { localStorage.clear(); return null; }
    return { role: p.role, id: p.id };
  } catch { localStorage.clear(); return null; }
};

function App() {
  const [auth, setAuth] = useState(readToken);
  const params = new URLSearchParams(window.location.search);

  // Taklif havolasi: /register?token=...
  if (window.location.pathname === '/register' && params.get('token')) {
    return <Register token={params.get('token')} />;
  }
  const logout = () => { localStorage.clear(); setAuth(null); };

  if (!auth) return <Login onLoginSuccess={() => setAuth(readToken())} />;
  if (auth.role === 'coordinator') return <Dashboard onLogout={logout} />;

  // Mentor va amaliyotchi kabinetlari keyingi bosqichda (backend API'lari tayyor)
  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h2>{auth.role === 'mentor' ? 'Mentor kabineti' : 'Amaliyotchi kabineti'}</h2>
      <p>Bu kabinet ustida ish davom etmoqda.</p>
      <button onClick={logout}>Chiqish</button>
    </div>
  );
}
export default App;
