import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { GirlWalking } from '../components/illustrations/GirlWalking';

interface NotFoundScreenProps {
  onNavigate: (screen: string) => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center space-y-4 font-body">
      <GirlWalking className="w-40 h-48 mb-2" />
      <h2 className="font-display text-4xl text-[var(--ink)]">Lost? <span className="italic text-[var(--pink-deep)]">Let&apos;s get you back.</span></h2>
      <p className="font-display italic text-2xl text-[var(--ink)]/80 max-w-sm mb-4 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => onNavigate('home')}
        className="px-6 py-3.5 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-sm font-bold shadow-[4px_4px_0_var(--pink-deep)] hover:opacity-95 transition flex items-center gap-2 border-2 border-[var(--ink)]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Saathi Home</span>
      </button>
    </div>
  );
};
