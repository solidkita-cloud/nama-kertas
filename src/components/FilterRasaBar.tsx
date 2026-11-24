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
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#172132]">
            Filter rasa
          </h3>
          <p className="text-xs text-[#7A746A] mt-0.5">
            Bukan kategori. Ini perasaan yang sedang ditulis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Draf Saya */}
          {draftCount > 0 && (
            <button
              onClick={onOpenDrafts}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                onlyDraftsFilter
                  ? 'bg-[#172132] text-white border-[#172132]'
                  : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-700" />
              <span>Draf Saya ({draftCount})</span>
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
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            selectedRasa === 'ALL' && !onlySavedFilter && !onlyDraftsFilter
              ? 'bg-[#172132] text-white shadow-xs'
              : 'bg-white border border-[#E0D9C8] text-[#524E48] hover:bg-[#F2ECE0]'
          }`}
        >
          Semua
        </button>

        {rasaList.map((key) => {
          const meta = RASA_DETAILS[key];
          const isSelected = selectedRasa === key && !onlySavedFilter && !onlyDraftsFilter;

          return (
            <button
              key={key}
              onClick={() => onSelectFilter(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#172132] text-white shadow-xs'
                  : 'bg-white border border-[#E0D9C8] text-[#524E48] hover:bg-[#F2ECE0]'
              }`}
            >
              {meta.label}
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
              <span>DRAF PRIBADI MILIKMU (BELUM DITARUH DI MEJA)</span>
            </div>
            <button
              onClick={() => onSelectFilter('ALL')}
              className="text-xs text-amber-900 hover:text-black underline font-medium cursor-pointer"
            >
              ← Kembali ke Semua Surat
            </button>
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#172132]">
            Draf Surat Tersimpan
          </h4>

          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
            Draf ini baru tersimpan di lemari pribadimu dan belum dapat dibaca oleh siapa pun di meja publik. Klik surat untuk melanjutkan menulis dan menerbitkannya.
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
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8E2D2] bg-white space-y-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#7A746A] font-semibold">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: activeMeta.dotColor }}
            />
            <span>KAMU SEDANG MEMBACA RASA</span>
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#172132]">
            {activeMeta.label}
          </h4>

          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
            {activeMeta.description}
          </p>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8E2D2] bg-white space-y-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#7A746A] font-semibold">
            <span className="w-2 h-2 rounded-full inline-block bg-[#172132]" />
            <span>SEMUA RASA DI ATAS MEJA</span>
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#172132]">
            Semua Cerita
          </h4>

          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
            Membuka seluruh surat yang ditinggalkan penulis tanpa membatasi pada satu perasaan.
          </p>
        </div>
      )}
    </div>
  );
};
