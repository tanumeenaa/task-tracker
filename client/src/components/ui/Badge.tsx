import type { ReactNode } from 'react';
import type { Priority, Status } from '../../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/taskHelpers';

type Variant = 'priority' | 'status';

interface BadgeProps {
  variant: Variant;
  value: Priority | Status;
  className?: string;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700',
  medium:
    'bg-warning-50 text-warning-700 ring-warning-200 dark:bg-warning-500/10 dark:text-warning-300 dark:ring-warning-500/30',
  high:
    'bg-danger-50 text-danger-700 ring-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/30',
};

const STATUS_STYLES: Record<Status, string> = {
  pending:
    'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700',
  'in-progress':
    'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/30',
  completed:
    'bg-accent-50 text-accent-700 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/30',
};

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-warning-500',
  high: 'bg-danger-500',
};

const STATUS_DOT: Record<Status, string> = {
  pending: 'bg-slate-400',
  'in-progress': 'bg-brand-500',
  completed: 'bg-accent-500',
};

export function Badge({ variant, value, className = '' }: BadgeProps) {
  const label =
    variant === 'priority'
      ? PRIORITY_LABELS[value as Priority]
      : STATUS_LABELS[value as Status];
  const styles =
    variant === 'priority'
      ? PRIORITY_STYLES[value as Priority]
      : STATUS_STYLES[value as Status];
  const dot =
    variant === 'priority'
      ? PRIORITY_DOT[value as Priority]
      : STATUS_DOT[value as Status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export function Pill({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'warning' | 'danger' | 'accent';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral:
      'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700',
    brand:
      'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/30',
    warning:
      'bg-warning-50 text-warning-700 ring-warning-200 dark:bg-warning-500/10 dark:text-warning-300 dark:ring-warning-500/30',
    danger:
      'bg-danger-50 text-danger-700 ring-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/30',
    accent:
      'bg-accent-50 text-accent-700 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
