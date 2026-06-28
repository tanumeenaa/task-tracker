import type { Priority, Status, Task } from '../types';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function isOverdue(task: Task, today = new Date()): boolean {
  if (!task.due_date || task.status === 'completed') return false;
  const due = new Date(task.due_date);
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return due.getTime() < todayMid.getTime();
}

export function isDueToday(task: Task, today = new Date()): boolean {
  if (!task.due_date) return false;
  const due = new Date(task.due_date);
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
}

export function isUpcoming(task: Task, today = new Date()): boolean {
  if (!task.due_date || task.status === 'completed') return false;
  const due = new Date(task.due_date);
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = due.getTime() - todayMid.getTime();
  return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}

export function isCompletedToday(task: Task, today = new Date()): boolean {
  if (task.status !== 'completed') return false;
  const updated = new Date(task.updated_at);
  return (
    updated.getFullYear() === today.getFullYear() &&
    updated.getMonth() === today.getMonth() &&
    updated.getDate() === today.getDate()
  );
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
  completedToday: number;
  upcoming: number;
}

export function computeStats(tasks: Task[], today = new Date()): TaskStats {
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;
  let completedToday = 0;
  let upcoming = 0;

  for (const t of tasks) {
    if (t.status === 'pending') pending++;
    else if (t.status === 'in-progress') inProgress++;
    else if (t.status === 'completed') completed++;
    if (isOverdue(t, today)) overdue++;
    if (isCompletedToday(t, today)) completedToday++;
    if (isUpcoming(t, today)) upcoming++;
  }

  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    completionRate,
    completedToday,
    upcoming,
  };
}

export function mostCommonPriority(tasks: Task[]): Priority | null {
  if (tasks.length === 0) return null;
  const counts: Record<Priority, number> = { low: 0, medium: 0, high: 0 };
  for (const t of tasks) counts[t.priority]++;
  return (Object.entries(counts) as [Priority, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}

export function mostCommonStatus(tasks: Task[]): Status | null {
  if (tasks.length === 0) return null;
  const counts: Record<Status, number> = {
    pending: 0,
    'in-progress': 0,
    completed: 0,
  };
  for (const t of tasks) counts[t.status]++;
  return (Object.entries(counts) as [Status, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}

export function sortTasks(tasks: Task[], key: 'newest' | 'oldest' | 'az' | 'priority' | 'due'): Task[] {
  const copy = [...tasks];
  switch (key) {
    case 'newest':
      copy.sort((a, b) => b.created_at.localeCompare(a.created_at));
      break;
    case 'oldest':
      copy.sort((a, b) => a.created_at.localeCompare(b.created_at));
      break;
    case 'az':
      copy.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'priority':
      copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
      break;
    case 'due':
      copy.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      });
      break;
  }
  return copy;
}

export function filterTasks(
  tasks: Task[],
  opts: {
    search?: string;
    status?: Status | 'all';
    priority?: Priority | 'all';
    dueDate?: string | 'all';
  },
): Task[] {
  const search = (opts.search ?? '').trim().toLowerCase();
  return tasks.filter((t) => {
    if (search) {
      const hay = `${t.title} ${t.description}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (opts.status && opts.status !== 'all' && t.status !== opts.status) return false;
    if (opts.priority && opts.priority !== 'all' && t.priority !== opts.priority) return false;
    if (opts.dueDate && opts.dueDate !== 'all' && t.due_date !== opts.dueDate) return false;
    return true;
  });
}
