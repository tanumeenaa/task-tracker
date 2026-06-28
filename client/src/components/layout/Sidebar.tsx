import { useEffect, useState } from 'react';
import {
  Activity as ActivityIcon,
  Calendar as CalendarIcon,
  CheckSquare,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Moon,
  Settings as SettingsIcon,
  Sun,
  KanbanSquare,
  X,
} from "lucide-react";
import type { PageKey } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../context/TaskContext';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'tasks', label: 'All Tasks', icon: ListChecks },
  { key: 'kanban', label: 'Kanban Board', icon: KanbanSquare },
  { key: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { key: 'activity', label: 'Activity', icon: ActivityIcon },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

const STORAGE_CAP = 100;

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { tasks } = useTasks();
  const used = Math.min(tasks.length, STORAGE_CAP);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setProgressWidth((used / STORAGE_CAP) * 100), 100);
    return () => window.clearTimeout(id);
  }, [used]);

  const handleNav = (key: PageKey) => {
    onNavigate(key);
    onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-500/30">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none text-slate-900 dark:text-white">Tasker</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">Task Tracker</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
              GU
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">Guest User</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Not signed in</p>
            </div>
          </div>
          <button
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
            onClick={() => onNavigate('settings')}
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </button>
        </div>
      </div>

      <nav className="mt-5 flex-1 overflow-y-auto scrollbar-thin px-3" aria-label="Primary">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        <ul className="space-y-1">
          {NAV.map(({ key, label, icon: Icon }) => {
            const active = current === key;
            return (
              <li key={key}>
                <button
                  onClick={() => handleNav(key)}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500 transition-all duration-200" />
                  )}
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-3 pt-2 space-y-3">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800/60"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="flex items-center gap-2.5">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
          <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-200 transition-colors duration-200 dark:bg-slate-600">
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </span>
        </button>

        <div className="glass rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-300">Storage</span>
            <span className="text-slate-400">{used} / {STORAGE_CAP} Tasks</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <p className="px-1 text-center text-[11px] text-slate-400">Version 1.0</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">
        {content}
      </aside>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      </div>
      <aside
        className={`lg:hidden fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {content}
      </aside>
    </>
  );
}
