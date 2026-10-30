import React from 'react';
import { Shield, User as UserIcon } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onNavigate: (screen: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-3.5 poster-nav border-b-2 border-[var(--ink)]">
      {/* Brand Wordmark (Syne ONLY for Saathi) */}
      <button 
        onClick={() => onNavigate(user ? 'home' : 'welcome')}
        className="flex items-center gap-2.5 text-left focus:outline-none group"
      >
        <div className="w-10 h-10 rounded-2xl bg-[var(--pink-deep)] border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-center text-white group-hover:rotate-3 transition-transform">
          <Shield className="w-5 h-5 fill-current" />
        </div>
        <div>
          <span className="font-brand text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            S<span className="text-[var(--pink-deep)]">A</span>ATHI
          </span>
          <span className="block font-hand text-sm text-[var(--ink)] font-bold -mt-1.5">
            Never walk alone
          </span>
        </div>
      </button>

      {/* Navigation Links (Desktop) */}
      {user && (
        <nav className="hidden md:flex items-center gap-6 text-base font-bold font-body text-[var(--ink)]">
          <button onClick={() => onNavigate('home')} className="hover:text-[var(--pink-deep)] transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('map')} className="hover:text-[var(--pink-deep)] transition-colors">
            Safety Map
          </button>
          <button onClick={() => onNavigate('contacts')} className="hover:text-[var(--pink-deep)] transition-colors">
            Guardians
          </button>
          <button onClick={() => onNavigate('profile')} className="hover:text-[var(--pink-deep)] transition-colors">
            Profile &amp; Tips
          </button>
        </nav>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <PWAInstallButton />
        {user ? (
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] text-xs font-bold font-body text-[var(--ink)] hover:bg-[var(--pink-pale)] transition"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--pink)] flex items-center justify-center text-white">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-xs font-bold font-body shadow-[2px_2px_0_var(--pink-deep)] hover:translate-y-[-1px] transition"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
