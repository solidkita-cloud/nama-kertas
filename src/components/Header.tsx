import React from 'react';
import { Feather, ArrowRight, PenLine, Volume2, VolumeX, Play, Pause, Sparkles, ShieldAlert, ShieldCheck, Lock, FileEdit } from 'lucide-react';
import type { User as UserType, Rasa } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface HeaderProps {
  currentUser: UserType;
  onOpenRename: () => void;
  onOpenWrite: () => void;
  onGoHome: () => void;
  onReplayIntro: () => void;
  onOpenQuarantine: () => void;
  quarantineCount: number;
  currentAmbientRasa: Rasa | null;
  onToggleAdmin: () => void;
  draftCount: number;
  onOpenDrafts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenRename,
  onOpenWrite,
  onGoHome,
  onReplayIntro,
  onOpenQuarantine,
  quarantineCount,
  currentAmbientRasa,
  onToggleAdmin,
  draftCount,
  onOpenDrafts,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(audioEngine.getIsPlaying());
  const [isMuted, setIsMuted] = React.useState(audioEngine.getIsMuted());

  React.useEffect(() => {
    setIsPlaying(audioEngine.getIsPlaying());
    setIsMuted(audioEngine.getIsMuted());
  }, [currentAmbientRasa]);

  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(currentAmbientRasa || 'GUNJING');
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const m = audioEngine.toggleMute();
    setIsMuted(m);
  };

  return (
    <header className="w-full bg-[#F9F6EE] border-b border-[#EBE4D5] py-4">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full border border-[#DED7C5] flex items-center justify-center bg-[#F4EFE3] text-[#172132] group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-editorial text-xl font-bold text-[#172132] leading-tight tracking-tight">
                Nama Kertas
              </h1>
              <span className="font-script text-base text-[#3E5C76] opacity-75 hidden sm:inline">
                catatan hati
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7A746A] font-sans font-medium">
              SURAT YANG DITINGGAL DI MEJA
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Subtle Ambient Player */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0D9C8] text-xs text-[#524E48] bg-[#FDFCFA]">
            <button
              onClick={togglePlay}
              className="hover:text-[#172132] cursor-pointer flex items-center gap-1 text-[11px]"
              title={isPlaying ? 'Jeda Ambien' : 'Putar Ambien'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span className="hidden md:inline font-serif italic">Musik</span>
            </button>
            {isPlaying && (
              <button onClick={toggleMute} className="p-0.5 hover:opacity-100 opacity-60 cursor-pointer">
                {isMuted ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* User Pen Name Pill */}
          <div className="px-3.5 py-1.5 rounded-full border border-[#E0D9C8] text-xs text-[#524E48] bg-[#FDFCFA]">
            Nama kertas: <strong className="font-semibold text-[#172132]">{currentUser.paperName}</strong>
          </div>

          {/* Change Pen Name Button */}
          <button
            onClick={onOpenRename}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E0D9C8] text-xs text-[#524E48] hover:bg-[#F2ECE0] transition-colors cursor-pointer bg-[#FDFCFA]"
          >
            <ArrowRight className="w-3 h-3" />
            <span>Ganti nama</span>
          </button>

          {/* User Drafts Indicator Pill */}
          {draftCount > 0 && (
            <button
              onClick={onOpenDrafts}
              title="Buka draf tulisan yang belum kamu tayangkan"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-700" />
              <span>Draf ({draftCount})</span>
            </button>
          )}

          {/* Write Button */}
          <button
            onClick={onOpenWrite}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#172132] text-white text-xs font-medium hover:bg-[#23314A] transition-all cursor-pointer shadow-xs"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Tulis</span>
          </button>

          {/* Quarantine Button - HANYA MUNCUL UNTUK ADMIN */}
          {currentUser.isAdmin && (
            <button
              onClick={onOpenQuarantine}
              title="Ruang Karantina Konten (Khusus Admin/Kurator)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                quarantineCount > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'border-[#E0D9C8] text-[#7A746A] hover:bg-[#F2ECE0] bg-[#FDFCFA]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Karantina{quarantineCount > 0 ? ` (${quarantineCount})` : ''}</span>
            </button>
          )}

          {/* Admin / Kurator Meja (Stealth / Discreet saat belum login) */}
          {currentUser.isAdmin ? (
            <button
              onClick={onToggleAdmin}
              title="Mode Kurator Meja Aktif (Klik untuk keluar)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border bg-[#172132] text-amber-300 border-[#172132] shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Kurator (Aktif) • Keluar</span>
            </button>
          ) : (
            <button
              onClick={onToggleAdmin}
              title="Akses Kurator (Rahasia)"
              className="p-1.5 rounded-full text-[#8A847A] hover:text-[#172132] hover:bg-[#F2ECE0] transition-all cursor-pointer opacity-30 hover:opacity-100"
            >
              <Lock className="w-3 h-3" />
            </button>
          )}

          {/* Replay Intro Splash Button */}
          <button
            onClick={onReplayIntro}
            title="Lihat kembali pembuka latin Nama Kertas"
            className="p-1.5 rounded-full text-[#7A746A] hover:text-[#172132] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
