import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function LivingBackground({ stability = 85, children }) {
  const { theme } = useTheme();

  // Dynamic hue selection based on city stability
  let c1, c2, c3;
  if (stability >= 70) {
    // Normal / Calm: Teal 600, Blue 900, Slate 950
    c1 = 'rgba(13, 148, 136, 0.22)';
    c2 = 'rgba(30, 58, 138, 0.26)';
    c3 = 'rgba(15, 23, 42, 0.96)';
  } else if (stability >= 40) {
    // Warning: Amber 600, Indigo 900, Slate 950
    c1 = 'rgba(217, 119, 6, 0.25)';
    c2 = 'rgba(79, 70, 229, 0.22)';
    c3 = 'rgba(24, 24, 27, 0.96)';
  } else {
    // Critical: Crimson 600, Purple 950, Slate 950
    c1 = 'rgba(225, 29, 72, 0.30)';
    c2 = 'rgba(88, 28, 135, 0.28)';
    c3 = 'rgba(15, 23, 42, 0.98)';
  }

  const bgStyle = {
    background: `
      radial-gradient(at 0% 0%, ${c1} 0px, transparent 55%),
      radial-gradient(at 100% 100%, ${c2} 0px, transparent 55%),
      radial-gradient(at 50% 50%, rgba(20, 184, 166, 0.05) 0px, transparent 65%),
      ${c3}
    `,
  };

  return (
    <div
      style={bgStyle}
      className="living-bg min-h-[100dvh] w-full text-slate-100 flex flex-col relative overflow-x-hidden"
    >
      {children}
    </div>
  );
}
