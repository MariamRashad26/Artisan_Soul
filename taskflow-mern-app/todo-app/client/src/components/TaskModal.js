import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const DEFAULT_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  category: 'General',
  tags: '',
};

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        category: task.category || 'General',
        tags: (task.tags || []).join(', '),
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 200) errs.title = 'Title too long (max 200 chars)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
        category: form.category.trim() || 'General',
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to save task' });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale-in">
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} title="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errors.general && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label className="label">Task Title *</label>
            <input
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set('title')}
              autoFocus
              style={errors.title ? { borderColor: 'var(--danger)' } : {}}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              className="input"
              placeholder="Add details (optional)..."
              value={form.description}
              onChange={set('description')}
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="label">Priority</label>
              <select className="input filter-select" value={form.priority} onChange={set('priority')} style={{ width: '100%' }}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Due Date</label>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={set('dueDate')}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="label">Category</label>
              <input
                className="input"
                placeholder="e.g. Work, Personal..."
                value={form.category}
                onChange={set('category')}
              />
            </div>

            <div className="form-group">
              <label className="label">Tags (comma separated)</label>
              <input
                className="input"
                placeholder="e.g. urgent, api, bug..."
                value={form.tags}
                onChange={set('tags')}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><div className="spinner spinner-sm" /> Saving...</>
              ) : (
                task ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
