import React from 'react';

export function GlassCard({
  children,
  className = '',
  highlight = true,
  hover = false,
  padding = 'p-5',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-panel
        ${highlight ? 'glass-highlight' : ''}
        ${hover ? 'hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
