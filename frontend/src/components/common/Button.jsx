import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500/50 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white shadow-lg shadow-teal-900/30 border border-teal-400/30 rounded-xl',
    glass: 'glass-panel hover:bg-white/10 dark:hover:bg-slate-800/80 active:scale-[0.98] text-slate-100 rounded-xl',
    secondary: 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40 rounded-xl',
  };

  // Min height 44px for iPhone touch ergonomics
  const sizes = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-5 py-2.5 text-sm gap-2',
    lg: 'min-h-[48px] px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
