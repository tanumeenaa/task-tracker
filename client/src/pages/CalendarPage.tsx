import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  formatCalendar,
  isSameDayFn,
  isSameMonthFn,
  isTodayFn,
  startOfMonth,
  startOfWeek,
} from '../utils/date';
import { useTasks } from '../context/TaskContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { TaskCard } from '../components/tasks/TaskCard';
import { isOverdue } from '../utils/taskHelpers';
import type { Task } from '../types';

interface CalendarPageProps {
  onAddTask: () => void;
  onEditTask: (t: Task) => void;
  onDeleteTask: (t: Task) => void;
  onDuplicateTask: (t: Task) => void;
  onToggleComplete: (t: Task) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPage({
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onToggleComplete,
}: CalendarPageProps) {
  const { tasks, loading } = useTasks();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      if (!t.due_date) continue;
      const list = map.get(t.due_date) ?? [];
      list.push(t);
      map.set(t.due_date, list);
    }
    return map;
  }, [tasks]);

  const selectedKey = selected ? formatCalendar(selected, 'yyyy-MM-dd') : null;
  const selectedTasks = selectedKey ? tasksByDate.get(selectedKey) ?? [] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Calendar"
        description="Plan ahead and never miss a deadline."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
            Add Task
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {formatCalendar(cursor, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCursor((c) => addMonths(c, -1))}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  setCursor(now);
                  setSelected(now);
                }}
              >
                Today
              </Button>
              <button
                onClick={() => setCursor((c) => addMonths(c, 1))}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                {d}
              </div>
            ))}
            {days.map((day) => {
              const key = formatCalendar(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate.get(key) ?? [];
              const inMonth = isSameMonthFn(day, cursor);
              const today = isTodayFn(day);
              const isSelected = selected && isSameDayFn(day, selected);
              const hasOverdue = dayTasks.some((t) => isOverdue(t));
              const hasCompleted = dayTasks.every((t) => t.status === 'completed') && dayTasks.length > 0;

              return (
                <button
                  key={key}
                  onClick={() => setSelected(day)}
                  className={`relative flex h-20 flex-col items-stretch rounded-xl border p-1.5 text-left transition-all duration-200 sm:h-24 ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/30'
                      : 'border-slate-200/70 hover:border-slate-300 dark:border-slate-800/70 dark:hover:border-slate-700'
                  } ${inMonth ? 'bg-white/60 dark:bg-slate-900/40' : 'bg-slate-50/40 dark:bg-slate-950/40'}`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      today
                        ? 'bg-brand-500 text-white'
                        : inMonth
                          ? 'text-slate-700 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {formatCalendar(day, 'd')}
                  </span>
                  <div className="mt-1 flex-1 space-y-0.5 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          t.status === 'completed'
                            ? 'bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300 line-through'
                            : isOverdue(t)
                              ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-300'
                              : 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="px-1.5 text-[10px] font-medium text-slate-400">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                  {dayTasks.length > 0 && (
                    <span
                      className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                        hasOverdue ? 'bg-danger-500' : hasCompleted ? 'bg-accent-500' : 'bg-brand-500'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {selected ? formatCalendar(selected, 'EEEE, MMMM d') : 'Select a date'}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'} due
          </p>

          <div className="mt-4 space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-xl" />
              ))
            ) : selectedTasks.length === 0 ? (
              <EmptyState
                icon={<Plus className="h-7 w-7" />}
                title="No tasks this day"
                description="Pick another date or schedule a new task for this day."
              />
            ) : (
              selectedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onDuplicate={onDuplicateTask}
                  onToggleComplete={onToggleComplete}
                  compact
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
