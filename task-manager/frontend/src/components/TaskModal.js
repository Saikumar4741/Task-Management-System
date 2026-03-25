import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ onClose, onSubmit, editTask }) => {
  const [form, setForm] = useState({
    title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        status: editTask.status || 'Todo',
        priority: editTask.priority || 'Medium',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : ''
      });
    }
  }, [editTask]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{editTask ? '✏️ Edit Task' : '➕ New Task'}</h2>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Enter task title..." required style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Enter description..." rows={3} style={{ ...styles.input, resize: 'vertical' }} />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: '#1e293b', borderRadius: '16px', padding: '28px', width: '100%',
    maxWidth: '520px', border: '1px solid #334155' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { color: '#e2e8f0', fontSize: '20px', fontWeight: '700', margin: 0 },
  closeBtn: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  row: { display: 'flex', gap: '16px' },
  label: { color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '15px', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  modalFooter: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', border: '1px solid #334155',
    borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { padding: '10px 24px', background: '#6366f1', border: 'none',
    borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
};

export default TaskModal;