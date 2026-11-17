import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function LivingBackground({ stability = 85, children }) {
  const { theme } = useTheme();

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--surface-page)] text-[var(--text-primary)] flex flex-col relative selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Ultra-subtle, non-distracting ambient depth */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-25"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 211, 238, 0.04), transparent 70%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
