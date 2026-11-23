import React, { useState, useEffect } from 'react';
import { Feather } from 'lucide-react';

interface PaperIntroSplashProps {
  onComplete: () => void;
}

export const PaperIntroSplash: React.FC<PaperIntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'ENTERING' | 'LINGERING' | 'FLYING' | 'DONE'>('ENTERING');

  useEffect(() => {
    // 1. Masuk halus ("sruuttt..."): 0 -> 2.0 detik
    const t1 = setTimeout(() => {
      setPhase('LINGERING');
    }, 2000);

    // 2. Berdiam tenang di layar (jeda napas, menikmati tulisan): 2.0 -> 5.8 detik (3.8 detik berdiam!)
    const t2 = setTimeout(() => {
      setPhase('FLYING');
    }, 5800);

    // 3. Ilang... terbang perlahan ke atas tertiup angin: 5.8 -> 8.0 detik (2.2 detik terbang lambat)
    const t3 = setTimeout(() => {
      setPhase('DONE');
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (phase === 'DONE') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#F9F6EE] transition-opacity duration-[2200ms] ease-in-out ${
        phase === 'FLYING' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(#E8E0CE 0.8px, transparent 0.8px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Central Flying Calligraphy Block */}
      <div
        className={`relative text-center px-6 select-none transition-all duration-[2200ms] transform ease-out ${
          phase === 'ENTERING'
            ? 'opacity-0 scale-95 translate-y-8 blur-[3px]'
            : phase === 'LINGERING'
            ? 'opacity-100 scale-100 translate-y-0 blur-0'
            : 'opacity-0 scale-[0.88] -translate-y-40 -rotate-[8deg] blur-[5px]'
        }`}
      >
        {/* Subtle decorative ink pen flourish */}
        <div
          className={`flex justify-center mb-4 transition-all duration-1000 ${
            phase === 'LINGERING' ? 'opacity-70 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="w-11 h-11 rounded-full border border-[#DED7C5] flex items-center justify-center bg-[#F4EFE3] text-[#172132] shadow-2xs">
            <Feather className="w-4 h-4 -rotate-12" />
          </div>
        </div>

        {/* Latin Sambung / Cursive "Nama Kertas" */}
        <h1
          className="font-script text-8xl sm:text-[110px] md:text-[145px] text-[#172132] leading-none tracking-normal drop-shadow-xs"
          style={{ letterSpacing: '0.015em' }}
        >
          Nama Kertas
        </h1>

        {/* Subtitle tag */}
        <p
          className={`font-serif italic text-xs sm:text-sm text-[#7A746A] tracking-[0.3em] uppercase mt-3 transition-opacity duration-1000 ${
            phase === 'LINGERING' ? 'opacity-80' : 'opacity-0'
          }`}
        >
          surat yang ditinggal di meja
        </p>

        {/* Subtle ink divider line */}
        <div
          className={`w-28 h-px bg-[#D6CEBC] mx-auto mt-7 transition-all duration-1000 ${
            phase === 'LINGERING' ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-50'
          }`}
        ></div>
      </div>

      {/* Skip button for quick reading */}
      <button
        onClick={() => {
          setPhase('DONE');
          onComplete();
        }}
        className="absolute bottom-8 right-8 text-[11px] font-serif text-[#8A847A] hover:text-[#172132] transition-colors cursor-pointer uppercase tracking-widest opacity-60 hover:opacity-100"
      >
        Lewati pembuka →
      </button>
    </div>
  );
};
