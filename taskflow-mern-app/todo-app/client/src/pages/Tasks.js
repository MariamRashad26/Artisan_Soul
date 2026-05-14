import React, { useEffect, useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest first' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title A-Z' },
];

const PRIORITY_OPTS = ['', 'urgent', 'high', 'medium', 'low'];
const STATUS_OPTS = [
  { value: '', label: 'All status' },
  { value: 'false', label: 'Pending' },
  { value: 'true', label: 'Completed' },
];

export default function Tasks() {
  const { tasks, loading, pagination, fetchTasks, createTask, updateTask, deleteTask, toggleTask, deleteCompleted } = useTasks();
  const [filters, setFilters] = useState({ search: '', priority: '', completed: '', sortBy: 'createdAt', order: 'desc' });
  const [modal, setModal] = useState({ open: false, task: null });
  const [searchInput, setSearchInput] = useState('');

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  useEffect(() => { load(); }, [load]);

  const setFilter = (key) => (e) => {
    setFilters(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async (taskData) => {
    if (modal.task) {
      await updateTask(modal.task._id, taskData);
    } else {
      await createTask(taskData);
    }
    load();
  };

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">
            {pendingCount} pending · {completedCount} completed
            {pagination && ` · ${pagination.total} total`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {completedCount > 0 && (
            <button
              className="btn btn-secondary"
              onClick={deleteCompleted}
              title="Delete all completed tasks"
            >
              🗑 Clear done
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setModal({ open: true, task: null })}>
            + New Task
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input
            className="input"
            placeholder="Search tasks, tags..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
        <div className="filter-bar">
          <select className="filter-select" value={filters.priority} onChange={setFilter('priority')}>
            {PRIORITY_OPTS.map(p => (
              <option key={p} value={p}>{p ? p.charAt(0).toUpperCase() + p.slice(1) : 'All priorities'}</option>
            ))}
          </select>
          <select className="filter-select" value={filters.completed} onChange={setFilter('completed')}>
            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className="filter-select" value={filters.sortBy} onChange={setFilter('sortBy')}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className="filter-select" value={filters.order} onChange={setFilter('order')}>
            <option value="desc">↓ Desc</option>
            <option value="asc">↑ Asc</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {filters.search || filters.priority || filters.completed ? '🔍' : '✅'}
          </div>
          <div className="empty-state-title">
            {filters.search || filters.priority || filters.completed
              ? 'No matching tasks'
              : 'No tasks yet'}
          </div>
          <div className="empty-state-desc">
            {filters.search || filters.priority || filters.completed
              ? 'Try adjusting your filters'
              : "Create your first task to get started!"}
          </div>
          {!filters.search && !filters.priority && !filters.completed && (
            <button
              className="btn btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setModal({ open: true, task: null })}
            >
              + Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={toggleTask}
              onEdit={(t) => setModal({ open: true, task: t })}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      {modal.open && (
        <TaskModal
          task={modal.task}
          onClose={() => setModal({ open: false, task: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
