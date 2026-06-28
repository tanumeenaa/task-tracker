import { useEffect, useRef, useState, type ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  tone: 'brand' | 'warning' | 'accent' | 'danger' | 'neutral';
  suffix?: string;
  delay?: number;
}

const TONES: Record<StatCardProps['tone'], { bg: string; text: string; ring: string; glow: string }> = {
  brand: {
    bg: 'bg-brand-50 dark:bg-brand-500/10',
    text: 'text-brand-600 dark:text-brand-300',
    ring: 'ring-brand-100 dark:ring-brand-500/20',
    glow: 'from-brand-500/10',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-500/10',
    text: 'text-warning-600 dark:text-warning-300',
    ring: 'ring-warning-100 dark:ring-warning-500/20',
    glow: 'from-warning-500/10',
  },
  accent: {
    bg: 'bg-accent-50 dark:bg-accent-500/10',
    text: 'text-accent-600 dark:text-accent-300',
    ring: 'ring-accent-100 dark:ring-accent-500/20',
    glow: 'from-accent-500/10',
  },
  danger: {
    bg: 'bg-danger-50 dark:bg-danger-500/10',
    text: 'text-danger-600 dark:text-danger-300',
    ring: 'ring-danger-100 dark:ring-danger-500/20',
    glow: 'from-danger-500/10',
  },
  neutral: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-600 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-700',
    glow: 'from-slate-500/10',
  },
};

function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function StatCard({ label, value, icon, tone, suffix, delay = 0 }: StatCardProps) {
  const animated = value;
  const t = TONES[tone];
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), delay * 1000);
    return () => window.clearTimeout(id);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden glass-card p-5 hover:-translate-y-0.5 transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
            {animated}
            {suffix && <span className="ml-0.5 text-lg font-semibold text-slate-400">{suffix}</span>}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${t.bg} ${t.text} ${t.ring}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
