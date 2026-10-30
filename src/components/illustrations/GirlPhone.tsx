import React from 'react';

export const GirlPhone: React.FC<{ className?: string }> = ({ className = "w-48 h-56" }) => (
  <svg viewBox="0 0 250 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hair */}
    <path d="M110 50 Q80 80 75 130 Q70 170 85 200 Q70 150 80 110 Q95 70 110 50 Z" fill="var(--ink)" />
    
    {/* Face */}
    <circle cx="130" cy="75" r="28" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3" />
    <path d="M102 65 Q130 35 158 65 Q140 50 102 65 Z" fill="var(--ink)" />
    
    {/* Eyes & Expression */}
    <circle cx="120" cy="72" r="2.5" fill="var(--ink)" />
    <circle cx="140" cy="72" r="2.5" fill="var(--ink)" />
    <path d="M126 86 Q130 90 134 86" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Body */}
    <path d="M105 105 Q130 100 155 105 L170 200 Q130 215 90 200 Z" fill="var(--pink-deep)" stroke="var(--ink)" strokeWidth="3" />
    
    {/* Holding Phone */}
    <path d="M115 125 Q95 150 110 170" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <rect x="100" y="155" width="22" height="32" rx="5" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2.5" />
  </svg>
);
