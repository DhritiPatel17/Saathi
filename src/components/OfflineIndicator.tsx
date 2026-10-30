import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 flex items-center gap-3 rounded-2xl bg-[var(--ink)] text-[var(--cream)] px-4 py-3 shadow-[4px_4px_0_var(--pink-deep)] border-2 border-[var(--cream)]">
      <WifiOff className="w-5 h-5 text-[var(--pink)] shrink-0 animate-pulse" />
      <div>
        <h4 className="text-xs font-syne font-bold uppercase tracking-wider">Offline Mode</h4>
        <p className="text-[11px] font-caveat text-lg text-[var(--cream)]/90">Cached safety data is active.</p>
      </div>
    </div>
  );
};
