import { Trash2, Edit2, Calendar, Flag } from 'lucide-react';

const priorityColors = {
  High: { bg: '#450a0a', text: '#fca5a5', border: '#991b1b' },
  Medium: { bg: '#451a03', text: '#fdba74', border: '#92400e' },
  Low: { bg: '#052e16', text: '#86efac', border: '#166534' },
};

const statusColors = {
  'Todo': { bg: '#1e1b4b', text: '#a5b4fc', border: '#3730a3' },
  'In Progress': { bg: '#1c1917', text: '#fcd34d', border: '#92400e' },
  'Done': { bg: '#052e16', text: '#86efac', border: '#166534' },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const p = priorityColors[task.priority] || priorityColors.Medium;
  const s = statusColors[task.status] || statusColors['Todo'];

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{task.title}</h3>
        <div style={styles.actions}>
          <button onClick={() => onEdit(task)} style={styles.editBtn}>
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(task._id)} style={styles.deleteBtn}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {task.description && (
        <p style={styles.desc}>{task.description}</p>
      )}

      <div style={styles.badges}>
        <span style={{ ...styles.badge, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
          {task.status}
        </span>
        <span style={{ ...styles.badge, background: p.bg, color: p.text, border: `1px solid ${p.border}` }}>
          <Flag size={11} style={{ marginRight: '4px' }} />
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <div style={styles.due}>
          <Calendar size={13} color="#64748b" />
          <span style={styles.dueText}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: '#1e293b', border: '1px solid #334155', borderRadius: '12px',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { color: '#e2e8f0', fontSize: '16px', fontWeight: '600', margin: 0, flex: 1, marginRight: '12px' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { background: '#1e3a5f', border: 'none', borderRadius: '6px', padding: '6px',
    color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  deleteBtn: { background: '#3b0f0f', border: 'none', borderRadius: '6px', padding: '6px',
    color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  desc: { color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' },
  badges: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
    display: 'flex', alignItems: 'center' },
  due: { display: 'flex', alignItems: 'center', gap: '6px' },
  dueText: { color: '#64748b', fontSize: '13px' },
};

export default TaskCard;