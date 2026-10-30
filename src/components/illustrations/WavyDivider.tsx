import React from 'react';

export const WavyDivider: React.FC<{ className?: string }> = ({ className = "w-full my-6" }) => (
  <div className={className}>
    <svg viewBox="0 0 1200 24" className="w-full h-4" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round">
      <path d="M0 12 q50 -12 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0" />
    </svg>
  </div>
);
