import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Layers, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://projects-back.siradzu.com/api/login', { email, password });
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
    <div className="login-page">
      <Toaster position="top-center" />
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Layers size={32} color="#2563eb" />
          </div>
          <h1>SIRADZU Admin</h1>
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
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
        }
        .login-card {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 450px;
          border: 1px solid #f1f5f9;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-logo {
          width: 64px;
          height: 64px;
          background: #eff6ff;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .login-header h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .login-header p { color: #64748b; font-size: 0.9rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.6rem; }
        .form-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.95rem;
          transition: 0.2s;
        }
        .form-group input:focus { border-color: #2563eb; outline: none; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .btn-login {
          width: 100%;
          padding: 0.9rem;
          border-radius: 12px;
          background: #2563eb;
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
        .btn-login:hover { background: #1d4ed8; transform: translateY(-2px); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default LoginPage;
