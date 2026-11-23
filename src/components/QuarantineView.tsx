import React from 'react';
import { ShieldAlert, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import type { Story } from '../types';

interface QuarantineViewProps {
  quarantinedStories: Story[];
  onBack: () => void;
  onDeleteStory: (storyId: string) => void;
}

export const QuarantineView: React.FC<QuarantineViewProps> = ({
  quarantinedStories,
  onBack,
  onDeleteStory,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCD5C3] bg-white text-xs font-medium text-[#413D38] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="p-7 sm:p-9 rounded-3xl border border-amber-200 bg-[#FFFDF5] space-y-3">
        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Karantina Konten Berlapis</span>
        </div>

        <h2 className="font-editorial text-3xl font-bold text-[#172132]">
          Ruang Karantina Surat
        </h2>

        <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed max-w-xl">
          Nama Kertas menerapkan filter berlapis otomatis untuk menjaga keheningan ruang. Tulisan yang terdeteksi memuat <strong>unsur SARA, pornografi, kata kotor, judi online (judol), ujaran kebencian, atau penyebaran data pribadi</strong> langsung ditampung di sini dan tidak akan pernah tayang ke publik.
        </p>
      </div>

      {/* List of Quarantined items */}
      <div className="space-y-4">
        {quarantinedStories.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#DCD5C3] rounded-3xl bg-white/60 space-y-2">
            <p className="font-serif italic text-sm text-[#7A746A]">
              Karantina kosong. Tidak ada surat yang tertahan saat ini.
            </p>
            <p className="text-xs text-[#8A847A]">
              Semua surat yang beredar memenuhi prinsip kejujuran yang sehat.
            </p>
          </div>
        ) : (
          quarantinedStories.map((story) => {
            const q = story.quarantineDetails;

            return (
              <div
                key={story.id}
                className="p-6 sm:p-7 rounded-2xl border border-red-200 bg-white shadow-2xs space-y-4"
              >
                {/* Top Alert Badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-red-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 text-red-900 font-semibold text-[11px]">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>Tertahan: {q?.categoryLabel || q?.category || 'Konten Terlarang'}</span>
                    </span>

                    <span className="text-[11px] text-[#7A746A]">
                      • {q?.quarantinedAt || story.createdAt}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteStory(story.id)}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    title="Hapus permanen dari karantina"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Surat</span>
                  </button>
                </div>

                {/* Reason description */}
                <div className="text-xs text-red-900/90 leading-relaxed bg-red-50/70 p-3.5 rounded-xl border border-red-100 space-y-1.5">
                  <p className="font-medium">{q?.reason}</p>
                  {q?.matchedWords && q.matchedWords.length > 0 && (
                    <p className="text-[11px] text-red-700 font-mono">
                      Kata/pola terdeteksi: <strong>{q.matchedWords.join(', ')}</strong>
                    </p>
                  )}
                </div>

                {/* Quarantined Title & Content Preview */}
                <div className="space-y-1">
                  <h4 className="font-editorial text-xl font-bold text-[#172132]">
                    {story.title || 'Tanpa Judul'}
                  </h4>
                  <p className="font-serif text-sm text-[#524E48] line-clamp-3 leading-relaxed">
                    {story.content}
                  </p>
                </div>

                {/* Note */}
                <div className="pt-2 text-[11px] text-[#8A847A] italic border-t border-[#F0EBE1]">
                  Surat ini disimpan di karantina pribadimu dan tidak dapat diakses pembaca lain.
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
