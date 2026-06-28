import { CheckCircle2, CircleDashed, Clock, Copy, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from '../utils/toast';
import { useTasks } from '../context/TaskContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { formatDueDate } from '../utils/date';
import { isOverdue } from '../utils/taskHelpers';
import type { Status, Task } from '../types';

interface KanbanPageProps {
  search: string;
  onAddTask: () => void;
  onEditTask: (t: Task) => void;
  onDeleteTask: (t: Task) => void;
  onDuplicateTask: (t: Task) => void;
  onToggleComplete: (t: Task) => void;
}

const COLUMNS: { key: Status; label: string; icon: typeof CircleDashed; tone: string; dot: string }[] = [
  { key: 'pending', label: 'Pending', icon: CircleDashed, tone: 'text-slate-600 dark:text-slate-300', dot: 'bg-slate-400' },
  { key: 'in-progress', label: 'In Progress', icon: Clock, tone: 'text-brand-600 dark:text-brand-300', dot: 'bg-brand-500' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, tone: 'text-accent-600 dark:text-accent-300', dot: 'bg-accent-500' },
];

export function KanbanPage({
  search,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onToggleComplete,
}: KanbanPageProps) {
  const { tasks, loading, updateTask } = useTasks();

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const g: Record<Status, Task[]> = { pending: [], 'in-progress': [], completed: [] };
    for (const t of tasks) {
      if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q)) continue;
      g[t.status].push(t);
    }
    return g;
  }, [tasks, search]);

  const handleDrop = async (status: Status, task: Task) => {
    if (task.status === status) return;
    try {
      await updateTask(task.id, { status });
      toast.success(`Moved to ${status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to move task');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Kanban Board"
        description="Drag a card between columns to update its status."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
            Add Task
          </Button>
        }
      />

      <div className="overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-4 min-w-max pb-2">
          {COLUMNS.map((col) => {
            const items = grouped[col.key];
            return (
              <div
                key={col.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData('text/plain');
                  const task = tasks.find((t) => t.id === id);
                  if (task) void handleDrop(col.key, task);
                }}
                className="flex w-80 shrink-0 flex-col rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-slate-800/70 dark:bg-slate-900/40"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                    <col.icon className={`h-4 w-4 ${col.tone}`} />
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{col.label}</h3>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                    {items.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto scrollbar-thin min-h-[120px]">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="skeleton h-24 rounded-xl" />
                    ))
                  ) : items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400 dark:border-slate-700">
                      Drop tasks here
                    </div>
                  ) : (
                    items.map((t) => {
                      const overdue = isOverdue(t);
                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', t.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onClick={() => onEditTask(t)}
                          className="group cursor-grab rounded-xl border border-slate-200/70 bg-white p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900 animate-fade-in"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{t.title}</p>
                            <Badge variant="priority" value={t.priority} />
                          </div>
                          {t.description && (
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{t.description}</p>
                          )}
                          <div className="mt-2.5 flex items-center justify-between">
                            <span className={`text-xs ${overdue ? 'text-danger-600 dark:text-danger-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                              {formatDueDate(t.due_date)}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleComplete(t); }}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-accent-600 dark:hover:bg-slate-800"
                                aria-label="Toggle complete"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); onDuplicateTask(t); }}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                aria-label="Duplicate task"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteTask(t); }}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-danger-600 dark:hover:bg-slate-800 dark:hover:text-danger-400"
                                aria-label="Delete task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!loading && tasks.length === 0 && (
        <EmptyState
          icon={<CheckCircle2 className="h-7 w-7" />}
          title="No tasks on the board"
          description="Add your first task to start organizing your workflow."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
              Add Task
            </Button>
          }
        />
      )}
    </div>
  );
}