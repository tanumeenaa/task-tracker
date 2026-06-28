import { useState, useMemo } from 'react';

import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { KanbanPage } from './pages/KanbanPage';
import { CalendarPage } from './pages/CalendarPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { Toaster } from './components/ui/Toaster';
import { useTaskActions } from './hooks/useTaskActions';
import { isOverdue } from './utils/taskHelpers';
import type { PageKey } from './types';

function Shell() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { tasks } = useTasks();
  const actions = useTaskActions();

  const overdueCount = useMemo(() => tasks.filter((t) => isOverdue(t)).length, [tasks]);

  const taskActionProps = {
    onAddTask: actions.openCreate,
    onEditTask: actions.openEdit,
    onDeleteTask: actions.confirmDelete,
    onDuplicateTask: actions.duplicate,
    onToggleComplete: actions.toggleComplete,
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        current={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onOpenMobile={() => setMobileOpen(true)}
          search={search}
          onSearch={setSearch}
          notificationCount={overdueCount}
          onBellClick={() => setPage('tasks')}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            {page === 'dashboard' && (
              <DashboardPage {...taskActionProps} onNavigate={setPage} />
            )}
            {page === 'tasks' && <TasksPage search={search} {...taskActionProps} />}
            {page === 'kanban' && <KanbanPage search={search} {...taskActionProps} />}
            {page === 'calendar' && <CalendarPage {...taskActionProps} />}
            {page === 'activity' && <ActivityPage />}
            {page === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>

      <TaskFormModal
        open={actions.formOpen}
        onClose={actions.closeForm}
        onSubmit={actions.submitForm}
        initial={actions.editing}
        submitting={actions.submitting}
      />
      <ConfirmDialog
        open={actions.deleteTarget !== null}
        title="Delete task"
        message={`Are you sure you want to delete "${actions.deleteTarget?.title ?? ''}"? This action cannot be undone.`}
        onConfirm={actions.performDelete}
        onCancel={actions.cancelDelete}
        loading={actions.deleting}
      />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Shell />
      </TaskProvider>
    </ThemeProvider>
  );
}
