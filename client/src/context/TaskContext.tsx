import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Activity, Task, TaskInput } from '../types';
import {
  createTask as createTaskSvc,
  deleteTask as deleteTaskSvc,
  duplicateTask as duplicateTaskSvc,
  fetchActivities,
  fetchTasks,
  updateTask as updateTaskSvc,
} from '../services/taskService';

interface TaskContextValue {
  tasks: Task[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<Task>;
  updateTask: (id: string, patch: Partial<TaskInput>) => Promise<Task>;
  deleteTask: (task: Task) => Promise<void>;
  duplicateTask: (task: Task) => Promise<Task>;
  getTask: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, a] = await Promise.all([fetchTasks(), fetchActivities(80)]);
      console.log(JSON.stringify(t, null, 2));
      setTasks(t);
      setActivities(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(async (input: TaskInput) => {
    const created = await createTaskSvc(input);
    setTasks((p) => [created, ...p]);
    setActivities((p) => [
      {
        id: crypto.randomUUID(),
        type: 'created',
        task_title: created.title,
        task_id: created.id,
        meta: null,
        created_at: new Date().toISOString(),
      },
      ...p,
    ]);
    return created;
  }, []);

  const updateTask = useCallback(async (id: string, patch: Partial<TaskInput>) => {
    const previous = await new Promise<Task | undefined>((resolve) => {
      setTasks((p) => {
        resolve(p.find((t) => t.id === id));
        return p;
      });
    });
    const updated = await updateTaskSvc(id, patch, previous);
    setTasks((p) => p.map((t) => (t.id === id ? updated : t)));
    setActivities((p) => [
      {
        id: crypto.randomUUID(),
        type: patch.status === 'completed' && previous?.status !== 'completed' ? 'completed' : 'updated',
        task_title: updated.title,
        task_id: updated.id,
        meta: null,
        created_at: new Date().toISOString(),
      },
      ...p,
    ]);
    return updated;
  }, []);

  const deleteTask = useCallback(async (task: Task) => {
    await deleteTaskSvc(task);
    setTasks((p) => p.filter((t) => t.id !== task.id));
    setActivities((p) => [
      {
        id: crypto.randomUUID(),
        type: 'deleted',
        task_title: task.title,
        task_id: null,
        meta: null,
        created_at: new Date().toISOString(),
      },
      ...p,
    ]);
  }, []);

  const duplicateTask = useCallback(async (task: Task) => {
    const dup = await duplicateTaskSvc(task);
    setTasks((p) => [dup, ...p]);
    setActivities((p) => [
      {
        id: crypto.randomUUID(),
        type: 'created',
        task_title: dup.title,
        task_id: dup.id,
        meta: null,
        created_at: new Date().toISOString(),
      },
      ...p,
    ]);
    return dup;
  }, []);

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      activities,
      loading,
      error,
      refresh,
      createTask,
      updateTask,
      deleteTask,
      duplicateTask,
      getTask,
    }),
    [tasks, activities, loading, error, refresh, createTask, updateTask, deleteTask, duplicateTask, getTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
