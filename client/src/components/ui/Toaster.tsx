import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { subscribeToasts } from '../../utils/toast';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const STYLES: Record<ToastItem['type'], { bar: string; icon: string; bg: string }> = {
  success: {
    bar: 'bg-accent-500',
    icon: 'text-accent-500',
    bg: 'bg-white dark:bg-slate-900 border-accent-200 dark:border-accent-800/50',
  },
  error: {
    bar: 'bg-danger-500',
    icon: 'text-danger-500',
    bg: 'bg-white dark:bg-slate-900 border-danger-200 dark:border-danger-800/50',
  },
  info: {
    bar: 'bg-brand-500',
    icon: 'text-brand-500',
    bg: 'bg-white dark:bg-slate-900 border-brand-200 dark:border-brand-800/50',
  },
};

const ICONS: Record<ToastItem['type'], typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const s = STYLES[t.type];
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            role="alert"
            className={`flex w-80 items-start gap-3 rounded-xl border shadow-card px-4 py-3 animate-slide-up ${s.bg}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.icon}`} />
            <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
              {t.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
