import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const theme = {
    bg: darkMode ? '#0f172a' : '#f1f5f9',
    card: darkMode ? '#1e293b' : '#ffffff',
    border: darkMode ? '#334155' : '#e2e8f0',
    text: darkMode ? '#e2e8f0' : '#1e293b',
    subtext: darkMode ? '#94a3b8' : '#64748b',
    inputBg: darkMode ? '#0f172a' : '#f8fafc',
    columnBg: darkMode ? '#1e293b' : '#ffffff',
  };

  const fetchTasks = async (currentPage = page) => {
    try {
      const params = { page: currentPage, limit: 6 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (sortBy) { params.sortBy = sortBy; params.order = order; }
      const { data } = await axios.get('/tasks', { params });
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load tasks');
    }
    setLoading(false);
  };

  useEffect(() => { setPage(1); fetchTasks(1); }, [search, statusFilter, priorityFilter, sortBy, order]);
  useEffect(() => { fetchTasks(page); }, [page]);

  const handleCreate = async (form) => {
    try {
      await axios.post('/tasks', form);
      toast.success('Task created!');
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async (form) => {
    try {
      await axios.put(`/tasks/${editTask._id}`, form);
      toast.success('Task updated!');
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      toast.success('Task deleted!');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const grouped = {
    'Todo': tasks.filter(t => t.status === 'Todo'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  const columnColors = {
    'Todo': '#6366f1',
    'In Progress': '#f59e0b',
    'Done': '#22c55e',
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', transition: 'all 0.3s' }}>
      <Navbar darkMode={darkMode} theme={theme} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: theme.text, fontSize: '28px', fontWeight: '800', margin: '0 0 4px' }}>📋 My Tasks</h1>
            <p style={{ color: theme.subtext, fontSize: '14px', margin: 0 }}>{total} task{total !== 1 ? 's' : ''} total</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ padding: '10px 16px', background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: '10px', color: theme.text, cursor: 'pointer', fontSize: '18px' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none',
                borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: theme.card,
            border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px 16px', flex: 1, minWidth: '180px' }}>
            <Search size={16} color={theme.subtext} />
            <input placeholder="Search tasks..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: theme.text,
                fontSize: '15px', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Filter size={16} color={theme.subtext} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px',
                padding: '10px 14px', color: theme.subtext, fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Status</option>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px',
                padding: '10px 14px', color: theme.subtext, fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <ArrowUpDown size={16} color={theme.subtext} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px',
                padding: '10px 14px', color: theme.subtext, fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
              <option value="">Sort By</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}
              style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px',
                padding: '10px 14px', color: theme.subtext, fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div style={{ color: theme.subtext, textAlign: 'center', marginTop: '60px', fontSize: '18px' }}>
            Loading tasks...
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {Object.entries(grouped).map(([status, list]) => (
                <div key={status} style={{ background: theme.columnBg, borderRadius: '16px',
                  padding: '20px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%',
                      background: columnColors[status], display: 'inline-block' }} />
                    <span style={{ color: theme.text, fontWeight: '700', fontSize: '15px', flex: 1 }}>{status}</span>
                    <span style={{ background: theme.inputBg, color: theme.subtext, borderRadius: '20px',
                      padding: '2px 10px', fontSize: '13px', fontWeight: '600' }}>{list.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {list.length === 0 ? (
                      <div style={{ color: theme.subtext, fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
                        No tasks here
                      </div>
                    ) : (
                      list.map(task => (
                        <TaskCard key={task._id} task={task} onEdit={setEditTask} onDelete={handleDelete} />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '12px', marginTop: '36px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '8px 16px', background: theme.card, border: `1px solid ${theme.border}`,
                    borderRadius: '8px', color: theme.text, cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', opacity: page === 1 ? 0.5 : 1 }}>
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: '38px', height: '38px', borderRadius: '8px', border: 'none',
                      background: p === page ? '#6366f1' : theme.card,
                      color: p === page ? '#fff' : theme.text, cursor: 'pointer', fontWeight: '600',
                      border: `1px solid ${p === page ? '#6366f1' : theme.border}` }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: '8px 16px', background: theme.card, border: `1px solid ${theme.border}`,
                    borderRadius: '8px', color: theme.text, cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', opacity: page === totalPages ? 0.5 : 1 }}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && <TaskModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      {editTask && <TaskModal onClose={() => setEditTask(null)} onSubmit={handleUpdate} editTask={editTask} />}
    </div>
  );
};

export default Tasks;