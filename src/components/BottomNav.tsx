import React from 'react';
import { Home, Map, Users, User, AlertCircle } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
  hasActiveSos: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, hasActiveSos }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'contacts', label: 'Guardians', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden max-w-md mx-auto">
      <div className="poster-glass-black px-4 py-2.5 flex items-center justify-around shadow-[4px_4px_0_var(--pink-deep)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all font-body ${
                isActive
                  ? 'text-[var(--pink)] font-bold scale-105 bg-white/10'
                  : 'text-[var(--cream)]/70 hover:text-[var(--cream)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
        {hasActiveSos && (
          <button
            onClick={() => onNavigate('sos-active')}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[var(--cream)] font-bold animate-bounce bg-[var(--pink-deep)] border border-white font-body"
          >
            <AlertCircle className="w-5 h-5 fill-current text-white" />
            <span className="text-[9px] font-extrabold uppercase">SOS</span>
          </button>
        )}
      </div>
    </div>
  );
};
