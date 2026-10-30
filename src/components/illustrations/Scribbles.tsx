import React from 'react';

export const SpiralScribble: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-16 h-16", style }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="var(--pink-deep)" strokeWidth="3" strokeLinecap="round">
    <path d="M50 50 c10 -15 25 -5 20 10 c-5 15 -25 15 -30 0 c-5 -15 10 -30 25 -25 c15 5 20 25 10 35 c-10 10 -30 5 -35 -10" />
  </svg>
);

export const TangledLoop: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-20 h-20", style }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 50 q30 -40 60 0 t-60 40 t60 -20" />
  </svg>
);

export const TapeStrip: React.FC<{ className?: string }> = ({ className = "w-16 h-6" }) => (
  <div className={`bg-amber-100/70 border border-amber-300 shadow-sm rotate-[-2deg] opacity-80 ${className}`} style={{ clipPath: 'polygon(2% 0%, 98% 3%, 100% 97%, 0% 100%)' }} />
);

export const SpeechBubbleSticker: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => (
  <div className={`relative bg-white border-2 border-[var(--ink)] px-4 py-2 rounded-2xl shadow-[4px_4px_0_var(--ink)] font-caveat text-lg font-bold rotate-[-3deg] ${className}`}>
    <span>{text}</span>
    <div className="absolute -bottom-2.5 left-4 w-3 h-3 bg-white border-b-2 border-r-2 border-[var(--ink)] rotate-45" />
  </div>
);
