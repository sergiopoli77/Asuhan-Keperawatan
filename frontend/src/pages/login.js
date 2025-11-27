import React, { useState } from 'react';
import '../assets/Login.css';
import { db } from '../config/firebase';
import { ref, get } from 'firebase/database';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('perawat');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    const name = (username || '').trim();
    if (!name || !password) {
      setError('Username dan password wajib diisi!');
      setLoading(false);
      return;
    }
//sadasd
    try {
      // look for users inside `perawat` node (signup stores perawat accounts)
      const usersRef = ref(db, 'perawat');
      const snap = await get(usersRef);

      if (!snap.exists()) {
        setError('User tidak ditemukan.');
        setLoading(false);
        return;
      }

      let userRecord = null;
      let uid = null;

      // Pencarian username case-insensitive
      snap.forEach((child) => {
        const data = child.val();
        if (
          data.nama &&
          data.nama.toLowerCase().trim() === name.toLowerCase().trim()
        ) {
          userRecord = data;
          uid = child.key;
        }
      });

      if (!userRecord) {
        setError('User tidak ditemukan.');
        setLoading(false);
        return;
      }

      // validasi password
      if (String(userRecord.password).trim() === String(password).trim()) {
        const displayName = userRecord.nama || name;
        const userRole = userRecord.role
          ? userRecord.role.toLowerCase()
          : role;

        // Kirim ke App.js (pindah ke dashboard)
        onLogin({ username: displayName, role: userRole, uid });
        setLoading(false);
        return;
      }

      setError('Password salah.');
      setLoading(false);

    } catch (err) {
      console.error('Login RTDB error:', err);
      // surface the real error message to help debugging (e.g. permission-denied)
      const msg = err && err.message ? err.message : 'Terjadi error saat verifikasi. Cek koneksi.';
      setError(`Terjadi error saat verifikasi: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="medical-icon">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#00B4D8"/>
              <circle cx="12" cy="12" r="10" stroke="#0077B6" strokeWidth="2" fill="none"/>
              <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Sistem Asuhan Keperawatan devops</h1>
          <p>Platform Digital untuk Profesional Kesehatan</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Masuk ke Akun Anda</h2>
          {error && <div className="error">{error}</div>}

          <div className="input-group">
            <label htmlFor="role">Peran</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="perawat">👩‍⚕️ Perawat</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading} aria-busy={loading}>
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
          <div style={{marginTop:12,fontSize:13, textAlign: 'center'}}>
            Belum punya akun? <a href="/signup">Daftar di sini</a>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2025 Sistem Asuhan Keperawatan</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
