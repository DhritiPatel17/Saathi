import React, { useState, useEffect, useRef } from 'react';
import { User, EmergencyContact } from '../types';
import { storage } from '../services/storage';
import { MapPin, Users, ChevronRight, X } from 'lucide-react';
import { SpiralScribble } from '../components/illustrations/Scribbles';

interface HomeScreenProps {
  user: User;
  contacts: EmergencyContact[];
  onTriggerSos: () => void;
  onNavigate: (screen: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, contacts, onTriggerSos, onNavigate }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  
  const holdTimerRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);

  const [locationStatus, setLocationStatus] = useState<'checking' | 'active' | 'denied'>('checking');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus('active');
        },
        (err) => {
          console.warn('Geolocation denied or unavailable', err);
          setLocationStatus('denied');
          setCoords({ lat: 19.076, lng: 72.8777 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus('denied');
      setCoords({ lat: 19.076, lng: 72.8777 });
    }
  }, []);

  const startHold = () => {
    if (user.quickTapMode) {
      triggerSosCountdown();
      return;
    }

    setIsHolding(true);
    setHoldProgress(0);
    
    if ('vibrate' in navigator) {
      try { navigator.vibrate(50); } catch (e) {}
    }

    const startTime = Date.now();
    const duration = 1500;

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdTimerRef.current);
        setIsHolding(false);
        if ('vibrate' in navigator) {
          try { navigator.vibrate([200, 100, 200]); } catch (e) {}
        }
        triggerSosCountdown();
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const triggerSosCountdown = () => {
    setShowCountdown(true);
    setCountdownSeconds(5);

    countdownTimerRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          setShowCountdown(false);
          onTriggerSos();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSosCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    setShowCountdown(false);
    setCountdownSeconds(5);
  };

  const firstLetter = user.name.charAt(0);
  const restName = user.name.slice(1);

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-between px-4 py-6 max-w-lg mx-auto pb-24 space-y-4 font-body">
      {/* Top Greeting & Status */}
      <div className="flex items-center justify-between poster-glass p-4 bg-white/70 border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
        <div>
          <span className="font-display italic text-2xl text-[var(--pink-deep)]">Safety Dashboard</span>
          <h2 className="font-display text-4xl text-[var(--ink)] leading-none mt-0.5">
            Hi, <span className="text-[var(--pink-deep)]">{firstLetter}</span>{restName} 👋
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--sage)]/30 border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--sage)] animate-pulse border border-[var(--ink)]" />
          <span className="text-xs font-bold text-[var(--ink)]">Protected</span>
        </div>
      </div>

      {/* GPS Status Banner */}
      <div className="poster-glass p-3.5 flex items-center justify-between bg-white/50 border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--pink)]/20 border-2 border-[var(--ink)] text-[var(--ink)] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[var(--pink-deep)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[var(--ink)]">GPS Location Status</p>
            <p className="font-display italic text-2xl text-[var(--ink)] leading-none">
              {locationStatus === 'active' ? 'Active & Precise' : 'Default Area (GPS unavailable)'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('map')}
          className="text-xs font-bold text-[var(--pink-deep)] hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
        >
          <span>Map</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CENTER: HUGE SOS POSTER BUTTON */}
      <div className="my-auto text-center py-6 flex flex-col items-center relative">
        <div className="absolute -top-6 -left-4 opacity-50">
          <SpiralScribble className="w-24 h-24" />
        </div>

        <p className="font-display italic text-3xl text-[var(--pink-deep)] mb-4">
          {user.quickTapMode ? '⚡ Quick Tap Mode Active' : 'Press. Alert. Reach safety.'}
        </p>

        <div className="relative my-2">
          {/* Outer Pulse Ring */}
          <div className="absolute inset-0 rounded-full sos-poster-pulse opacity-70 bg-[var(--pink-deep)] transform scale-125" />

          {/* Hold progress ring */}
          {isHolding && (
            <svg className="absolute -inset-6 w-56 h-56 pointer-events-none transform -rotate-90 z-20">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="var(--ink)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="var(--pink-deep)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 * (1 - holdProgress / 100)}
                className="transition-all duration-30"
              />
            </svg>
          )}

          <button
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            onClick={user.quickTapMode ? triggerSosCountdown : undefined}
            className="relative z-10 w-44 h-44 md:w-52 md:h-52 rounded-full bg-[var(--pink-deep)] text-white font-display text-6xl md:text-7xl font-bold tracking-wider shadow-[8px_8px_0_var(--ink)] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none cursor-pointer border-4 border-[var(--ink)]"
          >
            <span>SOS</span>
            <span className="text-[12px] font-body tracking-normal font-bold mt-1 text-[var(--cream)]">
              {user.quickTapMode ? 'Tap Now' : isHolding ? `${Math.round(holdProgress)}%` : 'Hold 1.5s'}
            </span>
          </button>
        </div>

        <p className="font-display italic text-2xl text-[var(--ink)] mt-6 max-w-xs">
          Instantly alerts your contacts, nearby Saathi women, &amp; police.
        </p>
      </div>

      {/* Emergency Contacts Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
            Guardians ({contacts.length}/3)
          </span>
          <button
            onClick={() => onNavigate('contacts')}
            className="font-display italic text-2xl text-[var(--pink-deep)] font-bold hover:underline"
          >
            Manage Guardians →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {contacts.map((c) => (
            <div key={c.id} className="poster-glass p-3 text-center flex flex-col items-center bg-white/70 border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
              <div className="w-10 h-10 rounded-full bg-[var(--pink)] text-white border-2 border-[var(--ink)] flex items-center justify-center font-bold text-sm mb-1.5 shadow-[2px_2px_0_var(--ink)]">
                {c.name.charAt(0)}
              </div>
              <h4 className="font-display text-xl font-bold text-[var(--ink)] truncate w-full">{c.name}</h4>
              <p className="font-hand text-xl text-[var(--pink-deep)] font-bold">{c.relationship}</p>
            </div>
          ))}

          {contacts.length < 3 && (
            <button
              onClick={() => onNavigate('contacts')}
              className="poster-glass p-3 text-center flex flex-col items-center justify-center border-2 border-dashed border-[var(--ink)] hover:bg-white/80 transition shadow-[4px_4px_0_var(--ink)] bg-white/40"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--ink)] text-[var(--cream)] flex items-center justify-center mb-1">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[var(--ink)]">+ Add</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Second Countdown Modal */}
      {showCountdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn font-body">
          <div className="poster-glass w-full max-w-sm p-8 text-center bg-[var(--cream)] shadow-[10px_10px_0_var(--pink-deep)] border-4 border-[var(--ink)]">
            <div className="w-24 h-24 rounded-full bg-[var(--pink-deep)] text-white font-display text-5xl font-bold flex items-center justify-center mx-auto mb-4 border-4 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] animate-pulse">
              {countdownSeconds}
            </div>
            <h3 className="font-display text-4xl text-[var(--ink)] mb-2">
              SOS <span className="italic text-[var(--pink-deep)]">Triggering...</span>
            </h3>
            <p className="font-display italic text-2xl text-[var(--ink)] mb-6">
              Alerts dispatch in {countdownSeconds}s. Tap Cancel if accidental.
            </p>
            <button
              onClick={cancelSosCountdown}
              className="w-full py-4 rounded-2xl bg-[var(--sage)] text-[var(--ink)] font-bold text-base shadow-[4px_4px_0_var(--ink)] hover:opacity-95 transition flex items-center justify-center gap-2 border-2 border-[var(--ink)]"
            >
              <X className="w-5 h-5" />
              <span>CANCEL SOS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
