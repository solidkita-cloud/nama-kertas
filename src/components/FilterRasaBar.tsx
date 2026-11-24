import React from 'react';
import { Bookmark } from 'lucide-react';
import { type Rasa, RASA_DETAILS } from '../types';

interface FilterRasaBarProps {
  selectedRasa: Rasa | 'ALL';
  onSelectFilter: (rasa: Rasa | 'ALL') => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export const FilterRasaBar: React.FC<FilterRasaBarProps> = ({
  selectedRasa,
  onSelectFilter,
  onOpenSaved,
  savedCount,
}) => {
  const rasaList: Rasa[] = ['KALUT', 'GUNJING', 'HARDIK', 'RINDU', 'TENANG'];
  const activeMeta = selectedRasa !== 'ALL' ? RASA_DETAILS[selectedRasa] : null;

  return (
    <div className="space-y-6 pt-4">
      {/* Title & "Lihat yang kusimpan" Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#172132]">
            Filter rasa
          </h3>
          <p className="text-xs text-[#7A746A] mt-0.5">
            Bukan kategori. Ini perasaan yang sedang ditulis.
          </p>
        </div>

        <button
          onClick={onOpenSaved}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#DCD5C3] bg-[#FDFCFA] text-xs font-medium text-[#413D38] hover:bg-[#F4EFE3] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Lihat yang kusimpan ({savedCount})</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectFilter('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            selectedRasa === 'ALL'
              ? 'bg-[#172132] text-white shadow-xs'
              : 'bg-white border border-[#E0D9C8] text-[#524E48] hover:bg-[#F2ECE0]'
          }`}
        >
          Semua
        </button>

        {rasaList.map((key) => {
          const meta = RASA_DETAILS[key];
          const isSelected = selectedRasa === key;

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

      {/* Selected Rasa Banner */}
      {activeMeta ? (
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
