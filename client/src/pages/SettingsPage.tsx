import { Bell, LogIn, Moon, Palette, RefreshCw, Sun, User } from 'lucide-react';
import { toast } from '../utils/toast';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Field';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { tasks, activities, refresh, loading } = useTasks();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your profile, appearance, and workspace data."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="glass-card p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">This is a demo workspace — sign-in is UI only.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-xl font-semibold text-white">
              GU
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">Guest User</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">guest@tasker.app</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Guest User" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="guest@tasker.app" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button leftIcon={<LogIn className="h-4 w-4" />} onClick={() => toast.info('Sign-in is UI-only in this demo.')}>
              Sign in
            </Button>
            <Button variant="secondary" onClick={() => toast.success('Profile saved')}>
              Save changes
            </Button>
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300">
              <Palette className="h-5 w-5" />
            </div>
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">Appearance</h2>
          </div>
          <div className="space-y-2.5">
            <ThemeOption
              active={theme === 'light'}
              onClick={() => setTheme('light')}
              icon={<Sun className="h-4 w-4" />}
              label="Light"
              description="Bright and clean"
            />
            <ThemeOption
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
              icon={<Moon className="h-4 w-4" />}
              label="Dark"
              description="Easy on the eyes"
            />
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300">
              <Bell className="h-5 w-5" />
            </div>
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            <Toggle label="Task created" defaultChecked />
            <Toggle label="Task updated" defaultChecked />
            <Toggle label="Task completed" defaultChecked />
            <Toggle label="Task deleted" defaultChecked />
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">Workspace data</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Stored in your Supabase project.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label="Tasks" value={tasks.length} />
            <Stat label="Activity events" value={activities.length} />
            <Stat label="Storage used" value={`${Math.min(tasks.length, 100)} / 100`} />
          </div>
          <div className="mt-5">
            <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => void refresh()} loading={loading}>
              Reload data
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors duration-200 ${
        active
          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10'
          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${active ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${active ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
        {active && <span className="h-2 w-2 rounded-full bg-white animate-fade-in" />}
      </span>
    </button>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700 cursor-pointer">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer sr-only"
        onChange={(e) => toast.success(`${label}: ${e.target.checked ? 'on' : 'off'}`)}
      />
      <span className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-brand-500 dark:bg-slate-700">
        <span className="ml-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/40">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
