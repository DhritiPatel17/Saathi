import React, { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) return null;

  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstall}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--sage)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] text-xs font-bold hover:translate-y-[-1px] transition"
        title="Install Saathi App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] text-xs font-bold text-[var(--ink)] hover:bg-[var(--pink-pale)] transition"
        >
          <Share2 className="w-3.5 h-3.5 text-[var(--pink-deep)]" />
          <span>iOS Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="poster-glass w-full max-w-sm p-6 relative bg-[var(--cream)] border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)]">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-[var(--ink)] hover:text-[var(--pink-deep)]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-syne text-lg font-bold text-[var(--ink)] mb-2">Install Saathi on iPhone</h3>
              <p className="text-sm font-medium text-[var(--ink)]/80 mb-4 leading-relaxed font-caveat text-xl">
                1. Tap the Share button in Safari.<br />
                2. Tap &ldquo;Add to Home Screen&rdquo;.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-sm font-bold shadow-[3px_3px_0_var(--pink-deep)]"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
