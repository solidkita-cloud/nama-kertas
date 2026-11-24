import React from 'react';
import { ArrowRight } from 'lucide-react';
import { type Rasa, RASA_DETAILS } from '../types';

interface LimaRasaCardsProps {
  selectedRasa: Rasa | 'ALL';
  onSelectRasa: (rasa: Rasa) => void;
}

export const LimaRasaCards: React.FC<LimaRasaCardsProps> = ({
  selectedRasa,
  onSelectRasa,
}) => {
  const rasaList: Rasa[] = ['KALUT', 'GUNJING', 'HARDIK', 'RINDU', 'TENANG'];

  return (
    <section className="py-12 sm:py-16 border-b border-[#EBE4D5]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A746A] font-sans font-medium">
              <span>—</span>
              <span>KENALI RASAMU</span>
            </div>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#172132] tracking-tight">
              Lima Rasa
            </h3>
            <p className="text-sm text-[#524E48] max-w-xl leading-relaxed">
              Masing-masing punya sisinya sendiri. Kenali dulu yang sedang kamu rasakan, baru pilih cerita yang mau kamu baca.
            </p>
          </div>

          <div className="text-xs text-[#8A847A] max-w-xs md:text-right">
            Pilih salah satu kartu untuk melihat cerita dengan rasa itu.
          </div>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {rasaList.map((key) => {
            const meta = RASA_DETAILS[key];
            const isSelected = selectedRasa === key;

            return (
              <div
                key={key}
                onClick={() => onSelectRasa(key)}
                className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[300px] ${
                  isSelected
                    ? 'bg-white border-2 border-[#172132] shadow-md scale-[1.01]'
                    : 'bg-white/80 hover:bg-white border border-[#E8E2D2] hover:border-[#D4CBB8] shadow-2xs'
                }`}
              >
                {/* Top Pill / Status */}
                <div className="flex items-center justify-between text-[11px] font-sans pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-1.5 font-medium text-[#413D38]">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: meta.dotColor }}
                    />
                    <span>{meta.label}</span>
                  </div>

                  <span className="text-[10px] text-[#8A847A]">
                    {isSelected ? 'Sedang dipilih' : 'Lihat cerita →'}
                  </span>
                </div>

                {/* Content */}
                <div className="my-4 space-y-2">
                  <h4 className="font-editorial text-xl font-bold text-[#172132]">
                    {meta.cardTitle}
                  </h4>
                  <p className="text-xs text-[#524E48] leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#F0EBE1]">
                  <span className="text-xs font-medium text-[#172132] flex items-center justify-between group">
                    <span>Baca rasa {meta.label}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
