import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
}) {
  const isBusy = isLoading || loading;
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus:outline-none';

  const variants = {
    primary: 'bg-white text-slate-950 hover:bg-slate-200 active:bg-slate-300 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    glass: 'bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--hairline)]',
    secondary: 'bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--hairline)]',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-xs gap-2',
    lg: 'h-11 px-5 text-sm gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isBusy}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {isBusy ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
