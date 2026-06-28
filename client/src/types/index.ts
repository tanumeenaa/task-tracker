export type Priority = 'low' | 'medium' | 'high';

export type Status = 'pending' | 'in-progress' | 'completed';

export type ActivityType = 'created' | 'updated' | 'deleted' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  task_title: string;
  task_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export type TaskInput = {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  due_date?: string | null;
};

export type SortKey = 'newest' | 'oldest' | 'az' | 'priority' | 'due';

export type PageKey =
  | 'dashboard'
  | 'tasks'
  | 'kanban'
  | 'calendar'
  | 'activity'
  | 'settings';
