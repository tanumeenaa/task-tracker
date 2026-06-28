import {
  CheckCircle2,
  FilePlus2,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Activity, ActivityType } from '../../types';
import { formatRelative } from '../../utils/date';

const ICONS: Record<ActivityType, { icon: typeof FilePlus2; tone: string }> = {
  created: {
    icon: FilePlus2,
    tone: 'bg-brand-50 text-brand-600 ring-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20',
  },
  updated: {
    icon: Pencil,
    tone: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  },
  completed: {
    icon: CheckCircle2,
    tone: 'bg-accent-50 text-accent-600 ring-accent-100 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/20',
  },
  deleted: {
    icon: Trash2,
    tone: 'bg-danger-50 text-danger-600 ring-danger-100 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/20',
  },
};

const LABELS: Record<ActivityType, string> = {
  created: 'created',
  updated: 'updated',
  completed: 'completed',
  deleted: 'deleted',
};

export function ActivityTimeline({ activities, limit }: { activities: Activity[]; limit?: number }) {
  const items = limit ? activities.slice(0, limit) : activities;
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No recent activity yet.
      </p>
    );
  }
  return (
    <ol className="relative space-y-4">
      {items.map((a) => {
        const { icon: Icon, tone } = ICONS[a.type];
        return (
          <li key={a.id} className="flex gap-3 animate-fade-in">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${tone}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">{LABELS[a.type]}</span>
                {' — '}
                <span className="text-slate-600 dark:text-slate-300">{a.task_title}</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{formatRelative(a.created_at)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
