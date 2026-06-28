const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function pad(n: number, w = 2): string {
  return String(n).padStart(w, '0');
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISO(iso: string): Date {
  return new Date(iso);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatDueDate(due: string | null): string {
  if (!due) return 'No due date';
  const d = new Date(due + 'T00:00:00');
  const today = new Date();
  if (isSameDay(d, today)) return 'Today';
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(d, tomorrow)) return 'Tomorrow';
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (isSameDay(d, yesterday)) return 'Yesterday';
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const dd = Math.floor(h / 24);
  if (dd < 30) return `${dd} day${dd === 1 ? '' : 's'} ago`;
  const mo = Math.floor(dd / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`;
  const y = Math.floor(mo / 12);
  return `${y} year${y === 1 ? '' : 's'} ago`;
}

export function formatFullDate(d: Date = new Date()): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(d: Date = new Date()): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

export function isDateOverdue(due: string | null, today = new Date()): boolean {
  if (!due) return false;
  const d = new Date(due + 'T00:00:00');
  return d.getTime() < startOfDay(today).getTime();
}

// Calendar helpers (replacing date-fns calendar functions)

export function addMonths(d: Date, n: number): Date {
  const result = new Date(d);
  result.setMonth(result.getMonth() + n);
  return result;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function startOfWeek(d: Date, opts?: { weekStartsOn?: number }): Date {
  const start = opts?.weekStartsOn ?? 0;
  const day = d.getDay();
  const diff = (day - start + 7) % 7;
  const result = new Date(d);
  result.setDate(d.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfWeek(d: Date, opts?: { weekStartsOn?: number }): Date {
  const start = opts?.weekStartsOn ?? 0;
  const day = d.getDay();
  const diff = (6 - day + start) % 7;
  const result = new Date(d);
  result.setDate(d.getDate() + diff);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function eachDayOfInterval({ start, end }: { start: Date; end: Date }): Date[] {
  const days: Date[] = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endTime = new Date(end);
  endTime.setHours(23, 59, 59, 999);
  while (cur <= endTime) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export function isSameDayFn(a: Date, b: Date): boolean {
  return isSameDay(a, b);
}

export function isSameMonthFn(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isTodayFn(d: Date): boolean {
  return isSameDay(d, new Date());
}

export function formatCalendar(d: Date, pattern: string): string {
  switch (pattern) {
    case 'MMMM yyyy':
      return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    case 'EEEE, MMMM d':
      return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
    case 'yyyy-MM-dd':
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    case 'd':
      return String(d.getDate());
    default:
      return d.toLocaleDateString();
  }
}
