import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, CheckSquare, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <CheckSquare size={24} color="#6366f1" />
        <span style={styles.logoText}>TaskFlow</span>
      </div>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/tasks" style={styles.link}>My Tasks</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" style={styles.adminLink}>
            <Shield size={14} />
            Admin Panel
          </Link>
        )}
      </div>
      <div style={styles.right}>
        <span style={styles.username}>
          {user?.role === 'admin' ? '👑' : '👋'} {user?.name}
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 32px', background: '#0f172a',
    borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontSize: '20px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '0.5px' },
  links: { display: 'flex', gap: '24px', alignItems: 'center' },
  link: { color: '#94a3b8', textDecoration: 'none', fontSize: '15px', fontWeight: '500' },
  adminLink: { color: '#f59e0b', textDecoration: 'none', fontSize: '15px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '6px', background: '#451a03',
    padding: '6px 12px', borderRadius: '8px', border: '1px solid #92400e' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { color: '#94a3b8', fontSize: '14px' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
    background: '#1e293b', color: '#f87171', border: '1px solid #334155',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
};

export default Navbar;