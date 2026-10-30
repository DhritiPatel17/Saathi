import React from 'react';

export const GirlWalking: React.FC<{ className?: string }> = ({ className = "w-64 h-80" }) => (
  <svg viewBox="0 0 300 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Solid Black Hair flowing */}
    <path d="M120 70 Q90 100 80 150 Q75 190 90 220 Q70 180 80 130 Q90 90 120 70 Z" fill="var(--ink)" />
    
    {/* Pink Fill Skin & Body */}
    {/* Head / Face */}
    <circle cx="150" cy="90" r="35" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3" />
    
    {/* Hair top */}
    <path d="M115 80 Q150 40 185 80 Q160 60 115 80 Z" fill="var(--ink)" />
    
    {/* Confident Face Features */}
    <circle cx="140" cy="85" r="3" fill="var(--ink)" />
    <circle cx="160" cy="85" r="3" fill="var(--ink)" />
    <path d="M145 102 Q150 108 155 102" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Body / Outfit (Pink Dress / Jacket) */}
    <path d="M125 125 Q150 120 175 125 L190 240 Q150 260 110 240 Z" fill="var(--pink-deep)" stroke="var(--ink)" strokeWidth="3" />
    
    {/* Arms & Phone */}
    <path d="M125 140 Q90 180 110 210" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Phone in hand */}
    <rect x="100" y="200" width="18" height="28" rx="4" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2.5" />
    
    {/* Other Arm with Bag */}
    <path d="M175 140 Q210 170 200 220" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Shoulder bag */}
    <path d="M170 145 Q190 170 180 200" stroke="var(--ink)" strokeWidth="3" fill="none" />
    <rect x="175" y="195" width="24" height="30" rx="6" fill="var(--ink)" stroke="var(--cream)" strokeWidth="2" />

    {/* Legs / Walking */}
    <path d="M130 250 L115 360" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
    <path d="M170 250 L195 350" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
    
    {/* Shoes */}
    <ellipse cx="110" cy="365" rx="12" ry="6" fill="var(--ink)" />
    <ellipse cx="200" cy="355" rx="12" ry="6" fill="var(--ink)" />
  </svg>
);
