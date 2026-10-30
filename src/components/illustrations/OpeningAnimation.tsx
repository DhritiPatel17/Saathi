import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GirlWalking } from './GirlWalking';
import { SpiralScribble } from './Scribbles';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStep(1), 1000);
    const t2 = setTimeout(() => setStep(2), 2200);
    const t3 = setTimeout(() => setStep(3), 3400);
    const t4 = setTimeout(() => {
      onComplete();
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--cream)] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-6 right-6">
        <button
          onClick={onComplete}
          className="px-4 py-2 rounded-full border-2 border-[var(--ink)] text-xs font-bold font-body hover:bg-[var(--ink)] hover:text-[var(--cream)] transition"
        >
          Skip Intro →
        </button>
      </div>

      <div className="relative flex flex-col items-center max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <GirlWalking className="w-56 h-72 drop-shadow-[6px_6px_0_var(--ink)]" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: step >= 2 ? 1 : 0 }}
            className="absolute -top-4 -right-12"
          >
            <SpiralScribble className="w-16 h-16 animate-spin" style={{ animationDuration: '10s' }} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: step >= 3 ? 0 : 20, opacity: step >= 3 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="font-brand text-5xl font-extrabold tracking-tight text-[var(--ink)]">
            S<span className="text-[var(--pink-deep)]">A</span>ATHI
          </h1>
          <p className="font-display italic text-3xl text-[var(--pink-deep)]">
            &ldquo;You are never walking alone.&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  );
};
