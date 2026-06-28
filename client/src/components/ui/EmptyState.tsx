import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/40 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30 animate-fade-in">
      <div className="relative mb-5">
        <div className="absolute inset-0 -z-10 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 ring-1 ring-brand-200 dark:from-slate-800 dark:to-slate-900 dark:text-brand-300 dark:ring-slate-700">
          {icon}
        </div>
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
