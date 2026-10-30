import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';
import { Lock, LogOut, Trash2, CheckCircle2, BookOpen, AlertTriangle } from 'lucide-react';

interface ProfileScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdateUser, onLogout }) => {
  const [helperOptIn, setHelperOptIn] = useState(user.helperOptIn);
  const [quickTapMode, setQuickTapMode] = useState(user.quickTapMode);
  const [safePin, setSafePin] = useState(user.safePin || '1234');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleHelper = () => {
    const next = !helperOptIn;
    setHelperOptIn(next);
    const updated = { ...user, helperOptIn: next };
    storage.saveUser(updated);
    onUpdateUser(updated);
    showSuccess();
  };

  const handleToggleQuickTap = () => {
    const next = !quickTapMode;
    setQuickTapMode(next);
    const updated = { ...user, quickTapMode: next };
    storage.saveUser(updated);
    onUpdateUser(updated);
    showSuccess();
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (safePin.length !== 4) {
      alert('Safe PIN must be 4 digits.');
      return;
    }
    const updated = { ...user, safePin };
    storage.saveUser(updated);
    onUpdateUser(updated);
    showSuccess();
  };

  const showSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete your Saathi profile and data? This cannot be undone.')) {
      storage.clearUser();
      onLogout();
    }
  };

  const safetyTips = [
    { title: 'Share Trip', desc: 'Always let a trusted guardian know your estimated arrival time when walking alone.' },
    { title: 'Stay in Lit Areas', desc: 'Stick to well-lit main streets and avoid dark alleyways or shortcuts at night.' },
    { title: 'Confident Posture', desc: 'Walk with your head up and stay aware of your surroundings.' },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col px-4 py-6 max-w-xl mx-auto pb-24 space-y-6 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-[var(--ink)]">Profile &amp; <span className="italic text-[var(--pink-deep)]">Settings</span></h2>
          <p className="font-display italic text-2xl text-[var(--pink-deep)]">Customize your Saathi experience.</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--sage)] text-[var(--ink)] font-bold text-xs border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* User Info Card */}
      <div className="poster-glass p-5 bg-white/80 border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--pink-deep)] text-white border-2 border-[var(--ink)] flex items-center justify-center font-bold text-xl shadow-[3px_3px_0_var(--ink)]">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-[var(--ink)]">{user.name}</h3>
            <p className="font-hand text-2xl text-[var(--ink)]/80">{user.phone} • {user.occupation}</p>
            {user.city && <p className="text-xs font-bold text-[var(--pink-deep)]">City: {user.city}</p>}
          </div>
        </div>
      </div>

      {/* Settings Toggles */}
      <div className="poster-glass p-5 bg-white/70 border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] space-y-4">
        <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">Safety Preferences</h3>

        <div className="flex items-center justify-between py-2 border-b-2 border-[var(--ink)]/10">
          <div>
            <h4 className="font-display text-2xl font-bold text-[var(--ink)]">Nearby Helper Network</h4>
            <p className="font-hand text-2xl text-[var(--ink)]/80">Allow other Saathi women nearby to notify you if they need help.</p>
          </div>
          <button
            onClick={handleToggleHelper}
            className={`w-14 h-7 rounded-full transition p-1 border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] ${helperOptIn ? 'bg-[var(--sage)]' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-[var(--ink)] transition-transform ${helperOptIn ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-display text-2xl font-bold text-[var(--ink)]">Quick Tap Mode</h4>
            <p className="font-hand text-2xl text-[var(--ink)]/80">Trigger SOS with 1 tap (3s cancel window) instead of 1.5s hold.</p>
          </div>
          <button
            onClick={handleToggleQuickTap}
            className={`w-14 h-7 rounded-full transition p-1 border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] ${quickTapMode ? 'bg-[var(--pink-deep)]' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-[var(--ink)] transition-transform ${quickTapMode ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Safe PIN Setup */}
      <form onSubmit={handleUpdatePin} className="poster-glass p-5 bg-white/70 border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] space-y-3">
        <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-[var(--pink-deep)]" />
          <span>Safe Cancellation PIN</span>
        </h3>
        <p className="font-hand text-2xl text-[var(--ink)]/80">Required to cancel an active SOS state.</p>

        <div className="flex gap-3">
          <input
            type="password"
            maxLength={4}
            value={safePin}
            onChange={(e) => setSafePin(e.target.value.replace(/\D/g, ''))}
            className="w-32 text-center tracking-[0.5em] text-lg font-bold py-2 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-[var(--ink)]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-xs font-bold shadow-[3px_3px_0_var(--pink-deep)] hover:opacity-95 transition border-2 border-[var(--ink)]"
          >
            Update PIN
          </button>
        </div>
      </form>

      {/* Safety Tips */}
      <div className="poster-glass p-5 bg-white/70 border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] space-y-3">
        <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[var(--sage)]" />
          <span>Essential Safety Tips</span>
        </h3>

        <div className="space-y-2.5">
          {safetyTips.map((tip, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)]">
              <h4 className="font-display text-2xl font-bold text-[var(--ink)] mb-0.5">{tip.title}</h4>
              <p className="font-hand text-2xl text-[var(--ink)]/80 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] text-[var(--ink)] text-xs flex gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
        <p className="font-hand text-2xl leading-snug">
          <strong>Disclaimer:</strong> Saathi is a companion app and does not replace official emergency services. In severe danger, always call 112 immediately.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onLogout}
          className="flex-1 py-3.5 rounded-xl bg-white border-2 border-[var(--ink)] text-[var(--ink)] font-bold text-xs shadow-[4px_4px_0_var(--ink)] hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <button
          onClick={handleDeleteData}
          className="flex-1 py-3.5 rounded-xl bg-red-100 border-2 border-[var(--ink)] text-red-700 font-bold text-xs shadow-[4px_4px_0_var(--pink-deep)] hover:bg-red-200 transition flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  );
};
