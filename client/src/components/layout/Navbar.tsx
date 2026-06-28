import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatFullDate } from '../../utils/date';

interface NavbarProps {
  onOpenMobile: () => void;
  search: string;
  onSearch: (v: string) => void;
  onBellClick?: () => void;
  notificationCount?: number;
}

export function Navbar({
  onOpenMobile,
  search,
  onSearch,
  onBellClick,
  notificationCount = 0,
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks by title or description…"
            aria-label="Search tasks"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="hidden md:flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="hidden lg:inline">{formatFullDate()}</span>
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <button
          onClick={onBellClick}
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white animate-fade-in">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-semibold text-white ring-2 ring-white dark:ring-slate-900"
          aria-label="Account"
        >
          GU
        </button>
      </div>
    </header>
  );
}
