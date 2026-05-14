import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== undefined && v !== null) params.append(k, v); });
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.tasks);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    setTasks(prev => [data.task, ...prev]);
    toast.success('Task created! ✅');
    return data.task;
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    const { data } = await api.put(`/tasks/${id}`, updates);
    setTasks(prev => prev.map(t => t._id === id ? data.task : t));
    toast.success('Task updated');
    return data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
    toast.success('Task deleted');
  }, []);

  const toggleTask = useCallback(async (id) => {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    setTasks(prev => prev.map(t => t._id === id ? data.task : t));
    return data.task;
  }, []);

  const deleteCompleted = useCallback(async () => {
    const { data } = await api.delete('/tasks/bulk/completed');
    setTasks(prev => prev.filter(t => !t.completed));
    toast.success(data.message);
  }, []);

  return { tasks, loading, pagination, fetchTasks, createTask, updateTask, deleteTask, toggleTask, deleteCompleted };
};
