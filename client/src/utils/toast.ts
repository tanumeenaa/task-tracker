type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();

function notify() {
  const snapshot = [...items];
  listeners.forEach((l) => l(snapshot));
}

function add(type: ToastType, message: string) {
  const id = Math.random().toString(36).slice(2);
  items = [...items, { id, type, message }];
  notify();
  window.setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    notify();
  }, 3500);
}

export const toast = {
  success: (msg: string) => add('success', msg),
  error: (msg: string) => add('error', msg),
  info: (msg: string) => add('info', msg),
};

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener([...items]);
  return () => listeners.delete(listener);
}
