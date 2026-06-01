import React, { useState, useEffect } from 'react';
import { Shrink, Download } from 'lucide-react';
import { Compressor } from './components/Compressor';
import { OfflineOverlay } from './components/OfflineOverlay';

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
    
    const mql = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mql.addEventListener('change', handleDisplayModeChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mql.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[#FEF7FF] flex flex-col items-center p-6 md:p-12 pb-24 md:pb-12 overflow-x-hidden text-[#1C1B1F]">
      <OfflineOverlay />
      
      {/* Header Container */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-8 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6750A4] rounded-xl flex items-center justify-center">
            <Shrink className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-slate-800">
            Compix<span className="text-[#6750A4]">.</span>
          </span>
        </div>
        {(!isStandalone && isInstallable) && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#6750A4] text-white shadow-md shadow-[#6750A4]/20 rounded-xl hover:bg-[#55408a] transition-all font-bold text-sm transform active:scale-95"
            title="Install App"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}
      </header>
      
      {/* Main Container */}
      <main className="bg-white border border-[#EADDFF] rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden w-full max-w-5xl flex flex-col mb-8">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#EADDFF] via-[#6750A4] to-[#EADDFF]"></div>
        
        <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-slate-800 font-display font-bold text-3xl md:text-4xl mb-4">
            Compress without losing quality
          </h2>
          <p className="text-slate-600 font-sans font-medium">
            Fast, secure, and private browser-based image compression. Your files never leave your device.
          </p>
        </div>

        <Compressor />
      </main>
    </div>
  );
}
