import React from 'react';

export const GirlSafe: React.FC<{ className?: string }> = ({ className = "w-48 h-56" }) => (
  <svg viewBox="0 0 250 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hair */}
    <path d="M100 50 Q75 80 70 130 Q65 170 80 200 Q95 130 100 50 Z" fill="var(--ink)" />
    <path d="M160 50 Q185 80 190 130 Q195 170 180 200 Q165 130 160 50 Z" fill="var(--ink)" />
    
    {/* Face & Smile */}
    <circle cx="130" cy="75" r="28" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3" />
    <path d="M102 65 Q130 35 158 65 Q140 50 102 65 Z" fill="var(--ink)" />
    <circle cx="120" cy="72" r="2.5" fill="var(--ink)" />
    <circle cx="140" cy="72" r="2.5" fill="var(--ink)" />
    <path d="M122 85 Q130 95 138 85" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Body */}
    <path d="M105 105 Q130 100 155 105 L170 200 Q130 215 90 200 Z" fill="var(--sage)" stroke="var(--ink)" strokeWidth="3" />
    
    {/* Sage Sparkles around */}
    <path d="M60 70 L65 75 L60 80 L55 75 Z" fill="var(--sage)" />
    <path d="M200 100 L205 105 L200 110 L195 105 Z" fill="var(--sage)" />
    <circle cx="180" cy="50" r="4" fill="var(--pink)" />
  </svg>
);
