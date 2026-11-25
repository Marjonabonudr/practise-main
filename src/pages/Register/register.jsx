import React, { useState } from 'react';
import api, { errMsg } from '../../api';

// Taklif havolasi orqali parol o'rnatish (rol va email tokenning ichida, foydalanuvchi o'zgartira olmaydi)
export default function Register({ token }) {
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Parol kamida 8 belgidan iborat bo‘lsin');
    if (password !== again) return setError('Parollar mos kelmadi');
    setBusy(true);
    try {
      await api.post('/users/register', { token, password });
      setDone(true);
    } catch (err) { setError(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ maxWidth: 380, margin: '4rem auto', padding: '1rem' }}>
      <h2>Akkauntni faollashtirish</h2>
      {done ? (
        <>
          <p>Akkaunt yaratildi. Endi tizimga kirishingiz mumkin.</p>
          <button onClick={() => { window.location.href = '/'; }}>Kirish sahifasiga o‘tish</button>
        </>
      ) : (
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <input type="password" placeholder="Yangi parol (8+ belgi)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Parolni takrorlang" value={again} onChange={(e) => setAgain(e.target.value)} required />
          {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          <button type="submit" disabled={busy}>{busy ? 'Saqlanmoqda...' : 'Akkaunt yaratish'}</button>
        </form>
      )}
    </div>
  );
}
