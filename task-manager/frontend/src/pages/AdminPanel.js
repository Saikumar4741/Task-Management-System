import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Trash2, Users, ClipboardList, Shield } from 'lucide-react';

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, usersRes] = await Promise.all([
        axios.get('/admin/tasks'),
        axios.get('/admin/users')
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`/admin/tasks/${id}`);
      toast.success('Task deleted!');
      fetchData();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const priorityColors = {
    High: { bg: '#450a0a', text: '#fca5a5' },
    Medium: { bg: '#451a03', text: '#fdba74' },
    Low: { bg: '#052e16', text: '#86efac' },
  };

  const statusColors = {
    'Todo': { bg: '#1e1b4b', text: '#a5b4fc' },
    'In Progress': { bg: '#1c1917', text: '#fcd34d' },
    'Done': { bg: '#052e16', text: '#86efac' },
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <Shield size={32} color="#f59e0b" />
          <h1 style={{ color: '#e2e8f0', fontSize: '28px', fontWeight: '800', margin: 0 }}>
            Admin Panel
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
          Manage all users and tasks across the platform
        </p>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#1e1b4b', border: '1px solid #3730a344', borderRadius: '16px', padding: '24px' }}>
            <ClipboardList size={22} color="#6366f1" />
            <div style={{ color: '#6366f1', fontSize: '36px', fontWeight: '800', margin: '10px 0 4px' }}>
              {tasks.length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Tasks</div>
          </div>
          <div style={{ background: '#052e16', border: '1px solid #16653444', borderRadius: '16px', padding: '24px' }}>
            <Users size={22} color="#22c55e" />
            <div style={{ color: '#22c55e', fontSize: '36px', fontWeight: '800', margin: '10px 0 4px' }}>
              {users.length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Users</div>
          </div>
          <div style={{ background: '#451a03', border: '1px solid #92400e44', borderRadius: '16px', padding: '24px' }}>
            <Shield size={22} color="#f59e0b" />
            <div style={{ color: '#f59e0b', fontSize: '36px', fontWeight: '800', margin: '10px 0 4px' }}>
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Admins</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b',
          borderRadius: '12px', padding: '4px', width: 'fit-content', marginBottom: '24px' }}>
          <button onClick={() => setActiveTab('tasks')}
            style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
              background: activeTab === 'tasks' ? '#6366f1' : 'transparent',
              color: activeTab === 'tasks' ? '#fff' : '#94a3b8' }}>
            <ClipboardList size={16} /> All Tasks
          </button>
          <button onClick={() => setActiveTab('users')}
            style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
              background: activeTab === 'users' ? '#6366f1' : 'transparent',
              color: activeTab === 'users' ? '#fff' : '#94a3b8' }}>
            <Users size={16} /> All Users
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '60px', fontSize: '18px' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* ALL TASKS TAB */}
            {activeTab === 'tasks' && (
              <div style={{ background: '#1e293b', borderRadius: '16px',
                border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['Task Title', 'Owner', 'Status', 'Priority', 'Due Date', 'Action'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', color: '#64748b',
                          fontSize: '12px', fontWeight: '700', textAlign: 'left',
                          textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                          No tasks found
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task, i) => (
                        <tr key={task._id}
                          style={{ borderTop: '1px solid #334155',
                            background: i % 2 === 0 ? 'transparent' : '#ffffff08' }}>
                          <td style={{ padding: '14px 20px', color: '#e2e8f0',
                            fontSize: '14px', fontWeight: '500', maxWidth: '200px' }}>
                            {task.title}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ color: '#e2e8f0', fontSize: '14px' }}>{task.user?.name}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{task.user?.email}</div>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                              fontWeight: '600', background: statusColors[task.status]?.bg,
                              color: statusColors[task.status]?.text }}>
                              {task.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                              fontWeight: '600', background: priorityColors[task.priority]?.bg,
                              color: priorityColors[task.priority]?.text }}>
                              {task.priority}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <button onClick={() => handleDeleteTask(task._id)}
                              style={{ background: '#3b0f0f', border: 'none', borderRadius: '8px',
                                padding: '8px', color: '#f87171', cursor: 'pointer',
                                display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ALL USERS TAB */}
            {activeTab === 'users' && (
              <div style={{ background: '#1e293b', borderRadius: '16px',
                border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['Name', 'Email', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', color: '#64748b',
                          fontSize: '12px', fontWeight: '700', textAlign: 'left',
                          textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user, i) => (
                        <tr key={user._id}
                          style={{ borderTop: '1px solid #334155',
                            background: i % 2 === 0 ? 'transparent' : '#ffffff08' }}>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '14px' }}>
                            {user.email}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                              fontWeight: '700',
                              background: user.role === 'admin' ? '#451a03' : '#1e1b4b',
                              color: user.role === 'admin' ? '#f59e0b' : '#a5b4fc' }}>
                              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;