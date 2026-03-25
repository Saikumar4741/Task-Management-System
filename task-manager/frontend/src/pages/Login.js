import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <CheckSquare size={36} color="#6366f1" />
          <h1 style={styles.brand}>TaskFlow</h1>
        </div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required style={styles.input} />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0f172a', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '20px',
    padding: '40px', width: '100%', maxWidth: '420px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '24px' },
  brand: { color: '#e2e8f0', fontSize: '26px', fontWeight: '800', margin: 0 },
  title: { color: '#e2e8f0', fontSize: '22px', fontWeight: '700', margin: '0 0 6px', textAlign: 'center' },
  sub: { color: '#64748b', fontSize: '15px', textAlign: 'center', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#94a3b8', fontSize: '13px', fontWeight: '600' },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px',
    padding: '12px 14px', color: '#e2e8f0', fontSize: '15px', outline: 'none',
    fontFamily: 'inherit' },
  btn: { padding: '13px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px',
    fontWeight: '700', cursor: 'pointer', marginTop: '4px' },
  footer: { color: '#64748b', fontSize: '14px', textAlign: 'center', marginTop: '24px' },
  link: { color: '#6366f1', textDecoration: 'none', fontWeight: '600' },
};

export default Login;