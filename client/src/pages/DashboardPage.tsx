import { useEffect, useState, useMemo } from 'react';
import {
  AlarmClock,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock,
  ListChecks,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ActivityTimeline } from '../components/tasks/ActivityTimeline';
import { TaskCard } from '../components/tasks/TaskCard';
import {
  computeStats,
  isDueToday,
  isOverdue,
  isUpcoming,
  mostCommonPriority,
  mostCommonStatus,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../utils/taskHelpers';
import { formatDueDate, formatFullDate } from '../utils/date';
import type { PageKey, Task } from '../types';

interface DashboardPageProps {
  onAddTask: () => void;
  onEditTask: (t: Task) => void;
  onDeleteTask: (t: Task) => void;
  onDuplicateTask: (t: Task) => void;
  onToggleComplete: (t: Task) => void;
  onNavigate: (p: PageKey) => void;
}

export function DashboardPage({
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onToggleComplete,
  onNavigate,
}: DashboardPageProps) {
  const { tasks, activities, loading } = useTasks();
  console.log("Dashboard tasks:", tasks);

const stats = useMemo(() => {
  console.log("computeStats input:", tasks);

  let pending = 0;
  let inProgress = 0;
  let completed = 0;

  tasks.forEach((t) => {
    console.log(t.status);

    if (t.status === "pending") pending++;
    if (t.status === "in-progress") inProgress++;
    if (t.status === "completed") completed++;
  });

  const s = computeStats(tasks);
console.log("Stats =", s);

return s;
}, [tasks]);
  const todays = useMemo(() => tasks.filter((t) => isDueToday(t)), [tasks]);
  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => isUpcoming(t))
        .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
        .slice(0, 5),
    [tasks],
  );
  const topPriority = useMemo(() => mostCommonPriority(tasks), [tasks]);
  const topStatus = useMemo(() => mostCommonStatus(tasks), [tasks]);

  const [progressWidth, setProgressWidth] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setProgressWidth(stats.completionRate), 200);
    return () => window.clearTimeout(id);
  }, [stats.completionRate]);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description={formatFullDate()}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
            Add Task
          </Button>
        }
      />

      {/* Hero banner */}
      <div className="glass-card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent blur-3xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-300">Welcome back</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Let&apos;s make today productive.
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You have{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{todays.length}</span>{' '}
              task{todays.length === 1 ? '' : 's'} due today
              {stats.overdue > 0 && (
                <> and{' '}
                  <span className="font-semibold text-danger-600 dark:text-danger-400">{stats.overdue} overdue</span>
                </>
              )}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Completion</p>
              <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{stats.completionRate}%</p>
            </div>
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-slate-200 dark:stroke-slate-800" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="stroke-brand-500 transition-all duration-700 ease-out"
                  pathLength={100}
                  strokeDasharray={`${progressWidth} 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span>{stats.completed} of {stats.total} completed</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-accent-500 transition-all duration-700 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          : (
            <>
              <StatCard label="Total Tasks" value={stats.total} tone="neutral" icon={<ListChecks className="h-5 w-5" />} delay={0} />
              <StatCard label="Pending" value={stats.pending} tone="brand" icon={<CircleDashed className="h-5 w-5" />} delay={0.05} />
              <StatCard label="In Progress" value={stats.inProgress} tone="warning" icon={<Clock className="h-5 w-5" />} delay={0.1} />
              <StatCard label="Completed" value={stats.completed} tone="accent" icon={<CheckCircle2 className="h-5 w-5" />} delay={0.15} />
              <StatCard label="Overdue" value={stats.overdue} tone="danger" icon={<AlarmClock className="h-5 w-5" />} delay={0.2} />
            </>
          )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's tasks */}
          <section className="glass-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">Today&apos;s tasks</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{todays.length} scheduled for today</p>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => onNavigate('tasks')}>
                View all
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-28 rounded-2xl" />
                ))}
              </div>
            ) : todays.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-7 w-7" />}
                title="Nothing due today"
                description="You're all caught up. Enjoy the calm or plan ahead by adding a new task."
                action={
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
                    Add a task
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todays.slice(0, 4).map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onDuplicate={onDuplicateTask}
                    onToggleComplete={onToggleComplete}
                    compact
                  />
                ))}
              </div>
            )}
          </section>

          {/* Upcoming deadlines */}
          <section className="glass-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">Upcoming deadlines</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Next 7 days</p>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => onNavigate('calendar')}>
                Calendar
              </Button>
            </div>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<CalendarClock className="h-7 w-7" />}
                title="No upcoming deadlines"
                description="Tasks due in the next 7 days will appear here."
              />
            ) : (
              <ul className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                {upcoming.map((t) => {
                  const overdue = isOverdue(t);
                  return (
                    <li key={t.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${overdue ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300' : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300'}`}>
                          <CalendarClock className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{t.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{formatDueDate(t.due_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="priority" value={t.priority} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Analytics */}
          <section className="glass-card p-5 sm:p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-slate-900 dark:text-white">Analytics</h3>
            <dl className="space-y-3 text-sm">
              <AnalyticsRow icon={<TrendingUp className="h-4 w-4" />} label="Completion rate" value={`${stats.completionRate}%`} />
              <AnalyticsRow icon={<CheckCircle2 className="h-4 w-4" />} label="Completed today" value={`${stats.completedToday}`} />
              <AnalyticsRow icon={<CalendarClock className="h-4 w-4" />} label="Upcoming (7d)" value={`${stats.upcoming}`} />
              <AnalyticsRow icon={<AlarmClock className="h-4 w-4" />} label="Overdue" value={`${stats.overdue}`} />
              <AnalyticsRow
                icon={<TrendingUp className="h-4 w-4" />}
                label="Most common priority"
                value={topPriority ? PRIORITY_LABELS[topPriority] : '—'}
              />
              <AnalyticsRow
                icon={<TrendingUp className="h-4 w-4" />}
                label="Most common status"
                value={topStatus ? STATUS_LABELS[topStatus] : '—'}
              />
            </dl>
          </section>

          {/* Recent activity */}
          <section className="glass-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">Recent activity</h3>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('activity')}>
                All
              </Button>
            </div>
            <ActivityTimeline activities={activities} limit={6} />
          </section>
        </div>
      </div>
    </div>
  );
}

function AnalyticsRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span className="text-slate-400">{icon}</span>
        {label}
      </dt>
      <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
    </div>
  );
}
