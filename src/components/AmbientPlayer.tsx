import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { type Rasa, RASA_DETAILS } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface AmbientPlayerProps {
  currentRasa: Rasa | null;
  isNightMode: boolean;
}

export const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ currentRasa, isNightMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsPlaying(audioEngine.getIsPlaying());
    setIsMuted(audioEngine.getIsMuted());
  }, [currentRasa]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(currentRasa || 'TENANG');
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const activeMeta = currentRasa ? RASA_DETAILS[currentRasa] : RASA_DETAILS['TENANG'];

  return (
    <div
      className={`inline-flex items-center gap-2 text-[11px] font-serif transition-colors ${
        isNightMode ? 'text-[#8DA8C7]' : 'text-[#4A5D73]'
      }`}
    >
      <span className="opacity-70 italic hidden md:inline">
        Ambien: <strong className="not-italic font-normal">{activeMeta.ambientName}</strong>
      </span>

      <button
        onClick={handleTogglePlay}
        className="flex items-center gap-1 hover:underline cursor-pointer opacity-80 hover:opacity-100"
      >
        {isPlaying ? (
          <>
            <Pause className="w-2.5 h-2.5" />
            <span>Jeda</span>
          </>
        ) : (
          <>
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Dengarkan</span>
          </>
        )}
      </button>

      {isPlaying && (
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Bunyikan' : 'Senyapkan'}
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-0.5"
        >
          {isMuted ? <VolumeX className="w-3 h-3 text-amber-500" /> : <Volume2 className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
};
