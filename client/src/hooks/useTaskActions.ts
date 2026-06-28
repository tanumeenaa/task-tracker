import { useCallback, useState } from 'react';
import { toast } from '../utils/toast';
import type { Task, TaskInput } from '../types';
import { useTasks } from '../context/TaskContext';

export function useTaskActions() {
  const { createTask, updateTask, deleteTask, duplicateTask } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditing(null);
  }, []);

  const submitForm = useCallback(
    async (values: TaskInput) => {
      setSubmitting(true);
      try {
        if (editing) {
          await updateTask(editing.id, values);
          toast.success('Task updated');
        } else {
          await createTask(values);
          toast.success('Task created');
        }
        closeForm();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
    [editing, updateTask, createTask, closeForm],
  );

  const confirmDelete = useCallback((task: Task) => setDeleteTarget(task), []);

  const cancelDelete = useCallback(() => setDeleteTarget(null), []);

  const performDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget);
      toast.success('Task deleted');
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, deleteTask]);

  const duplicate = useCallback(
    async (task: Task) => {
      try {
        await duplicateTask(task);
        toast.success('Task duplicated');
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to duplicate task');
      }
    },
    [duplicateTask],
  );

  const toggleComplete = useCallback(
    async (task: Task) => {
      const next = task.status === 'completed' ? 'pending' : 'completed';
      try {
        await updateTask(task.id, { status: next });
        toast.success(next === 'completed' ? 'Marked as complete' : 'Marked as pending');
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to update task');
      }
    },
    [updateTask],
  );

  return {
    formOpen,
    editing,
    submitting,
    deleteTarget,
    deleting,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    confirmDelete,
    cancelDelete,
    performDelete,
    duplicate,
    toggleComplete,
  };
}
