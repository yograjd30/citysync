import React from 'react';

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'p-5',
  onClick,
}) {
  // Quiet status borders - hairline thickness, no loud neon glows
  let borderClass = 'border-[var(--hairline)]';
  if (variant === 'critical') {
    borderClass = 'border-rose-500/30';
  } else if (variant === 'warning') {
    borderClass = 'border-amber-500/30';
  } else if (variant === 'normal') {
    borderClass = 'border-emerald-500/20';
  }

  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--surface-card)]
        border ${borderClass}
        shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
        rounded-xl
        ${hover ? 'hover:border-[var(--hairline-focused)] hover:bg-[var(--surface-raised)] transition-colors duration-150' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.995]' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
