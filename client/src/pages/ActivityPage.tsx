import { Activity as ActivityIcon, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { EmptyState } from '../components/ui/EmptyState';
import { ActivityTimeline } from '../components/tasks/ActivityTimeline';
import type { ActivityType } from '../types';

const FILTERS: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All activity' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'completed', label: 'Completed' },
  { value: 'deleted', label: 'Deleted' },
];

export function ActivityPage() {
  const { activities, loading, refresh } = useTasks();
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? activities : activities.filter((a) => a.type === filter)),
    [activities, filter],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Activity"
        description="A timeline of everything that happened in your workspace."
        actions={
          <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => void refresh()} loading={loading}>
            Refresh
          </Button>
        }
      />

      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter</span>
          <div className="max-w-xs flex-1">
            <Select value={filter} onChange={(e) => setFilter(e.target.value as ActivityType | 'all')} aria-label="Filter activity">
              {FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 sm:p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ActivityIcon className="h-7 w-7" />}
            title="No activity yet"
            description="When you create, update, or delete tasks, they'll show up here."
          />
        ) : (
          <ActivityTimeline activities={filtered} />
        )}
      </div>
    </div>
  );
}
