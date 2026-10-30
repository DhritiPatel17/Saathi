import React from 'react';

export const GirlWriting: React.FC<{ className?: string }> = ({ className = "w-48 h-56" }) => (
  <svg viewBox="0 0 250 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hair */}
    <path d="M100 60 Q70 90 60 140 Q55 180 70 200 Q50 160 65 110 Q80 70 100 60 Z" fill="var(--ink)" />
    
    {/* Face */}
    <circle cx="125" cy="80" r="30" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3" />
    <path d="M95 70 Q125 40 155 70 Q135 55 95 70 Z" fill="var(--ink)" />
    
    {/* Eyes & Smile */}
    <circle cx="115" cy="75" r="2.5" fill="var(--ink)" />
    <circle cx="135" cy="75" r="2.5" fill="var(--ink)" />
    <path d="M120 90 Q125 95 130 90" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Torso */}
    <path d="M100 110 Q125 105 150 110 L165 210 Q125 225 85 210 Z" fill="var(--pink-deep)" stroke="var(--ink)" strokeWidth="3" />
    
    {/* Hand writing */}
    <path d="M110 130 Q90 150 115 170" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);
