import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { API_BASE } from '../config';
import logoImg from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon) {
      favicon.href = theme === 'dark' ? '/favicon-white.png' : '/favicon.png';
    }
  }, [theme]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/login`, { email, password });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Xoş gəldiniz!');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      toast.error('Məlumatlar yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme === 'dark' ? '' : 'light-theme'}`}>
      <Toaster position="top-center" />
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">
            <img src={logoImg} alt="SIRADZU" />
          </div>
          <h1>Admin Panel</h1>
          <p>Daxil olmaq üçün məlumatları doldurun</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input
              type="email"
              placeholder="admin@texnocode.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Şifrə</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Yüklənir...' : 'Daxil Ol'} <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0A1029;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.3s;
        }
        .login-page.light-theme {
          background: #F7F7F7;
        }
        .login-card {
          background: #0d1430;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 450px;
          border: 1px solid rgba(155, 167, 184, 0.15);
          transition: background-color 0.3s, border-color 0.3s;
        }
        .login-page.light-theme .login-card {
          background: #FFFFFF;
          border-color: rgba(155, 167, 184, 0.2);
          box-shadow: 0 20px 50px rgba(10, 16, 41, 0.05);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-logo {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .login-logo img {
          height: 100%;
          width: auto;
          object-fit: contain;
          transition: filter 0.3s;
        }
        .login-page:not(.light-theme) .login-logo img {
          filter: brightness(0) invert(1);
        }
        .login-header h1 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.5rem; }
        .login-page.light-theme .login-header h1 { color: #0A1029; }
        .login-header p { color: #9BA7B8; font-size: 0.9rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #9BA7B8; margin-bottom: 0.6rem; }
        .form-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(155, 167, 184, 0.2);
          background: #0A1029;
          color: #FFFFFF;
          font-size: 0.95rem;
          transition: 0.2s;
        }
        .login-page.light-theme .form-group input {
          background: #FFFFFF;
          color: #0A1029;
          border-color: rgba(155, 167, 184, 0.3);
        }
        .form-group input:focus { border-color: #3b82f6; outline: none; background: #0A1029; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); }
        .login-page.light-theme .form-group input:focus { background: #FFFFFF; }
        .btn-login {
          width: 100%;
          padding: 0.9rem;
          border-radius: 12px;
          background: #3b82f6;
          color: white;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-login:hover { background: #2563eb; transform: translateY(-2px); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default LoginPage;
