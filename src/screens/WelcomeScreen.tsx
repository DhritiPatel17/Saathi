import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GirlWalking } from '../components/illustrations/GirlWalking';
import { SpiralScribble, SpeechBubbleSticker } from '../components/illustrations/Scribbles';
import { OpeningAnimation } from '../components/illustrations/OpeningAnimation';

interface WelcomeScreenProps {
  onNavigate: (screen: 'signup' | 'login') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('saathi_intro_played');
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('saathi_intro_played', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <OpeningAnimation onComplete={handleIntroComplete} />}

      <div className="min-h-[calc(100vh-65px)] grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto overflow-hidden">
        {/* Left Cream Half */}
        <div className="lg:col-span-7 px-6 md:px-12 py-10 flex flex-col justify-between">
          <div>
            <div className="inline-block relative mb-4">
              <SpeechBubbleSticker text="Together, we walk safely." className="rotate-[-4deg]" />
            </div>

            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--ink)] leading-[0.95] mb-4">
              Walk home. <br />
              <span className="relative inline-block italic text-[var(--pink-deep)]">
                We walk
                <svg
                  className="absolute left-0 -bottom-1.5 md:-bottom-2 w-full h-3 md:h-3.5 overflow-visible pointer-events-none"
                  viewBox="0 0 200 16"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 C 20 1, 35 15, 52 8 C 69 1, 84 15, 101 8 C 118 1, 133 15, 150 8 C 167 1, 182 15, 198 8"
                    stroke="var(--pink-deep)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    className="wavy-underline-draw"
                  />
                </svg>
              </span>{' '}
              with you.
            </h1>

            {/* Tagline with Caveat (600), 30px, "Never" in pink-deep */}
            <div className="mb-8">
              <p className="font-tagline text-[30px] font-semibold text-[var(--ink)] inline-block">
                Saathi means companion.{' '}
                <span className="text-[var(--pink-deep)]">Never</span> walk alone.
              </p>
            </div>

            {/* 3 Step Cards with Bricolage Grotesque weight 800 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Card 1: Bricolage Grotesque weight 800 */}
              <div className="poster-glass p-4 relative bg-white/60">
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--pink-deep)] text-white font-body font-bold flex items-center justify-center text-sm border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                  1
                </span>
                <div className="mt-2">
                  <h3 className="font-card-title text-xl font-[800] text-[var(--ink)] mb-1">One Tap SOS</h3>
                  <p className="font-body text-sm text-[var(--ink)]/80 font-normal">No typing, no calling. Just press and hold. Tapped by mistake? Cancel within 5 seconds.</p>
                </div>
              </div>

              {/* Card 2: Bricolage Grotesque weight 800 */}
              <div className="poster-glass p-4 relative bg-white/60">
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--pink-deep)] text-white font-body font-bold flex items-center justify-center text-sm border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                  2
                </span>
                <div className="mt-2">
                  <h3 className="font-card-title text-xl font-[800] text-[var(--ink)] mb-1">Guardians &amp; Helpers</h3>
                  <p className="font-body text-sm text-[var(--ink)]/80 font-normal">Live location sent to contacts &amp; nearby Saathi women.</p>
                </div>
              </div>

              {/* Card 3: Bricolage Grotesque weight 800 */}
              <div className="poster-glass p-4 relative bg-white/60">
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--pink-deep)] text-white font-body font-bold flex items-center justify-center text-sm border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                  3
                </span>
                <div className="mt-2">
                  <h3 className="font-card-title text-xl font-[800] text-[var(--ink)] mb-1">Police Station</h3>
                  <p className="font-body text-sm text-[var(--ink)]/80 font-normal">Nearest police station route and walking time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 max-w-md">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-4 rounded-2xl bg-[var(--ink)] text-[var(--cream)] font-body font-bold text-base shadow-[6px_6px_0_var(--pink-deep)] hover:translate-y-[-2px] transition flex items-center justify-center gap-3 border-2 border-[var(--ink)]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3.5 rounded-2xl poster-glass text-[var(--ink)] font-body font-bold text-sm hover:bg-white/60 transition shadow-[4px_4px_0_var(--ink)] border-2 border-[var(--ink)] bg-white/70"
            >
              I already have an account
            </button>

            <p
              className="text-center font-tagline text-[var(--ink)]/80 pt-2 whitespace-nowrap"
              style={{ fontSize: 'clamp(11px, 3.2vw, 14px)' }}
            >
              Your location is private and shared only when you press SOS.
            </p>
          </div>
        </div>

        {/* Right Black Half */}
        <div className="lg:col-span-5 bg-[var(--ink)] px-8 py-12 flex flex-col items-center justify-center relative overflow-hidden border-t-2 lg:border-t-0 lg:border-l-2 border-[var(--ink)]">
          <div className="absolute top-6 left-6 opacity-20">
            <SpiralScribble className="w-32 h-32 text-[var(--pink)]" />
          </div>

          <div className="relative z-10 text-center space-y-6">
            <div className="p-4 inline-block">
              <GirlWalking className="w-72 h-96 drop-shadow-[8px_8px_0_var(--pink-deep)]" />
            </div>

            <div className="poster-glass-black p-6 text-left max-w-sm mx-auto shadow-[6px_6px_0_var(--pink)]">
              <p className="font-display italic text-3xl text-[var(--cream)] mb-1">
                &ldquo;You walked home safely.&rdquo;
              </p>
              <p className="font-body text-sm text-[var(--cream)]/80 font-normal">
                Designed for women everywhere who refuse to walk in fear.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
