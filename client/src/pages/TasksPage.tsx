import { ListChecks, Plus, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { EmptyState } from '../components/ui/EmptyState';
import { ListSkeleton } from '../components/ui/Skeleton';
import { TaskCard } from '../components/tasks/TaskCard';
import { useDebounce } from '../hooks/useDebounce';
import { filterTasks, sortTasks } from '../utils/taskHelpers';
import type { Priority, SortKey, Status, Task } from '../types';

interface TasksPageProps {
  search: string;
  onAddTask: () => void;
  onEditTask: (t: Task) => void;
  onDeleteTask: (t: Task) => void;
  onDuplicateTask: (t: Task) => void;
  onToggleComplete: (t: Task) => void;
}

type StatusFilter = Status | 'all';
type PriorityFilter = Priority | 'all';

export function TasksPage({
  search,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onToggleComplete,
}: TasksPageProps) {
  const { tasks, loading } = useTasks();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState<PriorityFilter>('all');
  const [dueDate, setDueDate] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const debouncedSearch = useDebounce(search, 200);

  const dueDates = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) if (t.due_date) set.add(t.due_date);
    return Array.from(set).sort();
  }, [tasks]);

  const filtered = useMemo(() => {
    const result = filterTasks(tasks, {
      search: debouncedSearch,
      status,
      priority,
      dueDate,
    });
    return sortTasks(result, sort);
  }, [tasks, debouncedSearch, status, priority, dueDate, sort]);

  const hasFilters = status !== 'all' || priority !== 'all' || dueDate !== 'all' || debouncedSearch.trim() !== '';

  const clearFilters = () => {
    setStatus('all');
    setPriority('all');
    setDueDate('all');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="All Tasks"
        description={`${filtered.length} of ${tasks.length} tasks`}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
            Add Task
          </Button>
        }
      />

      <div className="glass-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-1">
            <Select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as PriorityFilter)} aria-label="Filter by priority">
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Select value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="Filter by due date">
              <option value="all">All due dates</option>
              {dueDates.map((d) => (
                <option key={d} value={d}>
                  {new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort tasks">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
              <option value="priority">Priority</option>
              <option value="due">Due date</option>
            </Select>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" leftIcon={<X className="h-3.5 w-3.5" />} onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <ListSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={hasFilters ? <SearchX className="h-7 w-7" /> : <ListChecks className="h-7 w-7" />}
          title={hasFilters ? 'No matching tasks' : 'No tasks yet'}
          description={
            hasFilters
              ? "Try adjusting your search or filters to find what you're looking for."
              : 'Create your first task to start tracking your work.'
          }
          action={
            hasFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
                Add Task
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDuplicate={onDuplicateTask}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
