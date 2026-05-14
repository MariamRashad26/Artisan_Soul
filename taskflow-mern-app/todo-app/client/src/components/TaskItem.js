import React, { useState } from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High', urgent: '🔥' };

function getDueStatus(dueDate, completed) {
  if (!dueDate || completed) return null;
  const date = new Date(dueDate);
  if (isToday(date)) return { label: 'Due today', cls: 'due-soon' };
  if (isTomorrow(date)) return { label: 'Due tomorrow', cls: 'due-soon' };
  if (isPast(date)) return { label: 'Overdue', cls: 'overdue' };
  return { label: format(date, 'MMM d'), cls: '' };
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const dueStatus = getDueStatus(task.dueDate, task.completed);

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task._id); }
    finally { setToggling(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try { await onDelete(task._id); }
    finally { setDeleting(false); }
  };

  return (
    <div className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={handleToggle}
        disabled={toggling}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {(toggling) ? (
          <div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'white' }} />
        ) : task.completed ? (
          <svg viewBox="0 0 14 14" fill="none"><polyline points="2,7 5.5,11 12,3" /></svg>
        ) : null}
      </button>

      {/* Body */}
      <div className="task-body">
        <div className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]} priority
          </span>
          {task.category && task.category !== 'General' && (
            <span className="tag">📁 {task.category}</span>
          )}
          {task.tags?.map(tag => (
            <span key={tag} className="tag"># {tag}</span>
          ))}
          {dueStatus && (
            <span className={`task-due ${dueStatus.cls}`}>
              📅 {dueStatus.label}
            </span>
          )}
          {task.completed && task.completedAt && (
            <span className="task-due">✓ {format(new Date(task.completedAt), 'MMM d')}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✎
        </button>
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete task"
          style={{ color: 'var(--danger)' }}
        >
          {deleting ? <div className="spinner spinner-sm" /> : '✕'}
        </button>
      </div>
    </div>
  );
}
