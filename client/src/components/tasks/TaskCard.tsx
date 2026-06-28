import { Check, Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDueDate } from '../../utils/date';
import { isOverdue } from '../../utils/taskHelpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  compact?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleComplete,
  compact = false,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const overdue = isOverdue(task);
  const completed = task.status === 'completed';

  return (
    <article className="group glass-card relative p-4 sm:p-5 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="priority" value={task.priority} />
            <Badge variant="status" value={task.status} />
            {overdue && (
              <span className="inline-flex items-center rounded-full bg-danger-50 px-2.5 py-0.5 text-xs font-medium text-danger-700 ring-1 ring-inset ring-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/30">
                Overdue
              </span>
            )}
          </div>
          <h3
            className={`font-display text-base font-semibold leading-snug text-slate-900 dark:text-white ${completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}
          >
            {task.title}
          </h3>
          {!compact && task.description && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className={`inline-flex items-center gap-1 ${overdue ? 'text-danger-600 dark:text-danger-400 font-medium' : ''}`}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
              {formatDueDate(task.due_date)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleComplete(task)}
            aria-label={completed ? 'Mark as pending' : 'Mark as complete'}
            title={completed ? 'Mark as pending' : 'Mark as complete'}
            className={`rounded-lg p-2 transition-colors ${
              completed
                ? 'text-accent-600 hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-500/10'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Check className="h-4 w-4" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="More actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card dark:border-slate-700 dark:bg-slate-900 animate-slide-up"
              >
                <MenuItem icon={<Pencil className="h-4 w-4" />} onClick={() => { setMenuOpen(false); onEdit(task); }}>
                  Edit
                </MenuItem>
                <MenuItem icon={<Copy className="h-4 w-4" />} onClick={() => { setMenuOpen(false); onDuplicate(task); }}>
                  Duplicate
                </MenuItem>
                <MenuItem
                  icon={<Trash2 className="h-4 w-4" />}
                  danger
                  onClick={() => { setMenuOpen(false); onDelete(task); }}
                >
                  Delete
                </MenuItem>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function MenuItem({
  children,
  icon,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
        danger
          ? 'text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
