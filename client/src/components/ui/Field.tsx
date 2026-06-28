import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const baseField =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500';

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
    >
      {children}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className = '', ...rest }: InputProps) {
  return (
    <input
      className={`${baseField} ${invalid ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/30' : ''} ${className}`}
      {...rest}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, className = '', ...rest }: TextareaProps) {
  return (
    <textarea
      className={`${baseField} resize-none ${invalid ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/30' : ''} ${className}`}
      {...rest}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid, className = '', children, ...rest }: SelectProps) {
  return (
    <select
      className={`${baseField} appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 ${invalid ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/30' : ''} ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
