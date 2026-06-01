import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineOverlay() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#FEF7FF]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-white text-[#6750A4] border border-[#EADDFF] shadow-sm rounded-xl flex items-center justify-center mb-5">
        <WifiOff className="w-8 h-8" />
      </div>
      <h2 className="text-slate-800 font-display font-bold text-2xl mb-2">You're offline</h2>
      <p className="text-slate-600 font-sans font-medium max-w-sm">
        Compix works locally on your device! You can continue compressing images even without an internet connection.
      </p>
      <button 
        onClick={() => setIsOffline(false)}
        className="mt-8 px-8 py-3 bg-[#6750A4] text-white font-bold rounded-2xl hover:bg-[#55408a] transition-colors shadow-sm"
      >
        Got it
      </button>
    </div>
  );
}
