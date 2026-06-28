import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Label, Select, Textarea } from '../ui/Field';
import type { Priority, Status, Task } from '../../types';
import { toISODate } from '../../utils/date';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    due_date: string | null;
  }) => Promise<void> | void;
  initial?: Task | null;
  submitting?: boolean;
}

const EMPTY = {
  title: '',
  description: '',
  priority: 'medium' as Priority,
  status: 'pending' as Status,
  due_date: '',
};

export function TaskFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting = false,
}: TaskFormModalProps) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setTouched(false);
      if (initial) {
        setValues({
          title: initial.title,
          description: initial.description,
          priority: initial.priority,
          status: initial.status,
          due_date: initial.due_date ?? '',
        });
      } else {
        setValues(EMPTY);
      }
    }
  }, [open, initial]);

  const titleInvalid = values.title.trim().length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (titleInvalid) return;
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      status: values.status,
      due_date: values.due_date ? toISODate(new Date(values.due_date + 'T00:00:00')) : null,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit task' : 'Create new task'}
      description={initial ? 'Update the details of your task.' : 'Add a new task to your tracker.'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-form"
            loading={submitting}
            disabled={titleInvalid && touched}
          >
            {initial ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={values.title}
            invalid={touched && titleInvalid}
            placeholder="e.g. Ship the new onboarding flow"
            autoFocus
            onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
          />
          {touched && titleInvalid && (
            <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">Title is required.</p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={values.description}
            placeholder="Add context, links, or acceptance criteria…"
            onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={values.priority}
              onChange={(e) => setValues((p) => ({ ...p, priority: e.target.value as Priority }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={values.status}
              onChange={(e) => setValues((p) => ({ ...p, status: e.target.value as Status }))}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="due_date">Due date</Label>
            <Input
              id="due_date"
              type="date"
              value={values.due_date}
              onChange={(e) => setValues((p) => ({ ...p, due_date: e.target.value }))}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
