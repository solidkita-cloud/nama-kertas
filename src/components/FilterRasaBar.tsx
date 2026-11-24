import React from 'react';
import { Bookmark, FileEdit } from 'lucide-react';
import { type Rasa, RASA_DETAILS } from '../types';

interface FilterRasaBarProps {
  selectedRasa: Rasa | 'ALL';
  onSelectFilter: (rasa: Rasa | 'ALL') => void;
  onOpenSaved: () => void;
  onOpenDrafts: () => void;
  savedCount: number;
  draftCount: number;
  onlySavedFilter: boolean;
  onlyDraftsFilter: boolean;
}

export const FilterRasaBar: React.FC<FilterRasaBarProps> = ({
  selectedRasa,
  onSelectFilter,
  onOpenSaved,
  onOpenDrafts,
  savedCount,
  draftCount,
  onlySavedFilter,
  onlyDraftsFilter,
}) => {
  const rasaList: Rasa[] = ['KALUT', 'GUNJING', 'HARDIK', 'RINDU', 'TENANG'];
  const activeMeta = selectedRasa !== 'ALL' ? RASA_DETAILS[selectedRasa] : null;

  return (
    <div className="space-y-6 pt-4">
      {/* Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A746A] font-sans font-medium mb-1">
            <span>—</span>
            <span>KENALI RASAMU</span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#172132]">
            Cerita di Atas Meja
          </h3>
          <p className="text-xs sm:text-sm text-[#524E48] mt-1 max-w-xl leading-relaxed">
            Masing-masing punya sisinya sendiri. Pilih salah satu rasa untuk menyaring surat dan memutar alunan musiknya, atau baca semuanya tanpa sekat.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Draf Saya */}
          {draftCount > 0 && (
            <button
              onClick={onOpenDrafts}
              title="Draf tulisan yang tersimpan secara lokal di perangkat ini"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                onlyDraftsFilter
                  ? 'bg-[#172132] text-white border-[#172132]'
                  : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-700" />
              <span>Draf Lokal ({draftCount})</span>
            </button>
          )}

          {/* Tombol Surat Tersimpan */}
          <button
            onClick={onOpenSaved}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto shadow-2xs ${
              onlySavedFilter
                ? 'bg-[#172132] text-white border-[#172132]'
                : 'border-[#DCD5C3] bg-[#FDFCFA] text-[#413D38] hover:bg-[#F4EFE3]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Lihat yang kusimpan ({savedCount})</span>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectFilter('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
            selectedRasa === 'ALL' && !onlySavedFilter && !onlyDraftsFilter
              ? 'bg-[#172132] text-white shadow-xs'
              : 'bg-white border border-[#E0D9C8] text-[#524E48] hover:bg-[#F2ECE0]'
          }`}
        >
          Semua Rasa
        </button>

        {rasaList.map((key) => {
          const meta = RASA_DETAILS[key];
          const isSelected = selectedRasa === key && !onlySavedFilter && !onlyDraftsFilter;

          return (
            <button
              key={key}
              onClick={() => onSelectFilter(key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#172132] text-white shadow-xs'
                  : 'bg-white border border-[#E0D9C8] text-[#524E48] hover:bg-[#F2ECE0]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: meta.dotColor }}
              />
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Rasa / Drafts / Saved Banner */}
      {onlyDraftsFilter ? (
        <div className="p-5 sm:p-6 rounded-2xl border border-amber-300 bg-amber-50/80 space-y-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-900 font-semibold">
              <span className="w-2 h-2 rounded-full inline-block bg-amber-600" />
              <span>DRAF LOKAL (HANYA DI PERANGKAT INI)</span>
            </div>
            <button
              onClick={() => onSelectFilter('ALL')}
              className="text-xs text-amber-900 hover:text-black underline font-medium cursor-pointer"
            >
              ← Kembali ke Semua Surat
            </button>
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#172132]">
            Draf di Perangkat Ini
          </h4>

          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
            Draf ini 100% tersimpan secara privat di peramban perangkatmu saja dan tidak pernah dikirim ke server. Orang lain tidak bisa melihat atau mengeditnya. Klik tulisan untuk melanjutkan atau menerbitkannya ke meja.
          </p>
        </div>
      ) : onlySavedFilter ? (
        <div className="p-5 sm:p-6 rounded-2xl border border-[#DCD5C3] bg-[#FDFCFA] space-y-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#7A746A] font-semibold">
              <span className="w-2 h-2 rounded-full inline-block bg-[#172132]" />
              <span>SURAT YANG KAMU SIMPAN</span>
            </div>
            <button
              onClick={() => onSelectFilter('ALL')}
              className="text-xs text-[#172132] underline font-medium cursor-pointer"
            >
              ← Kembali ke Semua Surat
            </button>
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#172132]">
            Koleksi Surat Tersimpan
          </h4>

          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
            Surat-surat berharga dari orang lain yang kamu tandai untuk dibaca kembali sewaktu-waktu.
          </p>
        </div>
      ) : activeMeta ? (
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D2] bg-white/95 space-y-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs pb-1 border-b border-[#F5F0E6]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#7A746A] font-semibold">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: activeMeta.dotColor }}
              />
              <span className="text-[#172132] font-bold">{activeMeta.cardTitle}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#7A746A] italic">
                ♫ Ambien: {activeMeta.ambientName}
              </span>
              <button
                onClick={() => onSelectFilter('ALL')}
                className="text-[11px] text-[#7A746A] hover:text-[#172132] underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed font-serif italic pt-1">
            "{activeMeta.description}"
          </p>
        </div>
      ) : null}
    </div>
  );
};
